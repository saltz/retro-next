import React from "react";
import {Avatar, Card, Col, Row, Skeleton, Space} from "antd";
import firebase from "../utils/firebaseClient";
import {BoardDocument, BoardDocumentConverter} from "../models/BoardDocument";
import {ItemDocument, ItemDocumentConverter} from "../models/ItemDocument";
import {useCollection} from "react-firebase-hooks/firestore";
import {Item} from "./Item";
import {ItemTextArea} from "./shared/ItemTextArea";
import {Droppable, DroppableProvided} from "react-beautiful-dnd";

interface IProps {
    boardId: string;
    board: BoardDocument;
    header: string;
}

export const Column: React.FC<IProps> = (props: IProps) => {
    const currentUser = firebase.auth().currentUser;
    const query = firebase
        .firestore()
        .collection("boards")
        .withConverter(BoardDocumentConverter)
        .doc(props.boardId)
        .collection("items")
        .withConverter(ItemDocumentConverter);

    const [items, loading] = useCollection<ItemDocument>(
        query
            .where("header", "==", props.header)
            .orderBy("index", "asc")
    );

    return (
        <>
            <Card>
                <Row justify="space-between">
                    <p style={{fontWeight: "bold", fontSize: "16px"}}>{props.header}</p>
                </Row>
                <Row>
                    <Col span={24}>
                        {loading && (
                            <Card>
                                <Skeleton loading={true} avatar active>
                                    <Card.Meta
                                        avatar={<Avatar src="https://joeschmoe.io/api/v1/random"/>}
                                        title="Card title"
                                        description="This is the description"
                                    />
                                </Skeleton>
                            </Card>
                        )}
                        <Droppable
                            droppableId={props.header}
                            type="COLUMN"
                            direction="vertical"
                        >
                            {(provider: DroppableProvided) => (
                                <div ref={provider.innerRef} {...provider.droppableProps}>
                                    {items?.docs?.map((item, index) => (
                                        <Item
                                            key={item.id}
                                            id={item.id}
                                            index={index}
                                            boardId={props.boardId}
                                            item={item.data()}
                                            itemQuery={query}
                                        />
                                    ))}
                                </div>
                            )}
                        </Droppable>
                    </Col>
                </Row>
                <Row justify="end">
                    <Col span={24} style={{padding: "10px"}}>
                        <ItemTextArea
                            onPressEnter={(value) => {
                                query.add(new ItemDocument(props.header, items?.docs?.length ?? 0, currentUser, value));
                            }}
                        />
                    </Col>
                </Row>
            </Card>
        </>
    );
}