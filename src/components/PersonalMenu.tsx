import React from "react";
import {Dropdown, Menu, Space} from "antd";
import {LogoutOutlined} from "@ant-design/icons";
import firebase from "../utils/firebaseClient";
import {UserAvatar} from "./shared/UserAvatar";
import {BoardDocumentConverter} from "../models/BoardDocument";

export const PersonalMenu: React.FC = (): JSX.Element => {
    const signOut = async () => {
        const boards = await firebase.firestore().collection("boards").withConverter(BoardDocumentConverter).get();

        for (const board of boards.docs) {
            await firebase
                .firestore()
                .collection("boards")
                .doc(board.id)
                .collection("users")
                .doc(firebase.auth().currentUser.uid)
                .delete();
        }

       await firebase.auth().signOut();
    };

    const dropdownMenu = (
        <Menu>
            <Menu.Item key="0" onClick={() => signOut()}>
                <Space>
                    <LogoutOutlined/>
                    <span>Sign out</span>
                </Space>
            </Menu.Item>
        </Menu>
    );

    return (
        <>
            <div className="personal-menu">
                <Dropdown
                    placement="bottomLeft"
                    overlay={dropdownMenu}
                    trigger={["click"]}
                    overlayClassName="personal-menu-dropdown"
                >
                    <div>
                        <UserAvatar size={40}/>
                    </div>
                </Dropdown>
            </div>
            <style jsx>
                {`
                  .personal-menu {
                    position: fixed;
                    z-index: 999;
                    top: 30px;
                    right: 30px;
                  }

                  .personal-menu:hover {
                    cursor: pointer;
                  }
                `}
            </style>
        </>
    )
};