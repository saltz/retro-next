import React, {useEffect} from "react";
import {UserAvatar} from "../shared/UserAvatar";
import {Avatar, Skeleton} from "antd";
import {useCollectionData} from "react-firebase-hooks/firestore";
import {UserDocument, UserDocumentConverter} from "../../models/UserDocument";
import {useRouter} from "next/router";
import firebase from "../../utils/firebaseClient";
import {BoardDocumentConverter} from "../../models/BoardDocument";

interface IProps {
    boardId: string;
}

export const CurrentUsers: React.FC<IProps> = (props: IProps): JSX.Element => {
    const router = useRouter();
    const query = firebase
        .firestore()
        .collection("boards")
        .withConverter(BoardDocumentConverter)
        .doc(props.boardId)
        .collection("users")
        .withConverter(UserDocumentConverter);

    const [users, loading] = useCollectionData<UserDocument>(query);
    const currentUser = firebase.auth().currentUser;

    const leavingBoard = () => {
        query
            .doc(currentUser.displayName)
            .delete();
    };

    useEffect(() => {
        query
            .doc(currentUser.displayName)
            .set(new UserDocument(currentUser.displayName, currentUser.email, currentUser.photoURL));

        router.events.on("routeChangeStart", leavingBoard);

        if (window) {
            window.onbeforeunload = () => leavingBoard();
        }

        return () => {
            router.events.off("routeChangeStart", leavingBoard);
        }
    }, []);

    return (
        <Avatar.Group>
            {loading || !users ? (
                <Skeleton.Avatar active size={50}/>
            ) : users.map((user) => <UserAvatar key={user.displayName} size={50} user={user} border tooltip/>)}
        </Avatar.Group>
    );
};