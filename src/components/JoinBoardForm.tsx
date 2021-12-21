import React from "react";
import {SubmitHandler} from "react-hook-form";
import {InputControl} from "../form/controls/InputControl";
import {FormBase} from "../form/FormBase";
import {Button, Divider} from "antd";
import {object, string} from "yup";
import {useRouter} from "next/router";

type JoinBoardForm = {
    key: string
}

const schema = object({
    key: string().required(),
});

export const JoinBoardForm: React.FC = () => {
    const router = useRouter();

    const onSubmit: SubmitHandler<JoinBoardForm> = async (data) => {
        const response = await fetch(`/api/boards?key=${data.key}`);

        if (response.status === 200) {
            const board = await response.json();
            await router.push(`/${board.id}`)
        }
    };

    return (
        <FormBase<JoinBoardForm>
            onSubmit={onSubmit}
            submitText="Join"
            schema={schema}
            layout="vertical"
        >
            <InputControl label="Board key" name="key" itemProps={{required: true}}/>
        </FormBase>
    );
}