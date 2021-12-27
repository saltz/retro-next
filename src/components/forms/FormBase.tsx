import { Button, Form, Row } from "antd";
import {
    FieldValues,
    useForm,
    FormProvider,
    SubmitHandler,
} from "react-hook-form";
import React, { ReactNode } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormLayout } from "antd/es/form/Form";
import { DefaultValues } from "react-hook-form/dist/types/form";

interface IProps<T extends FieldValues> {
    children: ReactNode;
    onSubmit: SubmitHandler<T>;
    schema: any;
    defaultValues?: DefaultValues<T>;
    layout?: FormLayout;
    submitText?: string;
    hideSubmitButton?: boolean;
}

export const FormBase = <T extends FieldValues>(props: IProps<T>) => {
    const methods = useForm<T>({
        defaultValues: props.defaultValues,
        resolver: yupResolver(props.schema),
    });

    return (
        <FormProvider {...methods}>
            <Form
                onSubmitCapture={methods.handleSubmit(props.onSubmit)}
                layout={props.layout}
            >
                {props.children}
                {!props.hideSubmitButton && (
                    <Row justify="end" align="bottom">
                        <Button
                            htmlType="submit"
                            type="primary"
                            style={{ marginTop: "20px" }}
                        >
                            {props.submitText}
                        </Button>
                    </Row>
                )}
            </Form>
        </FormProvider>
    );
};
