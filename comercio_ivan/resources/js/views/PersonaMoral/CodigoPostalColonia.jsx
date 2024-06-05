import React, { useState, useEffect } from "react";
import { Col, Row, Select } from "antd";
import useGetColoniasByCodigoPostal from "../../utils/hooks/useGetColoniasByCodigoPostal";
import useGetCodigosPostales from "../../utils/hooks/useGetCodigosPostales";
const { Option } = Select;

const CodigoPostalColonia = ({ value = {}, onChange }) => {
    const [codigosPostales, getCodigosPostales] = useGetCodigosPostales();
    const [colonias, getColoniasByCodigoPostal] =
        useGetColoniasByCodigoPostal();
    const [codigoPostal, setCodigoPostal] = useState(null);
    const [coloniaId, setColoniaId] = useState(null);

    const triggerChange = (changedValue) => {
        onChange?.({
            codigo_postal: codigoPostal,
            colonia_id: coloniaId,
            ...value,
            ...changedValue,
        });
    };
    useEffect(() => {
        if (
            value?.colonia_id !== null &&
            value?.colonia_id !== undefined &&
            value?.codigo_postal !== null &&
            value?.codigo_postal !== undefined
        ) {
            getColoniasByCodigoPostal(value?.codigo_postal?.toString());
        }
    }, [value]);

    useEffect(() => {
        getCodigosPostales();
    }, []);

    useEffect(() => {
        if (codigoPostal !== null) {
            getColoniasByCodigoPostal(codigoPostal.toString());
        }
    }, [codigoPostal]);

    const onCodigoPostalChange = (nuevoCodigoPostal) => {
        setCodigoPostal(nuevoCodigoPostal);
        triggerChange({
            codigo_postal: nuevoCodigoPostal,
        });
    };

    const onColoniaChange = (nuevoColoniaId) => {
        setColoniaId(nuevoColoniaId);
        triggerChange({
            colonia_id: nuevoColoniaId,
        });
    };

    const selectCodigoPostalProps = {
        showSearch: true,
        placeholder: "Códigos Postales",
        optionFilterProp: "children",
        filterOption: (input, option) =>
            option.value.includes(input.toString()),
        filterSort: (optionA, optionB) => optionB.value - optionA.value,
        onChange: (value, v) => onCodigoPostalChange(value),
        value: value?.codigo_postal ?? codigoPostal,
    };

    const selectColoniasProps = {
        showSearch: true,
        placeholder: "Colonias",
        optionFilterProp: "children",
        filterOption: (input, option) => {
            return (
                option?.children
                    ?.toUpperCase()
                    ?.includes(input.toUpperCase()) ?? false
            );
        },
        filterSort: (optionA, optionB) => optionB.value - optionA.value,
        onChange: (value, v) => onColoniaChange(value),
        value: value?.colonia_id ?? coloniaId,
    };

    return (
        <Row
            style={{ justifyContent: "space-between", flexDirection: "row" }}
            gutter={[
                { xs: 8, sm: 16, md: 24 },
                { xs: 8, sm: 16, md: 24 },
            ]}
        >
            <Col xs={24} sm={24} md={12} lg={8}>
                <Select {...selectCodigoPostalProps}>
                    {codigosPostales &&
                        codigosPostales.map((item, optionIndex) => {
                            return (
                                <Option
                                    key={"optionIndex" + optionIndex}
                                    value={item.id}
                                >
                                    {item.nombre}
                                </Option>
                            );
                        })}
                </Select>
            </Col>
            <Col xs={24} sm={24} md={12} lg={16}>
                <Select {...selectColoniasProps}>
                    {colonias &&
                        [
                            {
                                id: -1,
                                nombre_localidad: "Seleccione una colonia",
                            },
                            ...colonias,
                        ].map((item, optionIndex) => (
                            <Option
                                key={"optionIndex" + optionIndex}
                                value={item.id}
                            >
                                {item.nombre_localidad}
                            </Option>
                        ))}
                </Select>
            </Col>
        </Row>
    );
};

export default CodigoPostalColonia;
