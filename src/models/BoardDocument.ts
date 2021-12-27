import firebase from "firebase/compat";
import FirestoreDataConverter = firebase.firestore.FirestoreDataConverter;
import { Moment, unix } from "moment";
import { number, object, string } from "yup";

export class BoardDocument {
    name: string;
    owner: string;
    maximumVotes: number;
    date: Moment;

    constructor(
        name: string,
        owner: string,
        maximumVotes: number,
        date: Moment
    ) {
        this.name = name;
        this.owner = owner;
        this.maximumVotes = maximumVotes;
        this.date = date;
    }
}

export const boardDocumentValidationSchema = object({
    name: string().required(),
    maximumVotes: number(),
});

export const BoardDocumentConverter: FirestoreDataConverter<BoardDocument> = {
    toFirestore: (board: BoardDocument): firebase.firestore.DocumentData => ({
        name: board.name,
        owner: board.owner,
        maximumVotes: board.maximumVotes,
        date: board.date.unix(),
    }),
    fromFirestore: (
        snapshot: firebase.firestore.QueryDocumentSnapshot,
        options: firebase.firestore.SnapshotOptions
    ) => {
        const data = snapshot.data(options);

        return new BoardDocument(
            data.name,
            data.owner,
            data.maximumVotes,
            unix(data.date)
        );
    },
};
