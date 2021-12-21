import {NextApiHandler, NextApiRequest, NextApiResponse} from "next";
import Ably, {Types} from "ably/promises";
import TokenRequest = Types.TokenRequest;

const handler: NextApiHandler = async (request: NextApiRequest, response: NextApiResponse<TokenRequest>) => {
    const client = new Ably.Realtime(process.env.ABLY_API_KEY);
    const token = await client.auth.createTokenRequest({clientId: "retro-next"});

    response.status(200).json(token);
};

export default handler;