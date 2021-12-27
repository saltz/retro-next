import React, {CSSProperties, useContext, useState} from "react";
import {ItemDocument} from "../models/ItemDocument";
import {
    Card,
    Popconfirm,
    Radio,
    RadioChangeEvent,
    Row,
    Space,
    Tag, Tooltip
} from "antd";
import {UserAvatar} from "./shared/UserAvatar";
import {
    DeleteOutlined,
    DislikeOutlined,
    EditOutlined,
    LikeOutlined,
    RollbackOutlined
} from "@ant-design/icons";
import firebase from "../utils/firebaseClient";
import {ItemTextArea} from "./shared/ItemTextArea";
import {useCollection, useDocumentData} from "react-firebase-hooks/firestore";
import {VoteDocument, VoteDocumentConverter} from "../models/VoteDocument";
import {VoteContext} from "./Board";
import {
    Draggable,
    DraggableProvided, DraggableProvidedDragHandleProps,
    DraggableStateSnapshot,
} from "react-beautiful-dnd";

interface IProps {
    id: string;
    boardId: string;
    index: number;
    item: ItemDocument;
    itemQuery: firebase.firestore.CollectionReference<ItemDocument>;
}

interface IItemCardProps {
    id: string;
    item: ItemDocument;
    itemQuery: firebase.firestore.CollectionReference<ItemDocument>;
    child?: boolean;
    style?: CSSProperties;
    loading?: boolean;
    draggableProps?: DraggableProvidedDragHandleProps;
}

export const Item: React.FC<IProps> = (props: IProps) => {
    const currentUser = firebase.auth().currentUser;
    const voteId: string = `${currentUser.uid}-${props.id}`;
    const voteQuery = firebase.firestore()
        .collection("boards")
        .doc(props.boardId)
        .collection("votes")
        .doc(voteId)
        .withConverter(VoteDocumentConverter);

    const [editing, setEditing] = useState<boolean>(false);
    const [currentVote] = useDocumentData<VoteDocument>(voteQuery);
    const voteContext = useContext(VoteContext);

    const ItemCard = (props: IItemCardProps) => {
        const [childrenSnapshot] = useCollection(props.itemQuery.where("parentId", "==", props.id ?? null));

        const removeFromParentItem = async (id: string) => {
            props.itemQuery.doc(id).update({parentId: null});
        };

        const deleteItem = (): void => {
            props.itemQuery.doc(props.id).delete();

            for (const child of childrenSnapshot?.docs) {
                props.itemQuery.doc(child.id).delete();
            }

            voteQuery.delete();
        };

        const vote = (event: RadioChangeEvent): void => {
            let votes = props.item.votes;


            if (event.target.value === "upvote") {
                if (currentVote?.state === "downvote") {
                    votes = votes + 2
                } else {
                    votes++;
                }
            } else {
                if (currentVote?.state === "upvote") {
                    votes = votes - 2;
                } else {
                    votes--;
                }
            }

            props.itemQuery.doc(props.id).update({votes});

            if (!currentVote) {
                voteQuery.set(new VoteDocument(currentUser.uid, props.id, event.target.value));
            } else {
                voteQuery.update({state: event.target.value});
            }
        };

        const resetVote = (event): void => {
            let votes = props.item.votes;

            if (currentVote?.state === event.target.value) {
                votes = currentVote?.state === "upvote" ? votes - 1 : votes + 1;
                voteQuery.delete();
                props.itemQuery.doc(props.id).update({votes});
            }
        };

        const getVotesColor = (): string => {
            const votes = props.item.votes;
            let color;

            if (votes > 0) {
                color = "lime";
            }
            if (votes >= 3) {
                color = "green";
            }
            if (votes < 0) {
                color = "volcano";
            }
            if (votes <= -3) {
                color = "red";
            }

            return color;
        };

        const votingDisabled = () =>
            voteContext.currentVotes?.length >= voteContext.maximumAmountOfVotes &&
            !voteContext.currentVotes?.find((i) => i.itemId === props.id);

        return (
            <>
                <Card style={{margin: "10px", ...props.style}} {...props.draggableProps}>
                    <Row justify="space-between">
                        <Card.Meta
                            title={currentUser.displayName}
                            avatar={<UserAvatar size={35} user={props.item.user} tooltip tooltipPlacement="right"/>}
                        />
                        {!props.child ? (
                            <Space size={10}>
                                <Tag color={getVotesColor()}>
                                    {props.item.votes > 0 && "+"}
                                    {props.item.votes}
                                </Tag>
                                <EditOutlined className="item-card-edit" style={{cursor: "pointer"}}
                                              onClick={() => setEditing(!editing)}/>
                                <Popconfirm
                                    title="Are you sure you want to delete this item?"
                                    onConfirm={deleteItem}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <DeleteOutlined style={{color: "#df4040"}}/>
                                </Popconfirm>
                            </Space>
                        ) : (
                            <Popconfirm
                                title="Are you sure you want to ungroup this item?"
                                onConfirm={() => removeFromParentItem(props.id)}
                                okText="Yes"
                                cancelText="No"
                            >
                                <RollbackOutlined/>
                            </Popconfirm>
                        )}
                    </Row>
                    <Row justify="center" style={{margin: "20px 32px 0 0"}}>
                        {editing && !props.child ? (
                            <ItemTextArea
                                onPressEnter={(value) => {
                                    if (value) {
                                        props.itemQuery.doc(props.id).update({content: value});
                                    }
                                    setEditing(false);
                                }}
                                defaultValue={props.item.content}
                                margin="30px"
                            />
                        ) : <p>{props.item.content}</p>}
                    </Row>
                    {childrenSnapshot?.docs?.length > 0 && childrenSnapshot?.docs?.map((childItem, index) => (
                        <ItemCard id={childItem.id} key={index} item={childItem.data()} itemQuery={props.itemQuery}
                                  child={true}/>
                    ))}
                    {!props.child && (
                        <Row justify="end">
                            <Tooltip
                                title={votingDisabled() ? `You can no longer vote, you have already voted ${voteContext.maximumAmountOfVotes} times` : undefined}>
                                <Radio.Group
                                    disabled={votingDisabled()}
                                    optionType="button"
                                    value={currentVote?.state}
                                    onChange={vote}
                                >
                                    <Radio.Button value="upvote" onClick={resetVote}>
                                        <LikeOutlined/>
                                    </Radio.Button>
                                    <Radio.Button value="downvote" onClick={resetVote}>
                                        <DislikeOutlined/>
                                    </Radio.Button>
                                </Radio.Group>
                            </Tooltip>
                        </Row>
                    )}
                </Card>
                <style jsx>
                    {`
                      :global(.item-card-edit:hover) {
                        color: #7058ff;
                      }
                    `}
                </style>
            </>
        );
    };

    return (
        <Draggable draggableId={props.id} index={props.index}>
            {(provider: DraggableProvided, snapshot: DraggableStateSnapshot) => (
                <div ref={provider.innerRef} {...provider.draggableProps}>
                    <ItemCard
                        id={props.id}
                        item={props.item}
                        itemQuery={props.itemQuery}
                        style={{backgroundColor: !!snapshot.combineTargetFor ? "#7058ff05" : ""}}
                        loading={snapshot.isDragging}
                        draggableProps={provider.dragHandleProps}
                    />
                </div>
            )}
        </Draggable>
    );
}