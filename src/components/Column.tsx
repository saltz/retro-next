import React, {useState} from "react";
import {Avatar, Button, Card, Col, Input, Row, Skeleton, Space, Typography} from "antd";
import firebase from "../utils/firebaseClient";
import {BoardDocumentConverter} from "../models/BoardDocument";
import {ItemDocument, ItemDocumentConverter} from "../models/ItemDocument";
import {useCollection, useCollectionData} from "react-firebase-hooks/firestore";
import {Item} from "./Item";

interface IProps {
    boardId: string;
    header: string;
}

export const Column: React.FC<IProps> = (props: IProps) => {
    const query = firebase
        .firestore()
        .collection("boards")
        .withConverter(BoardDocumentConverter)
        .doc(props.boardId)
        .collection("items")
        .withConverter(ItemDocumentConverter);

    const currentUser = firebase.auth().currentUser;

    const [items, loading] = useCollection<ItemDocument>(query.where("header", "==", props.header));
    const [newItemContent, setNewItemContent] = useState<string>();

    return (
        <>
            <Card>
                <Row justify="space-between">
                    <p style={{ fontWeight: "bold", fontSize: "16px"}}>{props.header}</p>
                    <Space>
                    </Space>
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
                        {items?.docs?.map((item) => <Item id={item.id} item={item.data()} query={query}/>)}
                    </Col>
                </Row>
                <Row justify="end">
                    <Col span={24} style={{ padding: "10px"}}>
                        <Input.TextArea
                            value={newItemContent}
                            placeholder="Press Enter to add item"
                            onChange={(event) => setNewItemContent(event.target.value)}
                            rows={4} onKeyPress={(event) => {
                            if (event.key === "Enter") {
                                query.add(new ItemDocument(props.header, currentUser, newItemContent));
                                setNewItemContent(undefined);
                            }
                        }}/>
                    </Col>
                </Row>
            </Card>
        </>
    );
}