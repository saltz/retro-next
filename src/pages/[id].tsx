import {NextPage} from "next";
import {useRouter} from "next/router";
import {useEffect} from "react";
import {IState, useStoreActions, useStoreState} from "../store";
import {Actions, State} from "easy-peasy";
import {PageSpinner} from "../components/shared/PageSpinner";
import {Button, Result} from "antd";
import {AppLayout} from "../components/layouts/AppLayout";
import {Column} from "../components/Column";
import firebase from "../utils/firebaseClient";
import {useCollectionDataOnce, useDocumentDataOnce} from "react-firebase-hooks/firestore";
import {Board} from "../models/Board";


const BoardPage: NextPage = () => {
    const router = useRouter();
    const {id = "temp"} = router.query;

    const [board, loading, error] = useDocumentDataOnce<Board>(firebase.firestore().collection("boards").doc(id as string));

    if (!loading && !board && error) {
        return <AppLayout>
            <Result
                status="404"
                title="404"
                subTitle="Board not found"
                extra={<Button type="primary" onClick={() => router.back()}>Go back</Button>}
            />
        </AppLayout>
    }

    return !loading && board && id !== "temp" ? <div>
        <Column id={id as string}/>
    </div>: <PageSpinner/>;

};

export default BoardPage;