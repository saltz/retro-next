import React from "react";
import { Card, Col } from "antd";

export const LoadingBoardCard: React.FC = (): JSX.Element => (
    <Col span={5}>
        <Card loading={true}>
            <Card.Meta />
        </Card>
    </Col>
);
