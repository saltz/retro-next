import firebase from "firebase/compat";
import FirestoreDataConverter = firebase.firestore.FirestoreDataConverter;

export class BoardDocument {
    name: string;

    constructor(name: string) {
        this.name = name;
    }
}

export const BoardDocumentConverter: FirestoreDataConverter<BoardDocument> = {
    toFirestore: (board: BoardDocument): firebase.firestore.DocumentData => ({
        name: board.name,
    }),
    fromFirestore: (snapshot: firebase.firestore.QueryDocumentSnapshot, options: firebase.firestore.SnapshotOptions) => {
        const data = snapshot.data(options);

        return new BoardDocument(data.name);
    }
}