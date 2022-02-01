import firebase from "firebase/compat";
import moment from "moment";
import { BoardDocument } from "../models/BoardDocument";
import { ColumnDocument } from "../models/ColumnDocument";
import { ItemDocument } from "../models/ItemDocument";
import QueryDocumentSnapshot = firebase.firestore.QueryDocumentSnapshot;
import QuerySnapshot = firebase.firestore.QuerySnapshot;

export const downloadJsonFile = (name: string, data: object): void => {
    const blob = new Blob([JSON.stringify(data)], { type: "text/json" });
    downloadFile(name, "json", blob);
};

export const downloadFile = (
    name: string,
    extension: string,
    blob: Blob
): void => {
    const a = document.createElement("a");
    a.download = `${name} ${moment().format("DD-MM-YYYY")}.${extension}`;
    a.href = window.URL.createObjectURL(blob);
    const clickEvt = new MouseEvent("click", {
        view: window,
        bubbles: true,
        cancelable: true,
    });
    a.dispatchEvent(clickEvt);
    a.remove();
};

export const exportBoardToJson = (
    board: QueryDocumentSnapshot<BoardDocument>,
    itemSnapshot: QuerySnapshot<ItemDocument>,
    columns: QuerySnapshot<ColumnDocument>
): object => ({
    ...board.data(),
    owner: undefined,
    columns: columns.docs.map((column) => column.data().title),
    items: exportItemsToJson(itemSnapshot, columns),
});

export const exportItemsToJson = (
    snapshot: QuerySnapshot<ItemDocument>,
    columns: QuerySnapshot<ColumnDocument>,
    parentId: string = null
): object[] => {
    return snapshot.docs
        .filter((item) => item.data().parentId === parentId)
        .map((snap) => ({
            ...snap.data(),
            parentId: undefined,
            column: columns.docs
                .find((column) => column.id === snap.data().column)
                .data().title,
            user: snap.data().user.displayName,
            children: exportItemsToJson(snapshot, columns, snap.id),
        }));
};
