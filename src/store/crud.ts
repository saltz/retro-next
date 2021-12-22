import {IEntity} from "../models/IEntity";
import {action, Action, Actions, generic, Generic, State, thunk, Thunk} from "easy-peasy";
import {PatchDocument} from "../utils/patchDocument";
import {appendOrUpdateArray, removeFromArray} from "./stateUtils";

interface IUpdate {
    id: string,
    patch: PatchDocument;
}

export interface ICrud<TEntity extends IEntity> {
    collection: Generic<TEntity[]>;

    getLoading: boolean;
    getDone: boolean;
    get: Thunk<ICrud<TEntity>>;
    setCollection: Action<ICrud<TEntity>, TEntity[]>;
    setGetLoading: Action<ICrud<TEntity>, boolean>;
    setGetDone: Action<ICrud<TEntity>, boolean>;

    single: Generic<TEntity>;

    getByIdLoading: boolean;
    getByIdDone: boolean;
    getById: Thunk<ICrud<TEntity>, string>;
    setSingle: Action<ICrud<TEntity>, TEntity>;
    setGetByIdLoading: Action<ICrud<TEntity>, boolean>;
    setGetByIdDone: Action<ICrud<TEntity>, boolean>;

    createLoading: boolean;
    createDone: boolean;
    create: Thunk<ICrud<TEntity>, TEntity>;
    appendCollection: Action<ICrud<TEntity>, TEntity>;
    setCreateLoading: Action<ICrud<TEntity>, boolean>;
    setCreateDone: Action<ICrud<TEntity>, boolean>;

    updateLoading: boolean;
    updateDone: boolean;
    update: Thunk<ICrud<TEntity>, IUpdate>;
    setUpdateLoading: Action<ICrud<TEntity>, boolean>;
    setUpdateDone: Action<ICrud<TEntity>, boolean>;

    deleteLoading: boolean;
    deleteDone: boolean;
    delete: Thunk<ICrud<TEntity>, string>;
    removeFromCollection: Action<ICrud<TEntity>, string>;
    setDeleteLoading: Action<ICrud<TEntity>, boolean>;
    setDeleteDone: Action<ICrud<TEntity>, boolean>;
}

export const crud = <TEntity extends IEntity>(entityName: string, path: string): ICrud<TEntity> => ({
    collection: generic([]),

    getLoading: false,
    getDone: false,
    get: thunk(async (actions: Actions<ICrud<TEntity>>) => {
        actions.setGetLoading(true);
        actions.setGetDone(false);

        const response = await fetch(path);

        if (response.status === 200) {
            actions.setCollection(await response.json());
        }

        actions.setGetLoading(false);
        actions.setGetDone(true);
    }),
    setCollection: action((state: State<ICrud<TEntity>>, payload: TEntity[]) => {
        state.collection = payload;
    }),
    setGetLoading: action((state: State<ICrud<TEntity>>, payload: boolean) => {
        state.getLoading = payload;
    }),
    setGetDone: action((state: State<ICrud<TEntity>>, payload: boolean) => {
        state.getDone = payload;
    }),

    single: undefined,

    getByIdLoading: false,
    getByIdDone: false,
    getById: thunk(async (actions: Actions<ICrud<TEntity>>, id: string) => {
        actions.setGetByIdLoading(true);
        actions.setGetByIdDone(false);

        const response = await fetch(`${path}/${id}`);

        if (response.status === 200) {
            actions.setSingle(await response.json());
        }

        actions.setGetByIdLoading(false);
        actions.setGetByIdDone(true);
    }),
    setSingle: action((state: State<ICrud<TEntity>>, payload: TEntity) => {
        state.single = payload;
    }),
    setGetByIdLoading: action((state: State<ICrud<TEntity>>, payload: boolean) => {
        state.getByIdLoading = payload;
    }),
    setGetByIdDone: action((state: State<ICrud<TEntity>>, payload: boolean) => {
        state.getByIdDone = payload;
    }),

    createLoading: false,
    createDone: false,
    create: thunk(async (actions: Actions<ICrud<TEntity>>, payload: TEntity) => {
        actions.setCreateLoading(true);
        actions.setCreateDone(false);

        const response = await fetch(path, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload),
        });

        if (response.status === 201) {
            const board = await response.json();
            actions.appendCollection(board);
            actions.setSingle(board);
        }

        actions.setCreateLoading(false);
        actions.setCreateDone(true);
    }),
    appendCollection:action((state: State<ICrud<TEntity>>, payload: TEntity) => {
        state.collection = appendOrUpdateArray(state.collection, payload);
    }),
    setCreateLoading: action((state: State<ICrud<TEntity>>, payload: boolean) => {
        state.createLoading = payload;
    }),
    setCreateDone: action((state: State<ICrud<TEntity>>, payload: boolean) => {
        state.createDone = payload;
    }),

    updateLoading: false,
    updateDone: false,
    update: thunk(async (actions: Actions<ICrud<TEntity>>, payload: IUpdate) => {
        actions.setUpdateLoading(true);
        actions.setUpdateDone(false);

        const response = await fetch(`${path}/${payload.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload.patch),
        });

        if (response.status === 200) {
            actions.appendCollection(await response.json());
        }

        actions.setUpdateLoading(false);
        actions.setUpdateDone(true);
    }),
    setUpdateLoading: action((state: State<ICrud<TEntity>>, payload: boolean) => {
        state.updateLoading = payload;
    }),
    setUpdateDone: action((state: State<ICrud<TEntity>>, payload: boolean) => {
        state.updateDone = payload;
    }),

    deleteLoading: false,
    deleteDone: false,
    delete: thunk(async (actions: Actions<ICrud<TEntity>>, id: string) => {
        actions.setDeleteLoading(true);
        actions.setDeleteDone(false);

        const response = await fetch(`${path}/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
        });

        if (response.status === 204) {
            actions.removeFromCollection(id)
        }

        actions.setDeleteLoading(false);
        actions.setDeleteDone(true);
    }),
    removeFromCollection: action((state: State<ICrud<TEntity>>, payload: string) => {
        state.collection = removeFromArray(state.collection, payload);
    }),
    setDeleteLoading: action((state: State<ICrud<TEntity>>, payload: boolean) => {
        state.deleteLoading = payload;
    }),
    setDeleteDone: action((state: State<ICrud<TEntity>>, payload: boolean) => {
        state.deleteDone = payload;
    }),
});