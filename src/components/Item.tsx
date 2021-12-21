import React from "react";

interface IProps {
    item: object;
}

export const Item: React.FC<IProps> = (props: IProps) => {
    return (
        <h1>item</h1>
    )
}