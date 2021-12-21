import React from "react";

interface IProps {
    text: string;
    gradient: string;
    className?: string;
    fontSize?: string;
    fontWeight?: number;
}

export const GradientHeader: React.FC<IProps> = (props: IProps): JSX.Element => (
    <>
        <span className={props.className}>{props.text}</span>
        <style jsx>
            {`
              span {
                font-size: ${props.fontSize ?? ""};
                font-weight: ${props.fontWeight ?? ""};
                background: linear-gradient(${props.gradient});
                background-clip: text;
                color: transparent !important;
              }
            `}
        </style>
    </>
)