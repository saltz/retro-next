import { FirestoreDataConverter } from "@firebase/firestore-types";
import firebase from "firebase/compat";

export class ColumnDocument {
    id: string;
    title: string;
    index: number;

    constructor(title: string, index: number, id: string = null) {
        this.title = title;
        this.index = index;
        this.id = id;
    }
}

export const ColumnDocumentConverter: FirestoreDataConverter<ColumnDocument> = {
    toFirestore: (item: ColumnDocument): firebase.firestore.DocumentData => ({
        title: item.title,
        index: item.index,
    }),
    fromFirestore: (
        snapshot: firebase.firestore.QueryDocumentSnapshot,
        options: firebase.firestore.SnapshotOptions
    ) => {
        const data = snapshot.data(options);

        return new ColumnDocument(data.title, data.index, snapshot.id);
    },
};
