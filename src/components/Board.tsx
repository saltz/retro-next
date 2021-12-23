import React, {useState} from "react";
import {BoardDocument} from "../models/BoardDocument";
import {Col, Divider, Row, Space, Tooltip} from "antd";
import {CurrentUsers} from "./board/CurrentUsers";
import {Column} from "./Column";
import {useCollectionData} from "react-firebase-hooks/firestore";
import {VoteDocument} from "../models/VoteDocument";
import firebase from "../utils/firebaseClient";
import {DragDropContext, DropResult} from "react-beautiful-dnd";
import {ItemDocumentConverter} from "../models/ItemDocument";
import {GradientHeader} from "./shared/GradientHeader";
import {CheckOutlined, CopyOutlined} from "@ant-design/icons";

interface IProps {
    id: string;
    board: BoardDocument;
}

interface IVoteContext {
    currentVotes: VoteDocument[];
    maximumAmountOfVotes: number;
}

export const VoteContext = React.createContext<IVoteContext>({
    currentVotes: [],
    maximumAmountOfVotes: 0,
});

export const Board: React.FC<IProps> = (props: IProps): JSX.Element => {
    const currentUser = firebase.auth().currentUser;
    const query = firebase
        .firestore()
        .collection("boards")
        .doc(props.id);

    const [currentVotes] = useCollectionData<VoteDocument>(
        query
            .collection("votes")
            .where("userId", "==", currentUser.uid)
    );
    const [keyCopied, setKeyCopied] = useState<boolean>(false);

    const onDragEnd = async (result: DropResult) => {
        if (result.combine) {
            const draggedItemDocument = await query.collection("items").withConverter(ItemDocumentConverter).doc(result.draggableId).get();

            await query.collection("items")
                .withConverter(ItemDocumentConverter)
                .doc(result.combine.draggableId)
                .update({
                    children: firebase.firestore.FieldValue.arrayUnion(ItemDocumentConverter.toFirestore({
                        ...draggedItemDocument.data(),
                        id: result.draggableId,
                        parentId: result.combine.draggableId,
                    })),
                });

            const votes = await query.collection("votes").where("itemId", "==", result.draggableId).get();
            votes.docs.forEach((vote) => query.collection("votes").doc(vote.id).delete());
            await query.collection("items").doc(draggedItemDocument.id).update({header: "", votes: 0});
        }

        if (result.destination) {
            await query
                .collection("items")
                .doc(result.draggableId)
                .update({header: result.destination.droppableId, index: result.destination.index});
        }
    };

    return (
        <VoteContext.Provider
            value={{
                currentVotes: currentVotes,
                maximumAmountOfVotes: props.board.maximumVotes
            }}
        >
            <DragDropContext onDragEnd={onDragEnd}>
                <div style={{padding: "0 30px 0"}}>
                    <Row justify="center">
                        <Space>
                            <GradientHeader
                                text={props.board.name}
                                fontSize="48px"
                                gradient={"140deg, rgba(80,227,194,1) 25%, rgba(95,24,175,1) 83%"}
                            />
                            <Tooltip
                                title="Copy board key"
                                placement="right"
                            >
                                {keyCopied ? (
                                    <CheckOutlined style={{fontSize: "20px"}} />
                                ) : (
                                    <CopyOutlined
                                        style={{fontSize: "20px", cursor: "pointer"}}
                                        onClick={() => {
                                            navigator.clipboard.writeText(props.id);
                                            setKeyCopied(true);
                                            setTimeout(() => setKeyCopied(false), 1000);
                                        }}
                                    />
                                )}
                            </Tooltip>
                        </Space>
                    </Row>
                    <Divider/>
                    <Row justify="center" style={{marginBottom: "20px"}}>
                        <CurrentUsers boardId={props.id}/>
                    </Row>
                    <Row justify="center" gutter={[32, 0]}>
                        <Col lg={8}>
                            <Column
                                boardId={props.id}
                                board={props.board}
                                header="Went well"
                            />
                        </Col>
                        <Col lg={8}>
                            <Column
                                boardId={props.id}
                                board={props.board}
                                header="To improve"
                            />
                        </Col>
                        <Col lg={8}>
                            <Column
                                boardId={props.id}
                                board={props.board}
                                header="Action items"
                            />
                        </Col>
                    </Row>
                </div>
            </DragDropContext>
        </VoteContext.Provider>
    );
};