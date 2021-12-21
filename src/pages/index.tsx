import {NextPage} from "next";
import {AppLayout} from "../layouts/AppLayout";
import {Button, Card, Col, Divider, Row, Typography} from "antd";
import {JoinBoardForm} from "../components/JoinBoardForm";
import {CreateBoardForm} from "../components/CreateBoardForm";
import {useChannel} from "../hooks/useChannel";
import {useState} from "react";
import {Types} from "ably";
import {Board} from "../models/Board";
import {GradientHeader} from "../components/GradientHeader";

const Index: NextPage = (): JSX.Element => {
    const [messages, setMessasges] = useState<string[]>([]);

    const [channel, ably] = useChannel<Board>("boards", (message) => {
        console.log("callback", message);
        setMessasges([
            ...messages,
            message.data.name,
        ]);
    });

    return (
        <>
            <AppLayout>
                <Row justify="center" align="middle">
                    <GradientHeader
                        className="app-title"
                        text="Retro Next"
                        gradient={"90deg, rgb(112, 88, 255) 35%, rgb(1, 183, 240) 100%"}
                        fontSize="60px"
                        fontWeight={600}
                    />
                </Row>
                <Row justify="center" align="middle">
                    <Col sm={{span: 8}} md={{span: 6}} lg={4}>
                        <Card>
                            <GradientHeader
                                text="Create Board"
                                gradient={"275deg, rgba(204,0,242,1) 18%, rgba(112,88,255,1) 100%"}
                                fontSize="24px"
                            />
                            <Divider/>
                            <CreateBoardForm/>
                        </Card>
                    </Col>
                    <Col sm={{span: 8, offset: 1}} md={{span: 6, offset: 1}} lg={{span: 4, offset: 1}}>
                        <Card>
                            <GradientHeader
                                text="Join Board"
                                gradient={"50deg, rgba(1,183,240,1) 30%, rgba(0,255,198,1) 100%"}
                                fontSize="24px"
                            />
                            <Divider/>
                            <JoinBoardForm/>
                        </Card>
                    </Col>
                </Row>
            </AppLayout>
            <style jsx>
                {`
                  :global(.app-title) {
                    margin: 80px 0 20vh !important;
                  }
                `}
            </style>
        </>

    );
}

export default Index;