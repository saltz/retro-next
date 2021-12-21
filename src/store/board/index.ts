import {crud, ICrud} from "../crud";
import {Board} from "../../models/Board";

export interface IBoardState extends ICrud<Board> {
}

export const boardState: IBoardState = {
    ...crud("Board", "/api/boards"),
}