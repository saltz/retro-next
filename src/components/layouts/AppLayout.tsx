import React, {ReactNode} from "react";
import Link from "next/link";
import {GithubOutlined} from "@ant-design/icons";
import {PersonalMenu} from "../PersonalMenu";
import firebase from "../../utils/firebaseClient";
import {ThemeSwitch} from "../ThemeSwitch";

interface IProps {
    user: firebase.User;
    children: ReactNode;
}

export const AppLayout: React.FC<IProps> = (props: IProps): JSX.Element => (
    <>
        <div className="page-container">
            <div className="content-wrap">
                <ThemeSwitch/>
                {props.user && <PersonalMenu/>}
                {props.children}
            </div>
            <div className="footer">
                <span>
                    A simple responsive retrospective app created by
                    <Link href="https://github.com/saltz"> Dane Naebers </Link>
                    view source on <Link href="https://github.com/saltz/retro-next" passHref={true}><GithubOutlined/></Link>
                </span>
            </div>
        </div>
        <style jsx>
            {`
              .page-container {
                position: relative;
                min-height: 100vh;
              }

              .content-wrap {
                padding-bottom: 100px;
              }

              .footer {
                width: 100%;
                align-content: center;
              }

              .footer > span {
                width: 100%;
                position: absolute;
                bottom: 0;
                height: 50px;
                text-align: center;
              }
            `}
        </style>
    </>
);