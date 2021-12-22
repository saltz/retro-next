import {NextApiHandler, NextApiRequest, NextApiResponse} from "next";
import {Item} from "../../../models/item";
import {items} from "../../../apiStore";
import * as uuid from "uuid";

interface IItemsRequest extends NextApiRequest {
    body: Item;
}

const handler: NextApiHandler = (request: IItemsRequest, response: NextApiResponse<Item | Item[]>) => {
    const {method, body, query: {columnId}} = request;

    switch (method) {
        case "GET":
            if (columnId) {
                response.status(200).json(items.filter((item) => item.columnId === columnId));
            } else {
                response.status(200).json(items);
            }
            break;
        case "POST":
            body.id = uuid.v4();
            items.push(body)
            response.status(201).json(body);
            break;
        default:
            console.log("not implemented");
            break;
    }
};

export default handler;