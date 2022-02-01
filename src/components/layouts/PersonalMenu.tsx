import {
    HomeOutlined,
    LogoutOutlined,
    ProjectOutlined,
} from "@ant-design/icons";
import { Dropdown, Menu, Space } from "antd";
import { useRouter } from "next/router";
import React from "react";
import firebase from "../../utils/firebaseClient";
import { UserAvatar } from "../shared/UserAvatar";

export const PersonalMenu: React.FC = (): JSX.Element => {
    const router = useRouter();

    const signOut = (): void => {
        const auth = firebase.auth();

        // if on board remove from active users
        if (router.query.id) {
            firebase
                .firestore()
                .collection("boards")
                .doc(router.query.id as string)
                .collection("users")
                .doc(auth.currentUser.uid)
                .delete();
        }

        auth.signOut();
    };

    const dropdownMenu = (
        <Menu>
            <Menu.Item key="home" onClick={() => router.push("/")}>
                <Space>
                    <HomeOutlined />
                    <span>Home</span>
                </Space>
            </Menu.Item>
            <Menu.Item key="boards" onClick={() => router.push("/boards")}>
                <Space>
                    <ProjectOutlined />
                    <span>My boards</span>
                </Space>
            </Menu.Item>
            <Menu.Item key="sign-out" onClick={() => signOut()}>
                <Space>
                    <LogoutOutlined />
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
                        <UserAvatar size={40} />
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
    );
};
