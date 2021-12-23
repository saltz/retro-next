import React from "react";
import {createHash} from "crypto";
import {Avatar, Tooltip} from "antd";
import firebase from "../../utils/firebaseClient";
import {UserDocument} from "../../models/UserDocument";

interface IProps {
    size: number;
    user?: UserDocument;
    border?: boolean;
    tooltip?: boolean;
}

export const UserAvatar: React.FC<IProps> = (props: IProps): JSX.Element => {
    const user = props.user ?? firebase.auth().currentUser;

    const getUserImageUrl = (): string => {
        if (user.photoURL) {
            return user.photoURL;
        }

        if (user.email) {
            return `https://www.gravatar.com/avatar/${createHash("md5").update(user.email).digest("hex")}?d=identicon`;
        }

        return;
    };

    return (
        <Tooltip title={props.tooltip ? user.displayName : undefined}>
            <Avatar
                style={{border: props.border ? "3px solid #00c600" : undefined}}
                size={props.size}
                src={getUserImageUrl()}
            />
        </Tooltip>
    );
}