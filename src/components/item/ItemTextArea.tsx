import { Input } from "antd";
import React, { useState } from "react";

interface IProps {
    onPressEnter: (value: string) => void;
    defaultValue?: string;
    margin?: string;
}

export const ItemTextArea: React.FC<IProps> = (props: IProps): JSX.Element => {
    const [value, setValue] = useState<string>();

    return (
        <Input.TextArea
            rows={4}
            placeholder="Press Enter to add item"
            value={value}
            defaultValue={props.defaultValue}
            style={{ margin: props.margin }}
            onChange={(event) => setValue(event.target.value)}
            onKeyPress={(event) => {
                if (event.key === "Enter") {
                    props.onPressEnter(value);
                    setValue(undefined);
                }
            }}
        />
    );
};
