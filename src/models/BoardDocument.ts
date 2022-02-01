import firebase from "firebase/compat";
import { Moment, unix } from "moment";
import { array, number, object, string } from "yup";
import FirestoreDataConverter = firebase.firestore.FirestoreDataConverter;

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
    columns: array()
        .of(object({ title: string().required() }))
        .min(1, "The board needs at least one column"),
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
