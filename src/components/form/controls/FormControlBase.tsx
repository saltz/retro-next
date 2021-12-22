import {FieldPath, FieldValues, useController, UseControllerReturn} from "react-hook-form";
import {ReactNode} from "react";
import {Form, FormItemProps} from "antd";

export interface IFormControlBase<T extends FieldValues> {
    name: FieldPath<T>;
    label?: string;
    itemProps?: FormItemProps;
}

interface IProps<T extends FieldValues> extends IFormControlBase<T> {
    render: (controller: UseControllerReturn<T>) => ReactNode;
}

export const FormControlBase = <T extends FieldValues>(props: IProps<T>) => {
    const controller = useController<T>({ name: props?.name, });

    return (
        <Form.Item
            validateStatus={controller.fieldState.error ? "error" : ""}
            help={controller.fieldState.error?.message}
            label={props.label}
            {...props.itemProps}
        >
            {props.render(controller)}
        </Form.Item>
    )
}