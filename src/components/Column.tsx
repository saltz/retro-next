import React, {useEffect} from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import {IState, useStoreActions, useStoreState} from "../store";
import {Item} from "./Item";
import {Actions} from "easy-peasy";

const Column: React.FC = () => {
    return (
        <Droppable droppableId={"1"}>
            {() => (
                <div>
                    {items.map((item) => <Item key={item} item={item}/>)}
                </div>
            )}
        </Droppable>
    );
}