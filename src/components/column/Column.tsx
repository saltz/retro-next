import React from "react";
import { Avatar, Card, Col, Row, Skeleton } from "antd";
import firebase from "../../utils/firebaseClient";
import {
    BoardDocument,
    BoardDocumentConverter,
} from "../../models/BoardDocument";
import { ItemDocument, ItemDocumentConverter } from "../../models/ItemDocument";
import { useCollection } from "react-firebase-hooks/firestore";
import { Item } from "../item/Item";
import { ItemTextArea } from "../item/ItemTextArea";
import { Droppable, DroppableProvided } from "react-beautiful-dnd";

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
            .where("column", "==", props.header)
            .where("parentId", "==", null)
            .orderBy("index", "asc")
    );

    return (
        <Droppable
            droppableId={props.header}
            type="COLUMN"
            isCombineEnabled={true}
        >
            {(provider: DroppableProvided, snapshot) => (
                <div ref={provider.innerRef} {...provider.droppableProps}>
                    <Card
                        style={{
                            background: snapshot.isDraggingOver
                                ? "#7058ff05"
                                : "",
                        }}
                    >
                        <Row justify="space-between">
                            <p style={{ fontWeight: "bold", fontSize: "16px" }}>
                                {props.header}
                            </p>
                        </Row>
                        <Row>
                            <Col span={24}>
                                {loading && (
                                    <Card>
                                        <Skeleton loading={true} avatar active>
                                            <Card.Meta
                                                avatar={
                                                    <Avatar src="https://joeschmoe.io/api/v1/random" />
                                                }
                                                title="Card title"
                                                description="This is the description"
                                            />
                                        </Skeleton>
                                    </Card>
                                )}

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
                            </Col>
                        </Row>
                        {provider.placeholder}
                        <Row justify="end">
                            <Col span={24} style={{ padding: "10px" }}>
                                <ItemTextArea
                                    onPressEnter={(value) => {
                                        if (value) {
                                            query.add(
                                                new ItemDocument(
                                                    props.header,
                                                    items?.docs?.length ?? 0,
                                                    currentUser,
                                                    value
                                                )
                                            );
                                        }
                                    }}
                                />
                            </Col>
                        </Row>
                    </Card>
                </div>
            )}
        </Droppable>
    );
};
