import React from "react";

interface IProps {
    text: string;
    gradient: string;
    className?: string;
    fontSize?: string;
    fontWeight?: number;
}

export const GradientHeader: React.FC<IProps> = (props: IProps): JSX.Element => (
    <span
        style={{
            fontSize: props.fontSize,
            fontWeight: props.fontWeight,
            background: `linear-gradient(${props.gradient}`,
            color: "transparent",
            backgroundClip: "text"
        }}
        className={props.className}
    >
        {props.text}
    </span>
);