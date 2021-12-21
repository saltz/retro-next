import {NextApiHandler, NextApiRequest, NextApiResponse} from "next";
import {Board} from "../../../models/Board";
import {boards} from "../../../apiStore";
import * as uuid from "uuid";
import {generateKey} from "../../../utils/keyGenerator";
import Ably from "ably/promises";

interface BoardRequest extends NextApiRequest {
    body: Board;
}


const handler: NextApiHandler = (request: BoardRequest, response: NextApiResponse<Board | Board[]>) => {
    const {method, body, query} = request;

    switch (method) {
        case "GET":
            if (query.key) {
                const board = boards.find(i => i.key === query.key);
                if (board) {
                    response.status(200).json(board);
                } else {
                    response.status(404).end();
                }
            } else {
                response.status(200).json(boards);
            }
            break;
        case "POST":
            body.id = uuid.v4();
            body.key = generateKey(10);
            boards.push(body)
            response.status(201).json(body);
            break;
        default:
            console.log(`${method} not implemented`);
            response.status(403).end();
            break;
    }
};

export default handler;