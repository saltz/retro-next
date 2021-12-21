import {IEntity} from "../models/IEntity";

export const appendOrUpdateArray = <T extends IEntity>(array: T[], payload: T): T[] => {
    let updated: boolean = false;

    let newArray = array.map(object => {
        if (object.id === payload.id) {
            updated = true;
            return payload;
        }

        return object;
    });

    if (!updated) {
        newArray = [
            payload,
            ...newArray,
        ];
    }

    return newArray;
};

export const removeFromArray = <T extends IEntity>(array: T[], payload: T | string): T[] => {
    return array.filter(object => {
        if (typeof payload === "string") {
            return object.id !== payload;
        }

        return object.id !== payload.id;
    });
};
