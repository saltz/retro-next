import React from "react";
import {ItemDocument} from "../models/ItemDocument";
import {Avatar, Button, Card, Divider, Popconfirm, Row, Skeleton, Space, Tag} from "antd";
import {UserAvatar} from "./shared/UserAvatar";
import {DeleteOutlined, DislikeOutlined, LikeOutlined} from "@ant-design/icons";
import firebase from "../utils/firebaseClient";

interface IProps {
    id: string;
    item: ItemDocument;
    query: firebase.firestore.CollectionReference<ItemDocument>;
}

export const Item: React.FC<IProps> = (props: IProps) => {
    const upVote = (): void => {
        props.query.doc(props.id).update({
            votes: props.item.votes + 1,
        });
    };

    const downVote = (): void => {
        props.query.doc(props.id).update({
            votes: props.item.votes - 1,
        })
    }

    const deleteItem = (): void => {
        props.query.doc(props.id).delete();
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

    return (
        <Card style={{margin: "10px"}}>
            <Row justify="space-between">
                <Card.Meta avatar={<UserAvatar size={35} user={props.item.user}/>}/>
                <Space size={10}>
                    <Tag color={getVotesColor()}>
                        {props.item.votes > 0 && "+"}
                        {props.item.votes}
                    </Tag>
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
            <Row justify="center">
                <p>{props.item.content}</p>
            </Row>
            <Row justify="end">
                <Space>
                    <Button onClick={upVote}>
                        <LikeOutlined/>
                    </Button>
                    <Button onClick={downVote}>
                        <DislikeOutlined/>
                    </Button>
                </Space>
            </Row>
        </Card>
    )
}