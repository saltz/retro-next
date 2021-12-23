import {NextPage} from "next";
import {useRouter} from "next/router";
import {PageSpinner} from "../../components/shared/PageSpinner";
import {Avatar, Button, Result, Tooltip} from "antd";
import {AppLayout} from "../../components/layouts/AppLayout";
import {Column} from "../../components/Column";
import firebase from "../../utils/firebaseClient";
import {useCollectionData, useDocumentDataOnce} from "react-firebase-hooks/firestore";
import {BoardDocument, BoardDocumentConverter} from "../../models/BoardDocument";
import {withAuthentication} from "../../components/withAuthentication";
import {useEffect} from "react";
import {UserAvatar} from "../../components/shared/UserAvatar";
import {UserDocument, UserDocumentConverter} from "../../models/UserDocument";
import {Board} from "../../components/Board";

interface IProps {
    user: firebase.User;
}

const BoardPage: NextPage<IProps> = (props: IProps) => {
    const router = useRouter();
    const id: string = router.query.id as string ?? "undefined";

    const boardQuery = firebase
        .firestore()
        .collection("boards")
        .withConverter(BoardDocumentConverter)
        .doc(id as string);

    const [board, boardLoading, boardError] = useDocumentDataOnce<BoardDocument>(boardQuery);


    if (!boardLoading && !board) {
        return (
            <Result
                status="404"
                title="404"
                subTitle="BoardDocument not found"
                extra={<Button type="primary" onClick={() => router.back()}>Go back</Button>}
            />
        );
    }

    return (
        <>
            {boardLoading && !boardError && <PageSpinner/>}
            {board && !boardLoading && <Board id={id} board={board}/>}
        </>
    );
};

export default withAuthentication(BoardPage);