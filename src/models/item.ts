
export class Item {
    id: string;
    title: string;
    columnId: string;
    index: number;

    constructor(columnId: string, title: string) {
        this.columnId = columnId;
        this.title = title;
    }
}