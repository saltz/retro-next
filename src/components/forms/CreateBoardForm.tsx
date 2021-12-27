import React from "react";
import {SubmitHandler} from "react-hook-form";
import {InputControl} from "./controls/InputControl";
import {FormBase} from "./FormBase";
import {useRouter} from "next/router";
import firebase from "../../utils/firebaseClient";
import {BoardDocument, BoardDocumentConverter, boardDocumentValidationSchema} from "../../models/BoardDocument";
import {InputNumber} from "antd";
import {FormControlBase} from "./controls/FormControlBase";
import moment from "moment";

export const CreateBoardForm: React.FC = () => {
    const router = useRouter();
    const currentUserUid = firebase.auth().currentUser.uid;

    const onSubmit: SubmitHandler<BoardDocument> = async ({name, maximumVotes}) => {
        const board = new BoardDocument(name, currentUserUid, maximumVotes, moment());
        const document = await firebase.firestore().collection("boards")
            .withConverter(BoardDocumentConverter)
            .add(board);
        await router.push(`/boards/${document.id}`)
    };

    return (
        <FormBase<BoardDocument>
            onSubmit={onSubmit}
            defaultValues={{maximumVotes: 5}}
            submitText="Create"
            schema={boardDocumentValidationSchema}
            layout="vertical"
        >
            <InputControl label="Board name" name="name" itemProps={{required: true}}/>
            <FormControlBase
                name="maximumVotes"
                label="Maximum amount of votes per user"
                render={(controller) => <InputNumber min={1} {...controller.field} />}
            />
        </FormBase>
    );
}