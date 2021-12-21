import {IEntity} from "./IEntity";

export class Board implements IEntity {
    id: string;
    key: string;
    name: string;

    constructor(name: string) {
        this.name = name;
    }
}