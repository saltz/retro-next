import firebase from "firebase/compat";
import FirestoreDataConverter = firebase.firestore.FirestoreDataConverter;

export type VoteState = "upvote" | "downvote";

export class VoteDocument {
    userId: string;
    itemId: string;
    state: VoteState;

    constructor(userId: string, itemId: string, state: VoteState) {
        this.userId = userId;
        this.itemId = itemId;
        this.state = state;
    }
}

export const VoteDocumentConverter: FirestoreDataConverter<VoteDocument> = {
    toFirestore: (vote: VoteDocument): firebase.firestore.DocumentData => ({
        userId: vote.userId,
        itemId: vote.itemId,
        state: vote.state,
    }),
    fromFirestore: (
        snapshot: firebase.firestore.QueryDocumentSnapshot,
        options: firebase.firestore.SnapshotOptions
    ) => {
        const data = snapshot.data(options);
        return new VoteDocument(data.userId, data.itemId, data.state);
    },
};
