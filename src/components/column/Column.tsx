import { DeleteOutlined } from "@ant-design/icons";
import { Avatar, Card, Col, Popconfirm, Row, Skeleton } from "antd";
import React, { useContext } from "react";
import {
    Draggable,
    DraggableProvided,
    Droppable,
    DroppableProvided,
} from "react-beautiful-dnd";
import { useCollection } from "react-firebase-hooks/firestore";
import { BoardDocumentConverter } from "../../models/BoardDocument";
import {
    ColumnDocument,
    ColumnDocumentConverter,
} from "../../models/ColumnDocument";
import { ItemDocument, ItemDocumentConverter } from "../../models/ItemDocument";
import firebase from "../../utils/firebaseClient";
import { BoardContext } from "../board/BoardContext";
import { Item } from "../item/Item";
import { ItemTextArea } from "../item/ItemTextArea";

interface IProps {
    column: ColumnDocument;
    firstColumn?: ColumnDocument;
}

export const Column: React.FC<IProps> = (props: IProps) => {
    const currentUser = firebase.auth().currentUser;
    const boardContext = useContext(BoardContext);

    const columnQuery = firebase
        .firestore()
        .collection("boards")
        .withConverter(BoardDocumentConverter)
        .doc(boardContext.boardId)
        .collection("columns")
        .withConverter(ColumnDocumentConverter);

    const itemQuery = firebase
        .firestore()
        .collection("boards")
        .withConverter(BoardDocumentConverter)
        .doc(boardContext.boardId)
        .collection("items")
        .withConverter(ItemDocumentConverter);

    const [items, loading] = useCollection<ItemDocument>(
        itemQuery
            .where("column", "==", props.column.id)
            .where("parentId", "==", null)
            .orderBy("index", "asc")
    );

    const deleteColumn = async () => {
        if (props.firstColumn && props.firstColumn.id !== props.column.id) {
            for (const item of items.docs) {
                await itemQuery
                    .doc(item.id)
                    .update({ column: props.firstColumn.id });
            }
        }

        await columnQuery.doc(props.column.id).delete();
    };

    return (
        <Draggable draggableId={props.column.id} index={props.column.index}>
            {(draggableProvided: DraggableProvided) => (
                <div
                    ref={draggableProvided.innerRef}
                    {...draggableProvided.draggableProps}
                >
                    <Droppable
                        droppableId={props.column.id}
                        type="ITEM"
                        direction="vertical"
                        isCombineEnabled={true}
                    >
                        {(droppableProvided: DroppableProvided, snapshot) => (
                            <div
                                ref={droppableProvided.innerRef}
                                {...droppableProvided.droppableProps}
                            >
                                <Card
                                    style={{
                                        background: snapshot.isDraggingOver
                                            ? "#7058ff05"
                                            : "",
                                    }}
                                    {...draggableProvided.dragHandleProps}
                                >
                                    <Row justify="space-between">
                                        <p
                                            style={{
                                                fontWeight: "bold",
                                                fontSize: "16px",
                                            }}
                                        >
                                            {props.column.title}
                                        </p>
                                        {boardContext.board.owner ===
                                            currentUser.uid &&
                                            props.column.id !==
                                                props.firstColumn?.id && (
                                                <Popconfirm
                                                    title={
                                                        <>
                                                            <span>
                                                                Are you sure you
                                                                want to delete
                                                                this column?
                                                            </span>
                                                            <br />
                                                            <span>
                                                                (all items will
                                                                be moved to the
                                                                first column)
                                                            </span>
                                                        </>
                                                    }
                                                    okText="Yes"
                                                    cancelText="No"
                                                    onConfirm={() =>
                                                        deleteColumn()
                                                    }
                                                >
                                                    <DeleteOutlined
                                                        style={{
                                                            color: "#df4040",
                                                        }}
                                                    />
                                                </Popconfirm>
                                            )}
                                    </Row>
                                    <Row>
                                        <Col span={24}>
                                            {loading && (
                                                <Card>
                                                    <Skeleton
                                                        loading={true}
                                                        avatar
                                                        active
                                                    >
                                                        <Card.Meta
                                                            avatar={
                                                                <Avatar src="https://joeschmoe.io/api/v1/random" />
                                                            }
                                                            title="Card title"
                                                            description="This is the description"
                                                        />
                                                    </Skeleton>
                                                </Card>
                                            )}
                                            {items?.docs?.map((item, index) => (
                                                <Item
                                                    key={item.id}
                                                    id={item.id}
                                                    index={index}
                                                    item={item.data()}
                                                    itemQuery={itemQuery}
                                                />
                                            ))}
                                        </Col>
                                    </Row>
                                    {droppableProvided.placeholder}
                                    <Row justify="end">
                                        <Col
                                            span={24}
                                            style={{ padding: "10px" }}
                                        >
                                            <ItemTextArea
                                                onPressEnter={(value) => {
                                                    if (value) {
                                                        itemQuery.add(
                                                            new ItemDocument(
                                                                props.column.id,
                                                                items?.docs
                                                                    ?.length ??
                                                                    0,
                                                                currentUser,
                                                                value
                                                            )
                                                        );
                                                    }
                                                }}
                                            />
                                        </Col>
                                    </Row>
                                </Card>
                            </div>
                        )}
                    </Droppable>
                </div>
            )}
        </Draggable>
    );
};
