import {FirestoreDataConverter} from "@firebase/firestore-types";
import firebase from "firebase/compat";

export class UserDocument {
    displayName: string;
    email: string;
    photoURL: string;

    constructor(name: string, email: string, photoURL: string) {
        this.displayName = name;
        this.email = email;
        this.photoURL = photoURL
    }
}

type UserDocumentConverter = FirestoreDataConverter<UserDocument> & {
    toUserDocument: (data: any) => UserDocument;
};

export const UserDocumentConverter: UserDocumentConverter = {
    toFirestore: (user: UserDocument): firebase.firestore.DocumentData => ({
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
    }),
    fromFirestore: (snapshot: firebase.firestore.QueryDocumentSnapshot, options: firebase.firestore.SnapshotOptions) => {
        const data = snapshot.data(options);
        return UserDocumentConverter.toUserDocument(data)
    },
    toUserDocument: (data) => {
        return new UserDocument(data.displayName, data.email, data.photoURL);
    },
}