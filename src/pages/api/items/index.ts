import {NextApiHandler, NextApiRequest, NextApiResponse} from "next";
import {Item} from "../../../models/item";
import {items} from "../../../apiStore";
import * as uuid from "uuid";
import {getAblyClient} from "../../../utils/ablyClient";

interface IItemsRequest extends NextApiRequest {
    body: Item;
}

const ably = getAblyClient();

const handler: NextApiHandler = (request: IItemsRequest, response: NextApiResponse<Item | Item[]>) => {
    const {method, body} = request;

    switch (method) {
        case "GET":
            response.status(200).json(items);
            break;
        case "POST":
            if (!body.id) {
                body.id = uuid.v4();
            }
            items.push(body)
            response.status(201).json(body);
            break;
        default:
            console.log("not implemented");
            break;
    }
};

export default handler;