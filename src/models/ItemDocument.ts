import { FirestoreDataConverter } from "@firebase/firestore-types";
import firebase from "firebase/compat";
import { UserDocument, UserDocumentConverter } from "./UserDocument";

export class ItemDocument {
    id?: string;
    parentId: string;
    column: string;
    index: number;
    user: UserDocument;
    content: string;
    votes: number;

    constructor(
        column: string,
        index: number,
        user: UserDocument,
        content: string,
        votes: number = 0,
        parentId: string = null
    ) {
        this.parentId = parentId;
        this.column = column;
        this.index = index;
        this.user = user;
        this.content = content;
        this.votes = votes;
    }
}

export const ItemDocumentConverter: FirestoreDataConverter<ItemDocument> = {
    toFirestore: (item: ItemDocument): firebase.firestore.DocumentData => ({
        parentId: item.parentId,
        column: item.column,
        index: item.index,
        user: UserDocumentConverter.toFirestore(item.user),
        content: item.content,
        votes: item.votes,
    }),
    fromFirestore: (
        snapshot: firebase.firestore.QueryDocumentSnapshot,
        options: firebase.firestore.SnapshotOptions
    ) => {
        const data = snapshot.data(options);
        return new ItemDocument(
            data.column,
            data.index,
            UserDocumentConverter.toUserDocument(data.user),
            data.content,
            data.votes,
            data.parentId
        );
    },
};
