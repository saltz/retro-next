import { Card, Col, Divider, Row } from "antd";
import { NextPage } from "next";
import { CreateBoardForm } from "../components/forms/CreateBoardForm";
import { GradientHeader } from "../components/shared/GradientHeader";
import {
    IPageProps,
    withAuthentication,
} from "../components/withAuthentication";

const Index: NextPage<IPageProps> = (): JSX.Element => (
    <>
        <Row justify="center" align="middle">
            <GradientHeader
                text="Retro Next"
                gradient={"90deg, rgb(112, 88, 255) 35%, rgb(1, 183, 240) 100%"}
                fontSize="60px"
                fontWeight={600}
                style={{ margin: "80px 0 80px" }}
            />
        </Row>
        <Row justify="center" align="middle">
            <Col sm={8} md={6} lg={8}>
                <Card>
                    <GradientHeader
                        text="Create Board"
                        gradient={
                            "275deg, rgba(204,0,242,1) 18%, rgba(112,88,255,1) 100%"
                        }
                        fontSize="24px"
                    />
                    <Divider />
                    <CreateBoardForm />
                </Card>
            </Col>
        </Row>
    </>
);

export default withAuthentication(Index);
