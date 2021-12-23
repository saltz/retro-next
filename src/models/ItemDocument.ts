import firebase from "firebase/compat";
import {FirestoreDataConverter} from "@firebase/firestore-types";
import {UserDocument, UserDocumentConverter} from "./UserDocument";

export class ItemDocument {
    header: string;
    user: UserDocument;
    content: string;
    votes: number;
    index: number;

    constructor(header: string, user: UserDocument, content: string, votes: number = 0) {
        this.header = header;
        this.user = user;
        this.content = content;
        this.votes = votes;
    }
}

export const ItemDocumentConverter: FirestoreDataConverter<ItemDocument> = {
    toFirestore: (item: ItemDocument): firebase.firestore.DocumentData => ({
        header: item.header,
        user: UserDocumentConverter.toFirestore(item.user),
        content: item.content,
        votes: item.votes,
    }),
    fromFirestore: (snapshot: firebase.firestore.QueryDocumentSnapshot, options: firebase.firestore.SnapshotOptions) => {
        const data = snapshot.data(options);
        return new ItemDocument(data.header, UserDocumentConverter.toUserDocument(data.user) , data.content, data.votes);
    }
}