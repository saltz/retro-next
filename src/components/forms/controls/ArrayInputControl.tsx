import { DeleteOutlined } from "@ant-design/icons";
import { Button, Col, Row } from "antd";
import React, { ReactNode } from "react";
import { FieldPath, FieldValues, useFieldArray } from "react-hook-form";

interface IProps<T> {
    name: FieldPath<T>;
    children(index: number): ReactNode;
}

export const ArrayInputControl = <T extends FieldValues>(props: IProps<T>) => {
    const { fields, append, remove } = useFieldArray({ name: props.name });

    return (
        <>
            {fields.map((field, index) => (
                <Row justify="space-between" key={field.id}>
                    <Col span={20}>{props.children(index)}</Col>
                    <Col span={1} offset={1}>
                        <DeleteOutlined
                            onClick={() => remove(index)}
                            style={{ color: "#df4040" }}
                        />
                    </Col>
                </Row>
            ))}
            <Button
                style={{
                    width: "100%",
                    borderStyle: "dotted",
                }}
                onClick={() => append({})}
            >
                Add
            </Button>
        </>
    );
};
