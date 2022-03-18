import React from "react";
import { BoardDocument } from "../../models/BoardDocument";
import { VoteDocument } from "../../models/VoteDocument";

interface IBoardContext {
    boardId: string;
    board: BoardDocument;
    currentVotes: VoteDocument[];
    maximumAmountOfVotes: number;
}

export const BoardContext = React.createContext<IBoardContext>({
    boardId: "",
    board: undefined,
    currentVotes: [],
    maximumAmountOfVotes: 0,
});
