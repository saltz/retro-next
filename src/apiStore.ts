import {Board} from "./models/Board";
import {Item} from "./models/item";

// This is the in memory database for the application
// this data will only live as long as the runtime of the application.

export const boards: Board[] = [];
export const items: Item[] = [];