import {Button, Form} from "antd";
import {FieldValues, useForm, FormProvider, SubmitHandler} from "react-hook-form";
import React, {ReactNode} from "react";
import {ObjectSchema} from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import {FormLayout} from "antd/es/form/Form";

interface IProps<T extends FieldValues> {
    children: ReactNode;
    onSubmit: SubmitHandler<T>;
    schema: any;
    submitText: string;
    layout?: FormLayout;
}

export const FormBase = <T extends FieldValues>(props: IProps<T>) => {
    const methods = useForm<T>({
        resolver: yupResolver(props.schema),
    });

    return (
        <FormProvider {...methods}>
            <Form onSubmitCapture={methods.handleSubmit(props.onSubmit)} layout={props.layout}>
                {props.children}
                <Button
                    htmlType="submit"
                    type="primary"
                    style={{ position: "relative", float: "right", marginTop: "20px"}}
                >
                    {props.submitText}
                </Button>
            </Form>
        </FormProvider>
    )
}