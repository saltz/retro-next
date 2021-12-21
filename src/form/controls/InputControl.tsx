import {FormControlBase, IFormControlBase} from "./FormControlBase";
import {Input} from "antd";
import {FieldValues} from "react-hook-form";

interface IProps<T extends FieldValues> extends IFormControlBase<T> {
}

export const InputControl = <T extends FieldValues>(props: IProps<T>) => (
    <FormControlBase<T>
        name={props.name}
        label={props.label}
        itemProps={props.itemProps}
        render={(controller) => <Input {...controller.field} placeholder={props.label}/>}
    />
)