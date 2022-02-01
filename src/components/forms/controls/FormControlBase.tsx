import { Form, FormItemProps } from "antd";
import { ReactNode } from "react";
import {
    FieldPath,
    FieldValues,
    useController,
    UseControllerReturn,
} from "react-hook-form";

export interface IFormControlBase<T extends FieldValues> {
    name: FieldPath<T>;
    label?: string;
    itemProps?: FormItemProps;
}

interface IProps<T extends FieldValues> extends IFormControlBase<T> {
    render: (controller: UseControllerReturn<T>) => ReactNode;
}

export const FormControlBase = <T extends FieldValues>(props: IProps<T>) => {
    const controller = useController<T>({ name: props?.name });

    const helpText = controller.fieldState.error?.message.includes(".")
        ? controller.fieldState.error?.message.substring(
              controller.fieldState.error?.message.lastIndexOf(".") + 1,
              controller.fieldState.error?.message.length
          )
        : controller.fieldState.error?.message;

    return (
        <Form.Item
            validateStatus={controller.fieldState.error ? "error" : ""}
            help={helpText}
            label={props.label}
            {...props.itemProps}
        >
            {props.render(controller)}
        </Form.Item>
    );
};
