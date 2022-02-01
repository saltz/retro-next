import { Card, Col } from "antd";
import React from "react";

export const LoadingBoardCard: React.FC = (): JSX.Element => (
    <Col span={5}>
        <Card loading={true}>
            <Card.Meta />
        </Card>
    </Col>
);
