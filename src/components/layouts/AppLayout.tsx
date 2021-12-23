import React, {ReactNode} from "react";
import Link from "next/link";
import {GithubOutlined} from "@ant-design/icons";
import {PersonalMenu} from "../PersonalMenu";
import {useAuthState} from "react-firebase-hooks/auth";
import firebase from "../../utils/firebaseClient";

interface IProps {
    children: ReactNode;
}

export const AppLayout: React.FC<IProps> = (props: IProps): JSX.Element => {
    const [user, loading, error] = useAuthState(firebase.auth());

    return (
        <>
            <div className="content">
                {user && !loading && !error && <PersonalMenu/>}
                {props.children}
                <div className="footer">
                <span> A simple responsive retrospective app created by <Link href="https://github.com/saltz">Dane Naebers</Link> view source on <Link
                    href="https://github.com/saltz/retro-next"><GithubOutlined/></Link></span>
                </div>
            </div>
            <style jsx>
                {`
              .footer {
                display: flex;
                justify-content: center;
                align-items: center;
              }

              .footer > span {
                position: fixed;
                bottom: 0;
                margin: 12px;
              }
            `}
            </style>
        </>
    );
}