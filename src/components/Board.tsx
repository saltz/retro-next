import React from "react";
import {BoardDocument} from "../models/BoardDocument";
import {Col, Divider, Row, Typography} from "antd";
import {CurrentUsers} from "./board/CurrentUsers";
import {Column} from "./Column";
import {useCollectionData} from "react-firebase-hooks/firestore";
import {VoteDocument} from "../models/VoteDocument";
import firebase from "../utils/firebaseClient";
import {DragDropContext, DropResult} from "react-beautiful-dnd";
import {ItemDocumentConverter} from "../models/ItemDocument";

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

            await query.collection("items").doc(draggedItemDocument.id).update({ header: ""});
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
                        <Typography.Title style={{marginTop: "30px"}}>{props.board.name}</Typography.Title>
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