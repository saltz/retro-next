import React from "react";
import {DragDropContext, Droppable} from "react-beautiful-dnd";
import firebase from "../utils/firebaseClient";
import {useCollectionData, useDocumentData} from "react-firebase-hooks/firestore";
import {PageSpinner} from "./shared/PageSpinner";
import {ItemDocument, ItemDocumentConverter} from "../models/ItemDocument";
import {BoardDocumentConverter} from "../models/BoardDocument";
import {Button} from "antd";

interface IProps {
    id: string;
}


export const Column: React.FC<IProps> = (props: IProps) => {
    const query = firebase
        .firestore()
        .collection("boards")
        .withConverter(BoardDocumentConverter)
        .doc(props.id)
        .collection("items")
        .withConverter(ItemDocumentConverter);

    const [items, loading, error] = useCollectionData<ItemDocument>(query);

    if (loading && !items) {
        return <PageSpinner/>
    }

    return (
        <div>
            <h1>column header</h1>
            <DragDropContext onDragEnd={() => console.log}>
                <Droppable droppableId={props.id}>
                    {(provider, snapshot) => (
                        <div>
                            {items.map((item) => <h1>{item.content}</h1>)}
                        </div>
                    )}
                </Droppable>
                <Button onClick={() => query.add(new ItemDocument("cool"))}>
                    CLICK ME
                </Button>
            </DragDropContext>
        </div>
    );
}