import Ably from "ably/promises";
import {Types} from "ably";
import RealtimePromise = Types.RealtimePromise;

const isServer = typeof window === "undefined";
const __NEXT_ABY_CLIENT__ = "__NEXT_ABY_CLIENT__";


export class AbbyClient {

}

let ablyClient: RealtimePromise;

export const getAblyClient = () => {
    if (isServer) {
        if (!ablyClient) {
            console.log("Creating new aby client on server");
            ablyClient = new Ably.Realtime.Promise({ authUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/ably/token`});
        }

        return ablyClient;
    }

    if (!window[__NEXT_ABY_CLIENT__]) {
        console.log("Creating new aby client on client");
        window[__NEXT_ABY_CLIENT__] = new Ably.Realtime.Promise({ authUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/ably/token`});
    }


    return window[__NEXT_ABY_CLIENT__];
}