import { useRouter } from "next/router";
import React from "react";
import { SubmitHandler } from "react-hook-form";
import { object, string } from "yup";
import { InputControl } from "./controls/InputControl";
import { FormBase } from "./FormBase";

type JoinBoardForm = {
    key: string;
};

const schema = object({
    key: string().required(),
});

export const JoinBoardForm: React.FC = () => {
    const router = useRouter();

    const onSubmit: SubmitHandler<JoinBoardForm> = async (data) => {
        await router.push(`/boards/${data.key}`);
    };

    return (
        <FormBase<JoinBoardForm>
            onSubmit={onSubmit}
            submitText="Join"
            schema={schema}
            layout="vertical"
        >
            <InputControl
                label="Board key"
                name="key"
                itemProps={{ required: true }}
            />
            <div style={{ height: "88px" }} />
        </FormBase>
    );
};
