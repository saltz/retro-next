import React from "react";
import {SubmitHandler} from "react-hook-form";
import {InputControl} from "./form/controls/InputControl";
import {FormBase} from "./form/FormBase";
import {object, string} from "yup";
import {useRouter} from "next/router";
import firebase from "../utils/firebaseClient";
import {BoardDocument, BoardDocumentConverter} from "../models/BoardDocument";

type CreateBoardForm = {
    name: string
}

const schema = object({
    name: string().required(),
});

export const CreateBoardForm: React.FC = () => {
    const router = useRouter();

    const onSubmit: SubmitHandler<CreateBoardForm> = async ({ name }) => {
        const board = new BoardDocument(name);
        const document = await firebase.firestore().collection("boards")
            .withConverter(BoardDocumentConverter)
            .add(board);
        await router.push(`/boards/${document.id}`)
    };

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