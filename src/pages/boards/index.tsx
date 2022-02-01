import {
    DeleteOutlined,
    ExportOutlined,
    HomeOutlined,
    LoadingOutlined,
} from "@ant-design/icons";
import { Button, Divider, Popconfirm, Row, Space, Tooltip } from "antd";
import { NextPage } from "next";
import Link from "next/link";
import React, { useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { BoardCard } from "../../components/board/BoardCard";
import { LoadingBoardCard } from "../../components/board/LoadingBoardCard";
import { GradientHeader } from "../../components/shared/GradientHeader";
import {
    IPageProps,
    withAuthentication,
} from "../../components/withAuthentication";
import {
    BoardDocument,
    BoardDocumentConverter,
} from "../../models/BoardDocument";
import { ColumnDocumentConverter } from "../../models/ColumnDocument";
import { ItemDocumentConverter } from "../../models/ItemDocument";
import {
    downloadJsonFile,
    exportBoardToJson,
} from "../../utils/exportingUtils";
import firebase from "../../utils/firebaseClient";
import QueryDocumentSnapshot = firebase.firestore.QueryDocumentSnapshot;

const Index: NextPage<IPageProps> = (props: IPageProps): JSX.Element => {
    const [boards, loading] = useCollection<BoardDocument>(
        firebase
            .firestore()
            .collection("boards")
            .withConverter(BoardDocumentConverter)
            .where("owner", "==", props.user.uid ?? "undefined")
    );
    const [exportLoading, setExportLoading] = useState<boolean>(false);

    const deleteAllBoards = (): void => {
        for (const board of boards.docs) {
            firebase.firestore().collection("boards").doc(board.id).delete();
        }
    };

    const exportAllBoards = async (): Promise<void> => {
        setExportLoading(true);

        const data: object[] = [];

        for (const board of boards.docs) {
            const query = firebase
                .firestore()
                .collection("boards")
                .doc(board.id);

            const itemsSnapshot = await query
                .collection("items")
                .withConverter(ItemDocumentConverter)
                .get();

            const columnsSnapshot = await query
                .collection("columns")
                .withConverter(ColumnDocumentConverter)
                .get();

            data.push(exportBoardToJson(board, itemsSnapshot, columnsSnapshot));
        }

        downloadJsonFile("all boards", data);
        setExportLoading(false);
    };

    return (
        <>
            <Row justify="center">
                <GradientHeader
                    text="My Boards"
                    gradient="119deg, rgba(131,58,180,1) 0%, rgba(253,29,29,1) 65%, rgba(252,176,69,1) 100%"
                    fontSize="48px"
                    style={{ margin: "65px 0" }}
                />
            </Row>
            <Row justify="center">
                <Space>
                    <Tooltip title="Go to home">
                        <div>
                            <Link href="/" passHref={true}>
                                <Button
                                    icon={
                                        <HomeOutlined
                                            style={{ marginTop: "7px" }}
                                        />
                                    }
                                    type="link"
                                />
                            </Link>
                        </div>
                    </Tooltip>
                    {boards?.docs?.length > 0 && (
                        <>
                            <Tooltip title="Export all boards to JSON">
                                <Button
                                    icon={
                                        !exportLoading ? (
                                            <ExportOutlined />
                                        ) : (
                                            <LoadingOutlined spin />
                                        )
                                    }
                                    type="link"
                                    onClick={() => exportAllBoards()}
                                />
                            </Tooltip>
                            <Tooltip title="Delete all boards">
                                <Popconfirm
                                    title="Are you sure you want to delete all you boards?"
                                    onConfirm={deleteAllBoards}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <Button
                                        icon={<DeleteOutlined />}
                                        type="link"
                                    />
                                </Popconfirm>
                            </Tooltip>
                        </>
                    )}
                </Space>
            </Row>
            <Divider />
            <Row justify="center" gutter={[32, 32]} style={{ margin: "unset" }}>
                {loading && <LoadingBoardCard />}
                {boards?.docs?.map(
                    (snapshot: QueryDocumentSnapshot<BoardDocument>) => (
                        <BoardCard key={snapshot.id} snapshot={snapshot} />
                    )
                )}
            </Row>
        </>
    );
};

export default withAuthentication(Index);
