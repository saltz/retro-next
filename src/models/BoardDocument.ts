import firebase from "firebase/compat";
import FirestoreDataConverter = firebase.firestore.FirestoreDataConverter;

export class BoardDocument {
    name: string;
    maximumVotes: number;

    constructor(name: string, maximumVotes: number) {
        this.name = name;
        this.maximumVotes = maximumVotes;
    }
}

export const BoardDocumentConverter: FirestoreDataConverter<BoardDocument> = {
    toFirestore: (board: BoardDocument): firebase.firestore.DocumentData => ({
        name: board.name,
        maximumVotes: board.maximumVotes,
    }),
    fromFirestore: (snapshot: firebase.firestore.QueryDocumentSnapshot, options: firebase.firestore.SnapshotOptions) => {
        const data = snapshot.data(options);

        return new BoardDocument(data.name, data.maximumVotes);
    }
}