import {
    BoardDocument,
    boardDocumentValidationSchema,
} from "../../models/BoardDocument";
import firebase from "../../utils/firebaseClient";
import React, { useMemo, useState } from "react";
import { randomGradient } from "../../utils/colorGenerator";
import { useCollection } from "react-firebase-hooks/firestore";
import { ItemDocumentConverter } from "../../models/ItemDocument";
import {
    Button,
    Card,
    Col,
    Descriptions,
    Divider,
    InputNumber,
    Popconfirm,
    Tooltip,
} from "antd";
import { FormBase } from "../forms/FormBase";
import Link from "next/link";
import {
    CheckOutlined,
    DeleteOutlined,
    EditOutlined,
    ExportOutlined,
    LoadingOutlined,
    SelectOutlined,
} from "@ant-design/icons";
import {
    downloadJsonFile,
    exportBoardToJson,
} from "../../utils/exportingUtils";
import { InputControl } from "../forms/controls/InputControl";
import { GradientHeader } from "../shared/GradientHeader";
import { FormControlBase } from "../forms/controls/FormControlBase";
import QueryDocumentSnapshot = firebase.firestore.QueryDocumentSnapshot;

interface IProps {
    snapshot: QueryDocumentSnapshot<BoardDocument>;
}

export const BoardCard: React.FC<IProps> = (props: IProps): JSX.Element => {
    const board = props.snapshot.data();
    const query = firebase
        .firestore()
        .collection("boards")
        .doc(props.snapshot.id);
    const gradient = useMemo(() => randomGradient(3), []);

    const [editing, setEditing] = useState<boolean>(false);
    const [items, itemsLoading] = useCollection(
        query.collection("items").withConverter(ItemDocumentConverter)
    );

    const updateBoard = ({ name, maximumVotes }): void => {
        query.update({ name, maximumVotes });
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
                        <Tooltip key="home" title="Go to board">
                            <div>
                                <Link
                                    href={`/boards/${props.snapshot.id}`}
                                    passHref={true}
                                >
                                    <SelectOutlined />
                                </Link>
                            </div>
                        </Tooltip>,
                        <Tooltip
                            key="edit"
                            title={editing ? "Save changes" : "Edit board"}
                        >
                            {!editing ? (
                                <EditOutlined
                                    key="edit"
                                    onClick={() => setEditing(true)}
                                />
                            ) : (
                                <Button
                                    htmlType="submit"
                                    style={{
                                        border: "unset",
                                        margin: "unset",
                                        boxShadow: "unset",
                                    }}
                                >
                                    <CheckOutlined key="edit" />
                                </Button>
                            )}
                        </Tooltip>,
                        <Tooltip key="export" title="Export to JSON">
                            <ExportOutlined
                                onClick={() =>
                                    downloadJsonFile(
                                        board.name,
                                        exportBoardToJson(props.snapshot, items)
                                    )
                                }
                            />
                        </Tooltip>,
                        <Popconfirm
                            key="delete"
                            title="Are you sure you want to delete this board?"
                            onConfirm={deleteBoard}
                            okText="Yes"
                            cancelText="No"
                        >
                            <DeleteOutlined style={{ color: "#df4040" }} />
                        </Popconfirm>,
                    ]}
                >
                    <Card.Meta
                        title={
                            editing ? (
                                <InputControl name="name" />
                            ) : (
                                <GradientHeader
                                    text={board.name}
                                    fontSize="20px"
                                    gradient={gradient}
                                />
                            )
                        }
                        description={
                            <>
                                <Divider />
                                <Descriptions column={1}>
                                    <Descriptions.Item label="Key">
                                        {props.snapshot.id}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Date">
                                        {board.date.format("LLL")}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Maximum amount of votes">
                                        {editing ? (
                                            <FormControlBase
                                                name="maximumVotes"
                                                render={(controller) => (
                                                    <InputNumber
                                                        min={1}
                                                        {...controller.field}
                                                    />
                                                )}
                                            />
                                        ) : (
                                            board.maximumVotes
                                        )}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Amount of items">
                                        {itemsLoading && !items ? (
                                            <LoadingOutlined spin />
                                        ) : (
                                            items.length
                                        )}
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
