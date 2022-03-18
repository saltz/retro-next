import {
    CameraOutlined,
    CheckOutlined,
    CopyOutlined,
    ExportOutlined,
    SortDescendingOutlined,
} from "@ant-design/icons";
import { Col, Divider, Row, Space, Tooltip } from "antd";
import html2canvas from "html2canvas";
import React, { useState } from "react";
import {
    DragDropContext,
    Droppable,
    DroppableProvided,
    DropResult,
} from "react-beautiful-dnd";
import { useCollectionData } from "react-firebase-hooks/firestore";
import {
    BoardDocument,
    BoardDocumentConverter,
} from "../../models/BoardDocument";
import {
    ColumnDocument,
    ColumnDocumentConverter,
} from "../../models/ColumnDocument";
import { ItemDocument, ItemDocumentConverter } from "../../models/ItemDocument";
import { VoteDocument } from "../../models/VoteDocument";
import { groupBy, reorder } from "../../utils/collectionUtils";
import {
    downloadFile,
    downloadJsonFile,
    exportBoardToJson,
} from "../../utils/exportingUtils";
import firebase from "../../utils/firebaseClient";
import { Column } from "../column/Column";
import { GradientHeader } from "../shared/GradientHeader";
import { BoardContext } from "./BoardContext";
import { CurrentUsers } from "./CurrentUsers";

interface IProps {
    id: string;
    board: BoardDocument;
}

