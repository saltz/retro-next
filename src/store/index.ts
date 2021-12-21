import {createStore, createTypedHooks} from "easy-peasy";
import {IItemState, itemState} from "./item";
import {boardState, IBoardState} from "./board";

export interface IState {
    itemState: IItemState;
    boardState: IBoardState;
}

export const store = createStore<IState>({
    itemState,
    boardState,
});

const typedHooks = createTypedHooks<IState>();

export const useStoreActions = typedHooks.useStoreActions;
export const useStoreDispatch = typedHooks.useStoreDispatch;
export const useStoreState = typedHooks.useStoreState;