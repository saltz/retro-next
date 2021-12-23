import firebase from "firebase/compat";
import {FirestoreDataConverter} from "@firebase/firestore-types";

export class ItemDocument {
    content: string;
    index: number;

    constructor(content: string) {
        this.content = content;
    }
}

export const ItemDocumentConverter: FirestoreDataConverter<ItemDocument> = {
    toFirestore: (item: ItemDocument): firebase.firestore.DocumentData => ({
        content: item.content,
    }),
    fromFirestore: (snapshot: firebase.firestore.QueryDocumentSnapshot, options: firebase.firestore.SnapshotOptions) => {
        const data = snapshot.data(options);

        return new ItemDocument(data.content);
    }
}