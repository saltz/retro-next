import { Avatar, Tooltip } from "antd";
import { TooltipPlacement } from "antd/lib/tooltip";
import { createHash } from "crypto";
import React from "react";
import { UserDocument } from "../../models/UserDocument";
import firebase from "../../utils/firebaseClient";

interface IProps {
    size: number;
    user?: UserDocument;
    border?: boolean;
    tooltip?: boolean;
    tooltipPlacement?: TooltipPlacement;
}

export const UserAvatar: React.FC<IProps> = (props: IProps): JSX.Element => {
    const user = props.user ?? firebase.auth().currentUser;

    const getUserImageUrl = (): string => {
        if (user?.photoURL) {
            return user.photoURL;
        }

        return `https://www.gravatar.com/avatar/${createHash("md5")
            .update(user.email ?? "")
            .digest("hex")}?d=identicon`;
    };

    return (
        <Tooltip
            title={props.tooltip ? user.displayName : undefined}
            placement={props.tooltipPlacement ?? "bottom"}
        >
            <Avatar
                style={{
                    border: props.border ? "3px solid #00c600" : undefined,
                }}
                size={props.size}
                src={getUserImageUrl()}
            />
        </Tooltip>
    );
};
