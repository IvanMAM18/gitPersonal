import React, { useEffect, useState } from "react";
import { Col, Form, Input, InputNumber, Select, Row } from "antd";
import Map from "./Map";
import { hasValue } from "./utils";
import CodigoPostalColonia from "./CodigoPostalColonia";
import { delegacionDefault, getListaDelegacionSelectOptions } from "../../utils/ListaDelegaciones";

const Option = Select.Option;
const Item = Form.Item;

export default function Direccion({ setDireccion, title, getDireccionData, showDelegacion = true }) {
    const [form] = Form.useForm();

    const checkCoordenadas = (_, value) => {
        if (hasValue(value.latitud) && hasValue(value.longitude)) {
            return Promise.resolve();
        }
        return Promise.reject(new Error("Debe ubicar el pin en el mapa."));
    };

    const checkCodigoPostalColonia = (_, value) => {
        if (hasValue(value.codigo_postal) && hasValue(value.colonia_id)) {
            return Promise.resolve();
        }

        if (hasValue(value.codigo_postal) === false) {
            return Promise.reject(
                new Error("Debe seleccionar un código postal.")
            );
        }
        if (hasValue(value.colonia_id) === false) {
            return Promise.reject(new Error("Debe seleccionar una colonia."));
        }
        return Promise.reject(
            new Error("Debe seleccionar un código postal y una colonia.")
        );
    };
    return (
        <Form
            key={Math.random()}
            layout={"vertical"}
            form={form}
            name="direccion"
            onFinish={(values) => console.log({ values })}
            style={{ paddingTop: 15, paddingBottom: 15 }}
            onValuesChange={(changedValues, allValues) => {
                Object.keys(allValues).forEach(key => { if (allValues[key] === undefined) allValues[key] = null; })
                setDireccion({
                    ...allValues,
                    ...getDireccionData(),
                    ...changedValues,
                });
            }}
            initialValues={getDireccionData()}
        >
            <Row
                style={{ justifyContent: "space-between" }}
                gutter={[
                    { xs: 8, sm: 16, md: 24 },
                    { xs: 8, sm: 16, md: 24 },
                ]}
            >
                {title && (
                    <Col xs={24} sm={24} md={24}>
                        <h3 style={{ margin: 15, marginBottom: 8 }}>{title}</h3>
                    </Col>
                )}
                <Col xs={24} sm={24} md={12}>
                    <Item label="Calle principal" name={"calle_principal"}>
                        <Input
                            placeholder="15 de Febrero"
                            style={{ textTransform: "uppercase" }}
                        />
                    </Item>
                </Col>
                <Col xs={24} sm={24} md={12}>
                    <Item label="Calles" name={"calles"}>
                        <Input
                            placeholder="Entre Granito y Alga"
                            style={{ textTransform: "uppercase" }}
                        />
                    </Item>
                </Col>

                <Col xs={24} sm={24} md={8} lg={4}>
                    <Item label="Número externo" name={"numero_externo"}>
                        <InputNumber
                            style={{
                                width: "100%",
                                textTransform: "uppercase",
                            }}
                            placeholder="2333"
                        />
                    </Item>
                </Col>
                <Col xs={24} sm={24} md={8} lg={4}>
                    <Item label="Número interno" name={"numero_interno"}>
                        <Input
                            placeholder="4A"
                            style={{ textTransform: "uppercase" }}
                        />
                    </Item>
                </Col>
                <Col xs={24} sm={24} md={24} lg={12}>
                    <Item
                        label="Código postal y colonia"
                        name={"codigo_postal_colonia"}
                        rules={[
                            {
                                validator: checkCodigoPostalColonia,
                            },
                        ]}
                    >
                        <CodigoPostalColonia />
                    </Item>
                </Col>
                {showDelegacion && <Col xs={24} sm={24} md={24} lg={12}>
                    <Item
                        label="Delegación"
                        name={"delegacion"} >
                        <Select options={getListaDelegacionSelectOptions()} />
                    </Item>
                </Col>}
            </Row>

            <Item
                label="Coordenadas"
                style={{ marginTop: 15, marginBottom: 15 }}
                name={"coordenadas"}
                rules={[
                    {
                        validator: checkCoordenadas,
                    },
                ]}
            >
                <Map
                    direccion={getDireccionData()}
                //setCoordenadasMapa={setCoordenadasMapa}
                />
            </Item>
        </Form>
    );
}
