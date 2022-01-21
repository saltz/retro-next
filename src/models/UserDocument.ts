import { FirestoreDataConverter } from "@firebase/firestore-types";
import firebase from "firebase/compat";

export class UserDocument {
    uid: string;
    displayName: string;
    email: string;
    photoURL: string;

    constructor(
        name: string,
        email: string,
        photoURL: string,
        uid: string = null
    ) {
        this.displayName = name;
        this.email = email;
        this.photoURL = photoURL;
        this.uid = uid;
    }
}

type UserDocumentConverter = FirestoreDataConverter<UserDocument> & {
    toUserDocument: (data: any, id?: string) => UserDocument;
};

export const UserDocumentConverter: UserDocumentConverter = {
    toFirestore: (user: UserDocument): firebase.firestore.DocumentData => ({
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
    }),
    fromFirestore: (
        snapshot: firebase.firestore.QueryDocumentSnapshot,
        options: firebase.firestore.SnapshotOptions
    ) => {
        const data = snapshot.data(options);
        return UserDocumentConverter.toUserDocument(data, snapshot.id);
    },
    toUserDocument: (data, id) => {
        if (!data.uid) {
            data.uid = id;
        }

        return new UserDocument(
            data.displayName,
            data.email,
            data.photoURL,
            data.uid
        );
    },
};
