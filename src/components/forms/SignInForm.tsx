import * as firebaseui from "firebaseui";
import firebase from "../../utils/firebaseClient";
import {Card, Col, Row} from "antd";
import {GradientHeader} from "../shared/GradientHeader";
import React from "react";
import "firebaseui/dist/firebaseui.css";
import FirebaseAuth from "../FirebaseAuth";

const config: firebaseui.auth.Config = {
    signInFlow: "popup",
    signInOptions: [
        firebase.auth.GithubAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
    ],
}

export const SignInForm = () => {
    return (
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
                    <Card>
                        <FirebaseAuth uiConfig={config} firebaseAuth={firebase.auth()}/>
                    </Card>
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

    )
};