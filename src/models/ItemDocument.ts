import firebase from "firebase/compat";
import {FirestoreDataConverter} from "@firebase/firestore-types";
import {UserDocument, UserDocumentConverter} from "./UserDocument";

export class ItemDocument {
    header: string;
    index: number;
    user: UserDocument;
    content: string;
    votes: number;
    parentId: string;
    children: ItemDocument[];
    id: string;

    constructor(header: string, index: number, user: UserDocument, content: string, votes: number = 0, parentId: string = "", children: ItemDocument[] = [], id: string = "") {
        this.header = header;
        this.index = index;
        this.user = user;
        this.content = content;
        this.votes = votes;
        this.parentId = parentId;
        this.children = children;
        this.id = id;
    }
}

export const ItemDocumentConverter: FirestoreDataConverter<ItemDocument> = {
    toFirestore: (item: ItemDocument): firebase.firestore.DocumentData => ({
        header: item.header,
        index: item.index,
        user: UserDocumentConverter.toFirestore(item.user),
        content: item.content,
        votes: item.votes,
        parentId: item.parentId,
        children: item.children?.map((childItem) => ItemDocumentConverter.toFirestore(childItem)),
        id: item.id,
    }),
    fromFirestore: (snapshot: firebase.firestore.QueryDocumentSnapshot, options: firebase.firestore.SnapshotOptions) => {
        const data = snapshot.data(options);
        return new ItemDocument(data.header, data.index, UserDocumentConverter.toUserDocument(data.user) , data.content, data.votes, data.parentId, data.children, data.id);
    },
}