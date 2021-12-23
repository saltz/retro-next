import React from "react";

interface IProps {
    item: ItemModel;
}

export const Item: React.FC<IProps> = (props: IProps) => {
    return (
        <h1>{props.item.title}</h1>
    )
}