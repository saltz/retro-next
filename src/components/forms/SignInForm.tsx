import "firebaseui/dist/firebaseui.css";

import * as firebaseui from "firebaseui";
import firebase from "../../utils/firebaseClient";
import {Col, Row} from "antd";
import {GradientHeader} from "../shared/GradientHeader";
import React from "react";
import FirebaseAuth from "../FirebaseAuth";

const config: firebaseui.auth.Config = {
    signInFlow: "popup",
    signInOptions: [
        "microsoft.com",
        firebase.auth.GithubAuthProvider.PROVIDER_ID,
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
    ],
};

export const SignInForm: React.FC = (): JSX.Element => (
    <>
        <Row justify="center">
            <GradientHeader
                className="app-title"
                text="Retro Next"
                gradient={"90deg, rgb(112, 88, 255) 35%, rgb(1, 183, 240) 100%"}
                fontSize="60px"
                fontWeight={600}
            />
        </Row>
        <Row justify="center">
            <Col>
                <FirebaseAuth uiConfig={config} firebaseAuth={firebase.auth()}/>
            </Col>
        </Row>

        <style jsx>
            {`
              :global(.app-title) {
                margin: 80px 0 20vh !important;
              }

              .sign-in-form {
                display: flex;
                justify-content: center;
                align-items: center;
              }
            `}
        </style>
    </>

);