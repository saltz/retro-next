import React from "react";
import {BoardDocument} from "../models/BoardDocument";
import {Avatar, Col, Divider, Row, Typography} from "antd";
import {UserAvatar} from "./shared/UserAvatar";
import {CurrentUsers} from "./board/CurrentUsers";
import {Column} from "./Column";

interface IProps {
    id: string;
    board: BoardDocument;
}

export const Board: React.FC<IProps> = (props: IProps): JSX.Element => {

    return (
        <div style={{ padding: "0 30px 0"}}>
            <Row justify="center">
                <Typography.Title style={{ marginTop: "30px"}}>{props.board.name}</Typography.Title>
            </Row>
            <Divider/>
            <Row justify="center" style={{ marginBottom: "20px"}}>
                <CurrentUsers boardId={props.id}/>
            </Row>
            <Row justify="center" gutter={[32, 0]}>
                <Col lg={8}>
                    <Column boardId={props.id} header="Went well"/>
                </Col>
                <Col lg={8}>
                    <Column boardId={props.id} header="To improve"/>
                </Col>
                <Col lg={8}>
                    <Column boardId={props.id} header="Action items"/>
                </Col>
            </Row>
        </div>
    );
};