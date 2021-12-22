import React from "react";
import { Item as ItemModel} from "../models/item";

interface IProps {
    item: ItemModel;
}

export const Item: React.FC<IProps> = (props: IProps) => {
    return (
        <h1>{props.item.title}</h1>
    )
}