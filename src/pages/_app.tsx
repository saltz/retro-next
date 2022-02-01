import { AppProps } from "next/app";
import React from "react";
import "../styles/dark.css";
import "../styles/light.css";

const App = (props: AppProps) => {
    const { Component, pageProps } = props;

    return (
        <>
            <Component {...pageProps} />
            <style global jsx>
                {`
                    body,
                    div#__next,
                    div#__next {
                        height: 100%;
                    }
                `}
            </style>
        </>
    );
};

export default App;
