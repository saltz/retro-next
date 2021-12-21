import {NextApiHandler, NextApiRequest, NextApiResponse} from "next";
import {Board} from "../../../models/Board";
import {boards} from "../../../apiStore";

const handler: NextApiHandler = (request: NextApiRequest, response: NextApiResponse<Board>) => {
    const {method, query: {id}} = request;

    switch (method) {
        case "GET":
            const board = boards.find(i => i.id === id);

            if (board) {
                response.status(200).json(board);
            } else {
                response.status(404).end();
            }

            break;
        default:
            console.log(`${method} not implemented`);
            response.status(403).end();
            break;
    }
};

export default handler;