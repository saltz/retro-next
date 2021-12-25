import React, {useState} from "react";
import {NextPage} from "next";
import {Button, Card, Col, Descriptions, Divider, InputNumber, Popconfirm, Row, Space, Tooltip} from "antd";
import {GradientHeader} from "../../components/shared/GradientHeader";
import firebase from "../../utils/firebaseClient";
import {useCollection, useCollectionData} from "react-firebase-hooks/firestore";
import {BoardDocument, BoardDocumentConverter, boardDocumentValidationSchema} from "../../models/BoardDocument";
import {
    CheckOutlined,
    DeleteOutlined,
    EditOutlined,
    ExportOutlined,
    HomeOutlined,
    LoadingOutlined, SelectOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import {ItemDocumentConverter} from "../../models/ItemDocument";
import {QueryDocumentSnapshot} from "@firebase/firestore";
import {IPageProps, withAuthentication} from "../../components/withAuthentication";
import {FormBase} from "../../components/forms/FormBase";
import {InputControl} from "../../components/forms/controls/InputControl";
import {FormControlBase} from "../../components/forms/controls/FormControlBase";
import moment from "moment";

const Index: NextPage<IPageProps> = (props: IPageProps): JSX.Element => {
    const [boards, loading] = useCollection<BoardDocument>(firebase
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

    const downloadJsonFile = (name: string, data: object): void => {
        const blob = new Blob([JSON.stringify(data)], { type: "text/json" })
        const a = document.createElement('a')
        a.download = `${name} export ${moment().format("DD-MM-YYYY")}.json`;
        a.href = window.URL.createObjectURL(blob)
        const clickEvt = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true,
        });
        a.dispatchEvent(clickEvt);
        a.remove();
    };

    const exportAllBoards = async (): Promise<void> => {
        setExportLoading(true);

        const data: object[] = [];

        for (const board of boards.docs) {
            const itemsSnapshot = await firebase
                .firestore().collection("boards").doc(board.id)
                .collection("items")
                .withConverter(ItemDocumentConverter)
                .get();

            data.push({
                ...board.data(),
                items: itemsSnapshot.docs.map((item) => item.data()),
            });
        }

        downloadJsonFile("all boards", data);
        setExportLoading(false);
    };

    const BoardCard = ({snapshot}: { snapshot: QueryDocumentSnapshot<BoardDocument> }): JSX.Element => {
        const board = snapshot.data();
        const query = firebase.firestore().collection("boards").doc(snapshot.id);

        const [editing, setEditing] = useState<boolean>(false);

        const [items, itemsLoading] = useCollectionData(
            query
                .collection("items")
                .withConverter(ItemDocumentConverter)
        );

        const updateBoard = ({name, maximumVotes}): void => {
            query.update({name, maximumVotes});
            setEditing(false);
        };

        const deleteBoard = (): void => {
            query.delete();
        };

        return (
            <Col span={5}>
                <FormBase<BoardDocument>
                    onSubmit={updateBoard}
                    schema={boardDocumentValidationSchema}
                    hideSubmitButton={true}
                    defaultValues={{
                        name: board.name,
                        maximumVotes: board.maximumVotes,
                    }}
                >
                    <Card
                        actions={[
                            <Tooltip title="Go to board">
                                <div>
                                    <Link href={`/boards/${snapshot.id}`}>
                                        <SelectOutlined />
                                    </Link>
                                </div>
                            </Tooltip>,
                            <Tooltip key="edit" title={editing ? "Save changes" : "Edit board"}>
                                {!editing
                                    ? <EditOutlined key="edit" onClick={() => setEditing(true)}/>
                                    : <Button
                                        htmlType="submit"
                                        style={{border: "unset", margin: "unset", boxShadow: "unset"}}
                                    >
                                            <CheckOutlined key="edit"/>
                                        </Button>
                                }
                            </Tooltip>,
                            <Tooltip key="export" title="Export to JSON">
                                <ExportOutlined onClick={() => downloadJsonFile(board.name, {...board, items})}/>
                            </Tooltip>,
                            <Popconfirm
                                key="delete"
                                title="Are you sure you want to delete this board?"
                                onConfirm={deleteBoard}
                                okText="Yes"
                                cancelText="No"
                            >
                                <DeleteOutlined style={{color: "#df4040"}}/>
                            </Popconfirm>
                        ]}
                    >
                        <Card.Meta
                            title={
                                editing
                                    ? <InputControl name="name"/>
                                    : board.name
                            }
                            description={
                                <>
                                    <Divider/>
                                    <Descriptions column={1}>
                                        <Descriptions.Item label="Key">
                                            {snapshot.id}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Date">
                                            {board.date.format("LLL")}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Maximum amount of votes">
                                            {editing
                                                ? <FormControlBase
                                                    name="maximumVotes"
                                                    render={(controller) => <InputNumber
                                                        min={1} {...controller.field}/>}
                                                />
                                                : board.maximumVotes}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Amount of items">
                                            {itemsLoading && !items
                                                ? <LoadingOutlined spin/>
                                                : items.length}
                                        </Descriptions.Item>
                                    </Descriptions>
                                </>
                            }
                        />
                    </Card>
                </FormBase>
            </Col>
        );
    };

    return (
        <>
            <Row justify="center">
                <GradientHeader
                    text="My Boards"
                    gradient="119deg, rgba(131,58,180,1) 0%, rgba(253,29,29,1) 65%, rgba(252,176,69,1) 100%"
                    fontSize="48px"
                    style={{margin: "65px 0"}}
                />
            </Row>
            <Row justify="center">
                <Space>
                    <Tooltip title="Go to home">
                        <div>
                            <Link href="/">
                                <Button icon={<HomeOutlined/>} type="link"/>
                            </Link>
                        </div>
                    </Tooltip>
                    {boards?.docs?.length > 0 && (
                        <>
                            <Tooltip title="Export all boards to JSON">
                                <Button
                                    icon={!exportLoading ? <ExportOutlined/> : <LoadingOutlined spin/>}
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
                                    <Button icon={<DeleteOutlined/>} type="link"/>
                                </Popconfirm>
                            </Tooltip>
                        </>
                    )}
                </Space>
            </Row>
            <Divider/>
            <Row justify="center" gutter={[32, 32]} style={{margin: "unset"}}>
                {loading && (
                    <Col span={4}>
                        <Card loading={true}><Card.Meta/></Card>
                    </Col>
                )}
                {boards?.docs?.map((snapshot: QueryDocumentSnapshot<BoardDocument>) => (
                    <BoardCard key={snapshot.id} snapshot={snapshot}/>
                ))}
            </Row>
        </>
    );
};

export default withAuthentication(Index);