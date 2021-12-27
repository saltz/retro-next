import { NextPage } from "next";
import { useRouter } from "next/router";
import { PageSpinner } from "../../components/shared/PageSpinner";
import { Button, Result } from "antd";
import firebase from "../../utils/firebaseClient";
import { useDocumentDataOnce } from "react-firebase-hooks/firestore";
import {
    BoardDocument,
    BoardDocumentConverter,
} from "../../models/BoardDocument";
import {
    IPageProps,
    withAuthentication,
} from "../../components/withAuthentication";
import { Board } from "../../components/board/Board";

const BoardPage: NextPage<IPageProps> = () => {
    const router = useRouter();
    const id: string = (router.query.id as string) ?? "undefined";

    const boardQuery = firebase
        .firestore()
        .collection("boards")
        .withConverter(BoardDocumentConverter)
        .doc(id as string);

    const [board, boardLoading, boardError] =
        useDocumentDataOnce<BoardDocument>(boardQuery);

    if (!boardLoading && !board) {
        return (
            <Result
                status="404"
                title="404"
                subTitle="Board not found"
                extra={
                    <Button type="primary" onClick={() => router.back()}>
                        Go back
                    </Button>
                }
            />
        );
    }

    return (
        <>
            {boardLoading && !boardError && <PageSpinner />}
            {board && !boardLoading && <Board id={id} board={board} />}
        </>
    );
};

export default withAuthentication(BoardPage);
