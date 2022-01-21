import React, { useState } from "react";
import { BoardDocument } from "../../models/BoardDocument";
import { Col, Divider, Row, Space, Tooltip } from "antd";
import { CurrentUsers } from "./CurrentUsers";
import { Column } from "../column/Column";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { VoteDocument } from "../../models/VoteDocument";
import firebase from "../../utils/firebaseClient";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { GradientHeader } from "../shared/GradientHeader";
import { CameraOutlined, CheckOutlined, CopyOutlined } from "@ant-design/icons";
import html2canvas from "html2canvas";
import moment from "moment";
import { downloadFile } from "../../utils/exportingUtils";

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
    const query = firebase.firestore().collection("boards").doc(props.id);

    const [currentVotes] = useCollectionData<VoteDocument>(
        query.collection("votes").where("userId", "==", currentUser.uid)
    );
    const [keyCopied, setKeyCopied] = useState<boolean>(false);

    const onDragEnd = async (result: DropResult) => {
        if (result.combine) {
            const votes = await query
                .collection("votes")
                .where("itemId", "==", result.draggableId)
                .get();

            for (const vote of votes.docs) {
                await query.collection("votes").doc(vote.id).delete();
            }

            await query.collection("items").doc(result.draggableId).update({
                parentId: result.combine.draggableId,
                votes: 0,
            });

            return;
        }

        if (result.destination) {
            await query.collection("items").doc(result.draggableId).update({
                column: result.destination.droppableId,
                index: result.destination.index,
            });
        }
    };

    const takeBoardScreenshot = async (): Promise<void> => {
        const canvas = await html2canvas(document.getElementById("board"), {
            allowTaint: true,
            useCORS: true,
            backgroundColor: window
                .getComputedStyle(document.body, null)
                .getPropertyValue("background-color"),
        });

        canvas.toBlob((blob) => downloadFile(props.board.name, ".png", blob));
    };

    return (
        <VoteContext.Provider
            value={{
                currentVotes: currentVotes,
                maximumAmountOfVotes: props.board.maximumVotes,
            }}
        >
            <DragDropContext onDragEnd={onDragEnd}>
                <div style={{ padding: "0 30px 0" }}>
                    <Row justify="center">
                        <Space>
                            <GradientHeader
                                text={props.board.name}
                                fontSize="48px"
                                gradient={
                                    "140deg, rgba(80,227,194,1) 25%, rgba(95,24,175,1) 83%"
                                }
                            />
                            <Tooltip title="Copy board key" placement="right">
                                {keyCopied ? (
                                    <CheckOutlined
                                        style={{ fontSize: "20px" }}
                                    />
                                ) : (
                                    <CopyOutlined
                                        style={{
                                            fontSize: "20px",
                                            cursor: "pointer",
                                        }}
                                        onClick={() => {
                                            navigator.clipboard.writeText(
                                                props.id
                                            );
                                            setKeyCopied(true);
                                            setTimeout(
                                                () => setKeyCopied(false),
                                                1000
                                            );
                                        }}
                                    />
                                )}
                            </Tooltip>
                        </Space>
                    </Row>
                    <Divider />
                    <Row
                        justify="space-between"
                        style={{ marginBottom: "20px" }}
                    >
                        <Tooltip
                            title="Take a full board screenshot"
                            placement="right"
                        >
                            <CameraOutlined onClick={takeBoardScreenshot} />
                        </Tooltip>
                        <CurrentUsers boardId={props.id} />
                        <div />
                    </Row>
                    <Row id="board" justify="center" gutter={[32, 0]}>
                        <Col lg={8}>
                            <Column
                                boardId={props.id}
                                board={props.board}
                                header="What went well 👏"
                            />
                        </Col>
                        <Col lg={8}>
                            <Column
                                boardId={props.id}
                                board={props.board}
                                header="Things to improve 🔨"
                            />
                        </Col>
                        <Col lg={8}>
                            <Column
                                boardId={props.id}
                                board={props.board}
                                header="Action items 📋"
                            />
                        </Col>
                    </Row>
                </div>
            </DragDropContext>
        </VoteContext.Provider>
    );
};
