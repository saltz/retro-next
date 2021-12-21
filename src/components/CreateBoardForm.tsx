import React, {useEffect} from "react";
import {SubmitHandler} from "react-hook-form";
import {InputControl} from "../form/controls/InputControl";
import {FormBase} from "../form/FormBase";
import {Button} from "antd";
import {object, string} from "yup";
import {IState, useStoreActions, useStoreState} from "../store";
import {Actions, State} from "easy-peasy";
import {Board} from "../models/Board";
import {useRouter} from "next/router";

type CreateBoardForm = {
    name: string
}

const schema = object({
    name: string().required(),
});

export const CreateBoardForm: React.FC = () => {
    const router = useRouter();
    const createBoard = useStoreActions((actions: Actions<IState>) => actions.boardState.create);
    const board = useStoreState((state: State<IState>) => state.boardState.single);
    const createBoardDone = useStoreState((state: State<IState>) => state.boardState.createDone);

    const onSubmit: SubmitHandler<CreateBoardForm> = data => {
        createBoard(new Board(data.name));
    };

    useEffect(() => {
        if (board && createBoardDone) {
            router.push(`/${board.id}`);
        }
    }, [board, createBoardDone]);

    return (
        <FormBase<CreateBoardForm>
            onSubmit={onSubmit}
            submitText="Create"
            schema={schema}
            layout="vertical"
        >
            <InputControl label="Board name" name="name" itemProps={{required: true}}/>
        </FormBase>
    );
}