export const Board: React.FC<IProps> = (props: IProps): JSX.Element => {
    const currentUser = firebase.auth().currentUser;
    const query = firebase.firestore().collection("boards").doc(props.id);

    const [currentVotes] = useCollectionData<VoteDocument>(
        query.collection("votes").where("userId", "==", currentUser.uid)
    );
    const [columns] = useCollectionData<ColumnDocument>(
        query
            .collection("columns")
            .withConverter(ColumnDocumentConverter)
            .orderBy("index", "asc")
    );

    const [keyCopied, setKeyCopied] = useState<boolean>(false);

    const onDragEnd = async (result: DropResult) => {
        if (result.type === "ITEM") {
            await onItemDragEnd(result);
            return;
        }

        if (result.destination) {
            const orderedColumns = reorder(
                columns,
                result.source.index,
                result.destination.index
            );

            for (const column of columns) {
                await query
                    .collection("columns")
                    .doc(column.id)
                    .update({
                        index: orderedColumns.findIndex(
                            (i) => i.id === column.id
                        ),
                    });
            }
        }
    };

    const onItemDragEnd = async (result: DropResult) => {
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
            if (result.source.index !== result.destination.index) {
                const items = await query
                    .collection("items")
                    .withConverter(ItemDocumentConverter)
                    .where("column", "==", result.destination.droppableId)
                    .where("parentId", "==", null)
                    .orderBy("index", "asc")
                    .get();

                const orderedItems = reorder(
                    items.docs.map((doc) => doc.data()),
                    result.source.index,
                    result.destination.index
                );

                for (const item of items.docs) {
                    const data = item.data();
                    await query
                        .collection("items")
                        .doc(item.id)
                        .update({
                            index: orderedItems.findIndex(
                                (i) =>
                                    i.content === data.content &&
                                    i.column === data.column &&
                                    i.user.uid === data.user.uid
                            ),
                        });
                }
            }

            await query.collection("items").doc(result.draggableId).update({
                column: result.destination.droppableId,
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

    const exportBoard = async (): Promise<void> => {
        downloadJsonFile(
            props.board.name,
            exportBoardToJson(
                await query.withConverter(BoardDocumentConverter).get(),
                await query
                    .collection("items")
                    .withConverter(ItemDocumentConverter)
                    .get(),
                await query
                    .collection("columns")
                    .withConverter(ColumnDocumentConverter)
                    .get()
            )
        );
    };

    const orderItemsByVotes = async (): Promise<void> => {
        const itemDocuments = await query
            .collection("items")
            .withConverter(ItemDocumentConverter)
            .get();
        const items = itemDocuments.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        const groupedItems = groupBy<ItemDocument>(items, "column");

        for (const group in groupedItems) {
            const orderedItems = groupedItems[group].sort((a, b) =>
                a.votes < b.votes ? 1 : -1
            );

            for (let i = 0; i < orderedItems.length; i++) {
                await query
                    .collection("items")
                    .doc(orderedItems[i].id)
                    .update({ index: i });
            }
        }
    };

    return (
        <>
            <BoardContext.Provider
                value={{
                    boardId: props.id,
                    board: props.board,
                    currentVotes: currentVotes,
                    maximumAmountOfVotes: props.board.maximumVotes,
                }}
            >
                <DragDropContext onDragEnd={onDragEnd}>
                    <div style={{ padding: "0 30px 0" }}>
                        <Row>
                            <Col span={24}>
                                <Row justify="center">
                                    <Space>
                                        <GradientHeader
                                            text={props.board.name}
                                            fontSize="48px"
                                            gradient={
                                                "140deg, rgba(80,227,194,1) 25%, rgba(95,24,175,1) 83%"
                                            }
                                        />
                                        <Tooltip
                                            title="Copy board url"
                                            placement="right"
                                        >
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
                                                            window.location.href
                                                        );
                                                        setKeyCopied(true);
                                                        setTimeout(
                                                            () =>
                                                                setKeyCopied(
                                                                    false
                                                                ),
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
                                    <Space>
                                        <Tooltip
                                            title="Take a full board screenshot"
                                            placement="right"
                                        >
                                            <CameraOutlined
                                                onClick={takeBoardScreenshot}
                                            />
                                        </Tooltip>
                                        <Tooltip
                                            title="Export the board to JSON"
                                            placement="right"
                                        >
                                            <ExportOutlined
                                                onClick={exportBoard}
                                            />
                                        </Tooltip>
                                        <Tooltip
                                            title="Order all items by the number of votes"
                                            placement="right"
                                        >
                                            <SortDescendingOutlined
                                                onClick={orderItemsByVotes}
                                            />
                                        </Tooltip>
                                    </Space>

                                    <CurrentUsers boardId={props.id} />
                                    <div />
                                </Row>
                            </Col>
                        </Row>
                        <Droppable
                            droppableId={props.id}
                            isCombineEnabled={false}
                            type="COLUMN"
                            direction="horizontal"
                        >
                            {(provider: DroppableProvided) => (
                                <div
                                    ref={provider.innerRef}
                                    {...provider.droppableProps}
                                >
                                    <div
                                        className="scroll-container"
                                        style={{ overflow: "scroll hidden" }}
                                    >
                                        <div
                                            id="board"
                                            style={{
                                                display: "flex",
                                                justifyContent: "center",
                                                width:
                                                    columns?.length > 3
                                                        ? "fit-content"
                                                        : "100%",
                                            }}
                                        >
                                            {columns?.map((column) => (
                                                <div
                                                    key={column.id}
                                                    style={{
                                                        width:
                                                            columns?.length > 3
                                                                ? "600px"
                                                                : "800px",
                                                        marginRight: "25px",
                                                    }}
                                                >
                                                    <Column
                                                        column={column}
                                                        firstColumn={columns[0]}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </Droppable>
                    </div>
                </DragDropContext>
            </BoardContext.Provider>
            <style jsx>{`
                .scroll-container {
                    scrollbar-width: thin;
                }

                .scroll-container::-webkit-scrollbar {
                    height: 10px;
                }

                .scroll-container::-webkit-scrollbar-thumb {
                    background: #666;
                    border-radius: 20px;
                }

                .dark .scroll-container::-webkit-scrollbar-track {
                    background: #0d1117;
                }

                .scroll-container::-webkit-scrollbar-track {
                    border-radius: 20px;
                }
            `}</style>
        </>
    );
};
