import {LoadingOutlined} from "@ant-design/icons";
import {Spin} from "antd";
import React from "react";

interface IProps {
    size?: number;
}

export const PageSpinner: React.FC<IProps> = (props: IProps): JSX.Element => (
    <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
        <Spin
            indicator={<LoadingOutlined style={{ fontSize: props.size ?? 50 }} spin />}
            tip="Loading..."
        />
    </div>
);