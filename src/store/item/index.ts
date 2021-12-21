import {Item} from "../../models/item";
import {crud, ICrud} from "../crud";

export interface IItemState extends ICrud<Item> {
}

export const itemState: IItemState = {
    ...crud("Item", "/api/item"),
}