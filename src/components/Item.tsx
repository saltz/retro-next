import React, {useContext, useState} from "react";
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
import {DeleteOutlined, DislikeOutlined, EditOutlined, HolderOutlined, LikeOutlined} from "@ant-design/icons";
import firebase from "../utils/firebaseClient";
import {ItemTextArea} from "./shared/ItemTextArea";
import {useDocumentData} from "react-firebase-hooks/firestore";
import {VoteDocument, VoteDocumentConverter} from "../models/VoteDocument";
import {VoteContext} from "./Board";
import {Draggable, DraggableProvided, DraggableStateSnapshot} from "react-beautiful-dnd";

interface IProps {
    id: string;
    boardId: string;
    index: number;
    item: ItemDocument;
    itemQuery: firebase.firestore.CollectionReference<ItemDocument>;
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

    const deleteItem = (): void => {
        props.itemQuery.doc(props.id).delete();
        voteQuery.delete();
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
        voteContext.currentVotes?.length === voteContext.maximumAmountOfVotes &&
        !voteContext.currentVotes?.find((i) => i.itemId === props.id);

    console.log(votingDisabled);

    return (
        <Draggable draggableId={props.id} index={props.index}>
            {(provider: DraggableProvided, snapshot: DraggableStateSnapshot) => (
                <div ref={provider.innerRef} {...provider.draggableProps}>
                    <Card style={{margin: "10px"}} loading={snapshot.isDragging}>
                        <Row justify="space-between">
                            <Card.Meta avatar={<UserAvatar size={35} user={props.item.user} tooltip tooltipPlacement="right"/>}/>
                            <HolderOutlined {...provider.dragHandleProps} />
                            <Space size={10}>
                                <Tag color={getVotesColor()}>
                                    {props.item.votes > 0 && "+"}
                                    {props.item.votes}
                                </Tag>
                                <EditOutlined style={{cursor: "pointer"}} onClick={() => setEditing(!editing)}/>
                                <Popconfirm
                                    title="Are you sure to delete this item?"
                                    onConfirm={deleteItem}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <DeleteOutlined style={{color: "#df4040"}}/>
                                </Popconfirm>
                            </Space>

                        </Row>
                        <Row justify="center" style={{ margin: "20px 32px 0 0"}}>
                            {editing ? (
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
                        <Row justify="end">
                            <Tooltip title={votingDisabled() ? `You can no longer vote, you have already voted ${voteContext.maximumAmountOfVotes} times` : undefined}>
                                <Radio.Group
                                    disabled={votingDisabled()}
                                    options={[
                                        {
                                            label: <LikeOutlined/>,
                                            value: "upvote"
                                        },
                                        {
                                            label: <DislikeOutlined/>,
                                            value: "downvote"
                                        }
                                    ]}
                                    optionType="button"
                                    value={currentVote?.state}
                                    onChange={vote}
                                />
                            </Tooltip>
                        </Row>
                    </Card>
                </div>
            )}
        </Draggable>
    )
}