import { Alert, Col, Divider, InputNumber, Row } from "antd";
import moment from "moment";
import { useRouter } from "next/router";
import React from "react";
import { SubmitHandler } from "react-hook-form";
import {
    BoardDocument,
    BoardDocumentConverter,
    boardDocumentValidationSchema,
} from "../../models/BoardDocument";
import {
    ColumnDocument,
    ColumnDocumentConverter,
} from "../../models/ColumnDocument";
import firebase from "../../utils/firebaseClient";
import { ArrayInputControl } from "./controls/ArrayInputControl";
import { FormControlBase } from "./controls/FormControlBase";
import { InputControl } from "./controls/InputControl";
import { FormBase } from "./FormBase";

interface IColumnData {
    id?: string;
    title: string;
}

interface IBoardFormData {
    name: string;
    maximumVotes: number;
    columns: IColumnData[];
}

export const CreateBoardForm: React.FC = () => {
    const router = useRouter();
    const currentUserUid = firebase.auth().currentUser.uid;

    const onSubmit: SubmitHandler<IBoardFormData> = async (data) => {
        const query = firebase
            .firestore()
            .collection("boards")
            .withConverter(BoardDocumentConverter);

        const document = await query.add(
            new BoardDocument(
                data.name,
                currentUserUid,
                data.maximumVotes,
                moment()
            )
        );

        for (let i = 0; i < data.columns.length; i++) {
            await query
                .doc(document.id)
                .collection("columns")
                .withConverter(ColumnDocumentConverter)
                .add(new ColumnDocument(data.columns[i].title, i));
        }

        await router.push(`/boards/${document.id}`);
    };

    return (
        <>
            <FormBase<IBoardFormData>
                onSubmit={onSubmit}
                defaultValues={{
                    maximumVotes: 5,
                    columns: [
                        { title: "What went well 👏" },
                        { title: "Things to improve 🔨" },
                        { title: "Action items 📋" },
                    ],
                }}
                submitText="Create"
                schema={boardDocumentValidationSchema}
                layout="vertical"
            >
                {(values, { columns }) => {
                    return (
                        <>
                            {values.columns.length === 0 && columns && (
                                <Alert
                                    style={{ margin: "0 0 20px" }}
                                    message={columns.message}
                                    type="error"
                                    showIcon={true}
                                />
                            )}
                            <Row justify="space-between">
                                <Col span={10}>
                                    <h3>General:</h3>
                                    <Divider />
                                    <InputControl
                                        label="Board name"
                                        name="name"
                                        itemProps={{ required: true }}
                                    />
                                    <FormControlBase
                                        name="maximumVotes"
                                        label="Maximum amount of votes per user"
                                        render={(controller) => (
                                            <InputNumber
                                                min={1}
                                                {...controller.field}
                                            />
                                        )}
                                    />
                                </Col>
                                <Col span={10}>
                                    <h3>Columns:</h3>
                                    <Divider />
                                    <ArrayInputControl name="columns">
                                        {(index) => (
                                            <InputControl
                                                label="Column title"
                                                name={`columns.${index}.title`}
                                            />
                                        )}
                                    </ArrayInputControl>
                                </Col>
                            </Row>
                        </>
                    );
                }}
            </FormBase>
        </>
    );
};
