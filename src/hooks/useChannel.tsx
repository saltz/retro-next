import {useEffect} from "react";
import {Types} from "ably";
import Message = Types.Message;
import {getAblyClient} from "../utils/ablyClient";


interface TypedMessage<T> extends Message {
    data: T;
}

export const useChannel = <T extends object>(channelName: string, callback: (message: TypedMessage<T>) => void) => {
    const ably = getAblyClient();
    const channel = ably.channels.get(channelName);

    useEffect(() => {
        channel.subscribe(message => callback(message));
        return () => channel.unsubscribe();
    });

    return [channel, ably];
};
