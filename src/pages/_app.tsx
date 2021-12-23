import "../styles/global.css";

import {AppProps} from "next/app";

const App = (props: AppProps) => {
    const {Component, pageProps} = props;

    return (
        <>
            <Component {...pageProps}/>
            <style global jsx>
                {`
                    body, div#__next, div#__next {
                      height: 100%;
                    }
                `}
            </style>
        </>

    )
}

export default App;