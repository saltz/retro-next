import "../styles/global.css";

import {StoreProvider} from "easy-peasy";
import {store} from "../store";
import {AppProps} from "next/app";

const App = (props: AppProps) => {
    const {Component, pageProps} = props;

    return (
        <>
            <StoreProvider store={store}>
                <Component {...pageProps}/>
            </StoreProvider>
            <style global jsx>
                {`
                    body, div#__next, div#__next > div {
                      height: 100%;
                    }
                `}
            </style>
        </>

    )
}

export default App;