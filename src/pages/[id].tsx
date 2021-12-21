import {NextPage} from "next";
import {useRouter} from "next/router";
import {useEffect} from "react";
import {IState, useStoreActions, useStoreState} from "../store";
import {Actions, State} from "easy-peasy";
import {PageSpinner} from "../components/PageSpinner";
import {Button, Result} from "antd";
import {AppLayout} from "../layouts/AppLayout";

const BoardPage: NextPage = () => {
    const router = useRouter();
    const {id} = router.query;

    const getBoard = useStoreActions((actions: Actions<IState>) => actions.boardState.getById);
    const loading = useStoreState((state: State<IState>) => state.boardState.getByIdLoading);
    const done = useStoreState((state: State<IState>) => state.boardState.getByIdDone);
    const board = useStoreState((state: State<IState>) => state.boardState.single);

    useEffect(() => {
        getBoard(id as string);
    }, [id]);

    if (!loading && !board && done) {
        return <AppLayout>
            <Result
                status="404"
                title="404"
                subTitle="Board not found"
                extra={<Button type="primary" onClick={() => router.back()}>Go back</Button>}
            />
        </AppLayout>
    }

    return !loading && board ? <h1>{board.name}</h1> : <PageSpinner/>;

};

export default BoardPage;