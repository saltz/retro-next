import {NextPage} from "next";
import {useRouter} from "next/router";
import {PageSpinner} from "../../components/shared/PageSpinner";
import {Avatar, Button, Result, Tooltip} from "antd";
import {AppLayout} from "../../components/layouts/AppLayout";
import {Column} from "../../components/Column";
import firebase from "../../utils/firebaseClient";
import {useCollectionData, useDocumentDataOnce} from "react-firebase-hooks/firestore";
import {BoardDocument, BoardDocumentConverter} from "../../models/BoardDocument";
import {withAuthentication} from "../../hooks/withAuthentication";
import {useEffect} from "react";
import {UserAvatar} from "../../components/shared/UserAvatar";
import {UserDocument, UserDocumentConverter} from "../../models/UserDocument";

interface IProps {
    user: firebase.User;
}

const BoardPage: NextPage<IProps> = (props: IProps) => {
    const router = useRouter();
    const id = router.query.id ?? "undefined";

    const currentUser = firebase.auth().currentUser;

    const boardQuery = firebase
        .firestore()
        .collection("boards")
        .withConverter(BoardDocumentConverter)
        .doc(id as string);

    const [board, boardLoading, boardError] = useDocumentDataOnce<BoardDocument>(boardQuery);
    const [users, usersLoading, usersError] = useCollectionData(boardQuery.collection("users"));

    const leavingBoard = () => {
        boardQuery
            .collection("users")
            .doc(currentUser.displayName)
            .withConverter(UserDocumentConverter)
            .delete();
    };

    useEffect(() => {
        boardQuery
            .collection("users")
            .withConverter(UserDocumentConverter)
            .doc(currentUser.displayName)
            .set(new UserDocument(currentUser.displayName, currentUser.email, currentUser.photoURL));

        router.events.on("routeChangeStart", leavingBoard);
        window.onbeforeunload = () => leavingBoard();

        return () => {
            router.events.off("routeChangeStart", leavingBoard);
        }
    }, []);

    if (!boardLoading && !board) {
        return <AppLayout>
            <Result
                status="404"
                title="404"
                subTitle="BoardDocument not found"
                extra={<Button type="primary" onClick={() => router.back()}>Go back</Button>}
            />
        </AppLayout>
    }

    return (
        <AppLayout>
            {boardLoading && !boardError && <PageSpinner/>}
            {board && !boardLoading && (
                <>
                    <Avatar.Group>
                        {users.map((user) => <UserAvatar size={60} user={user} border tooltip/>)}
                    </Avatar.Group>
                    <Column id={id as string}/>
                </>
            )}
        </AppLayout>
    );
};

export default withAuthentication(BoardPage);