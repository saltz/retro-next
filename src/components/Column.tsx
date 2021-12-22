import React from "react";
import {DragDropContext, Droppable} from "react-beautiful-dnd";
import {Item as ItemModel} from "../models/item";
import {Button} from "antd";
import firebase from "../utils/firebaseClient";
import {useCollectionData, useDocumentData} from "react-firebase-hooks/firestore";
import {PageSpinner} from "./shared/PageSpinner";

interface IProps {
    id: string;
}


export const Column: React.FC<IProps> = (props: IProps) => {
    const query = firebase.firestore().collection("boards").doc(props.id).collection("items");

    const [items, itemsLoading, itemsError] = useCollectionData<ItemModel>(query);

    if (itemsLoading || !items) {
        return <PageSpinner/>
    }

    const addItem = () => {
        query.add({
            title: "new"
        });
    }

    return (
        <div>
            <h1>column header</h1>
            <DragDropContext onDragEnd={() => console.log}>
                <Droppable droppableId={props.id}>
                    {(provider, snapshot) => (
                        <div>
                            {items.map((item) => <h1>{item.title}</h1>)}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
            <Button onClick={() => addItem()}> click </Button>
        </div>
    );
}