import { ItemDocument } from "../models/ItemDocument";
import moment from "moment";
import { BoardDocument } from "../models/BoardDocument";
import firebase from "firebase/compat";
import QueryDocumentSnapshot = firebase.firestore.QueryDocumentSnapshot;
import QuerySnapshot = firebase.firestore.QuerySnapshot;

export const downloadJsonFile = (name: string, data: object): void => {
    const blob = new Blob([JSON.stringify(data)], { type: "text/json" });
    const a = document.createElement("a");
    a.download = `${name} export ${moment().format("DD-MM-YYYY")}.json`;
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
    itemSnapshot: QuerySnapshot<ItemDocument>
): object => ({
    ...board.data(),
    owner: undefined,
    items: exportItemsToJson(itemSnapshot),
});

export const exportItemsToJson = (
    snapshot: QuerySnapshot<ItemDocument>,
    parentId: string = null
): object[] => {
    return snapshot.docs
        .filter((item) => item.data().parentId === parentId)
        .map((snap) => ({
            ...snap.data(),
            parentId: undefined,
            children: exportItemsToJson(snapshot, snap.id),
        }));
};
