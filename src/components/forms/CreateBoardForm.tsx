import React from "react";
import {SubmitHandler} from "react-hook-form";
import {InputControl} from "./controls/InputControl";
import {FormBase} from "./FormBase";
import {number, object, string} from "yup";
import {useRouter} from "next/router";
import firebase from "../../utils/firebaseClient";
import {BoardDocument, BoardDocumentConverter} from "../../models/BoardDocument";
import {InputNumber} from "antd";
import {FormControlBase} from "./controls/FormControlBase";

const schema = object({
    name: string().required(),
    maximumVotes: number()
});

export const CreateBoardForm: React.FC = () => {
    const router = useRouter();

    const onSubmit: SubmitHandler<BoardDocument> = async ({ name , maximumVotes = 5}) => {
        const board = new BoardDocument(name, maximumVotes);
        const document = await firebase.firestore().collection("boards")
            .withConverter(BoardDocumentConverter)
            .add(board);
        await router.push(`/boards/${document.id}`)
    };

    return (
        <FormBase<BoardDocument>
            onSubmit={onSubmit}
            submitText="Create"
            schema={schema}
            layout="vertical"
        >
            <InputControl label="Board name" name="name" itemProps={{required: true}}/>
            <FormControlBase
                name="maximumVotes"
                label="Maximum amount of votes per user"
                render={(controller) => <InputNumber defaultValue={5} min={1} {...controller.field} />}
            />
        </FormBase>
    );
}