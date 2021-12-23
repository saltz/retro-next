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
            <div className="page-container">
                <div className="content-wrap">
                    {user && !loading && !error && <PersonalMenu/>}
                    {props.children}
                </div>
                <div className="footer">
                    <span>
                        A simple responsive retrospective app created by
                        <Link href="https://github.com/saltz"> Dane Naebers </Link>
                        view source on <Link href="https://github.com/saltz/retro-next"><GithubOutlined/></Link>
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
}