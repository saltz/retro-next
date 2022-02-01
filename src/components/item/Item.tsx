import React from "react";
import {
    Draggable,
    DraggableProvided,
    DraggableStateSnapshot,
} from "react-beautiful-dnd";
import { ItemDocument } from "../../models/ItemDocument";
import firebase from "../../utils/firebaseClient";
import { ItemCard } from "./ItemCard";

interface IProps {
    id: string;
    boardId: string;
    index: number;
    item: ItemDocument;
    itemQuery: firebase.firestore.CollectionReference<ItemDocument>;
}

export const Item: React.FC<IProps> = (props: IProps) => (
    <Draggable draggableId={props.id} index={props.index}>
        {(provider: DraggableProvided, snapshot: DraggableStateSnapshot) => (
            <div ref={provider.innerRef} {...provider.draggableProps}>
                <ItemCard
                    id={props.id}
                    boardId={props.boardId}
                    item={props.item}
                    itemQuery={props.itemQuery}
                    style={{
                        backgroundColor: !!snapshot.combineTargetFor
                            ? "#7058ff05"
                            : "",
                    }}
                    loading={snapshot.isDragging}
                    draggableProps={provider.dragHandleProps}
                />
            </div>
        )}
    </Draggable>
);
