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

export const UserDocumentConverter: FirestoreDataConverter<UserDocument> = {
    toFirestore: (user: UserDocument): firebase.firestore.DocumentData => ({
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
    }),
    fromFirestore: (snapshot: firebase.firestore.QueryDocumentSnapshot, options: firebase.firestore.SnapshotOptions) => {
        const data = snapshot.data(options);

        return new UserDocument(data.displayName, data.email, data.photoURL);
    }
}