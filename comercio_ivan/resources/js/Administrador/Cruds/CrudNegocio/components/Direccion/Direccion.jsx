import React, { useEffect, useState } from "react";
import {
    Button,
    Col,
    Form,
    Input,
    InputNumber,
    Space,
    Select,
    Row,
} from "antd";
import useGetDireccion from "../../hooks/useGetDireccion";
import useGetColoniasByCodigoPostal from "../../../../../utils/hooks/useGetColoniasByCodigoPostal";
import useGetCodigosPostales from "../../../../../utils/hooks/useGetCodigosPostales";
import axios from "axios";
import Loading from "../Loading/Loading";
import Map from "./Map";
import { validarDatosRequeridos } from "./utils";
import Notificacion from "../../../../../components/Notificacion";

import { delegacionDefault, getListaDelegacionSelectOptions } from "../../../../../utils/ListaDelegaciones";

const Option = Select.Option;

export default function Direccion({ direccionId }) {
    const coordenadasMapa = {
        latitud: 0,
        longitude: 0,
    };
    const [form] = Form.useForm();
    const [notificationData, setNotificacionData] = useState({
        title: "Datos actualizados",
        description: "",
        open: false,
    });
    const [codigosPostales, getCodigosPostales] = useGetCodigosPostales();
    const [colonias, getColoniasByCodigoPostal] =
        useGetColoniasByCodigoPostal();
    const [direccion, getDireccion] = useGetDireccion();
    const [_direccion, setDireccion] = useState({
        calle_principal: null,
        calles: null,
        codigo_postal: null,
        colonia_id: null,
        latitud: null,
        longitude: null,
        numero_externo: null,
        numero_interno: null,
        id: null,
        delegacion: delegacionDefault
    });

    useEffect(() => {
        getCodigosPostales();
        getDireccion(direccionId);
    }, [direccionId]);

    useEffect(() => {
        if (direccion !== null) {
            setDireccion({
                ..._direccion,
                calle_principal: direccion?.calle_principal ?? null,
                calles: direccion?.calles ?? null,
                numero_externo: direccion?.numero_externo ?? null,
                numero_interno: direccion?.numero_interno ?? null,
                colonia_id: direccion?.colonia_id ?? null,
                codigo_postal: direccion?.codigo_postal ?? null,
                latitud: direccion?.latitud ?? null,
                longitude: direccion?.longitude ?? null,
                id: direccion?.id ?? null,
                delegacion: direccion?.delegacion ?? delegacionDefault
            });
            getColoniasByCodigoPostal(direccion?.codigo_postal ?? null);
        }
    }, [direccion]);

    useEffect(() => {
        if (colonias.length > 0) {
            const colonia =
                colonias.find(
                    (colonia) => colonia.id === direccion?.colonia_id
                ) ?? null;
            setDireccion({ ..._direccion, colonia_id: colonia?.id ?? null });
        }
    }, [colonias]);

    const setCoordenadasMapa = ({ latitud, longitude }) => {
        coordenadasMapa.latitud = latitud;
        coordenadasMapa.longitude = longitude;
    };

    const actualizarDireccion = () => {
        const direccionValues = form.getFieldsValue(Object.keys(_direccion));
        if (
            validarDatosRequeridos(direccionValues, setNotificacionData) ===
            true
        ) {
            console.log({
                ...direccionValues,
                ...coordenadasMapa,
            });
            axios
                .post(`/app/update_direccion_negocio`, {
                    ...direccionValues,
                    ...coordenadasMapa,
                })
                .then((response) => {
                    setNotificacionData({
                        title: "Dirección actualizada",
                        description: "Actualización de dirección exitosa. ",
                        open: true,
                        type: "success",
                        setNotificationData: setNotificacionData,
                    });
                    setDireccion({ ..._direccion, ...coordenadasMapa });
                })
                .catch((error) => {
                    setNotificacionData({
                        title: "Dirección actualizada",
                        description:
                            "Ha habido un erro al actualizar la dirección.",
                        open: true,
                        type: "error",
                        setNotificationData: setNotificacionData,
                    });
                    console.log(error);
                });
        }
    };

    const selectCodigoPostalProps = {
        showSearch: true,
        placeholder: "Códigos Postales",
        optionFilterProp: "children",
        filterOption: (input, option) =>
            option.value.includes(input.toString()),
        filterSort: (optionA, optionB) => optionB.value - optionA.value,
        onChange: (value, v) => {
            getColoniasByCodigoPostal(value.toString());
            setDireccion({
                ..._direccion,
                codigo_postal: value?.toString() ?? null,
            });
        },
        value: _direccion?.codigo_postal,
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
        value: _direccion?.colonia_id,
        onChange: (value) => {
            setDireccion({ ..._direccion, colonia_id: value ?? null });
        },
    };
    const selectDelegacionProps = {
        showSearch: true,
        placeholder: "Delegacion",
        optionFilterProp: "children",
        filterOption: (input, option) => {
            return (
                option?.children
                    ?.toUpperCase()
                    ?.includes(input.toUpperCase()) ?? false
            );
        },
        filterSort: (optionA, optionB) => optionB.value - optionA.value,
        value: _direccion?.delegacion ?? delegacionDefault,
        onChange: (value) => {
            setDireccion({ ..._direccion, delegacion: value ?? delegacionDefault });
        },
        options: getListaDelegacionSelectOptions()
    };

    return _direccion.id !== null ? (
        <>
            <Notificacion {...notificationData} />
            <Form
                key={Math.random()}
                layout={"vertical"}
                form={form}
                name="direccion"
                initialValues={{ ..._direccion }}
                onFinish={(values) => console.log({ values })}
                style={{ paddingTop: 15, paddingBottom: 15 }}
            >
                <Row
                    style={{ justifyContent: "space-between" }}
                    gutter={[
                        { xs: 8, sm: 16, md: 24 },
                        { xs: 8, sm: 16, md: 24 },
                    ]}
                >
                    <Col xs={24} sm={24} md={12}>
                        <Form.Item
                            label="Calle principal"
                            name={"calle_principal"}
                        >
                            <Input
                                placeholder="15 de Febrero"
                                style={{ textTransform: "uppercase" }}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={12}>
                        <Form.Item label="Calles" name={"calles"}>
                            <Input
                                placeholder="Entre Granito y Alga"
                                style={{ textTransform: "uppercase" }}
                            />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={8} lg={4}>
                        <Form.Item
                            label="Número externo"
                            name={"numero_externo"}
                        >
                            <InputNumber
                                style={{
                                    width: "100%",
                                    textTransform: "uppercase",
                                }}
                                placeholder="2333"
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={8} lg={4}>
                        <Form.Item
                            label="Número interno"
                            name={"numero_interno"}
                        >
                            <Input
                                placeholder="4A"
                                style={{ textTransform: "uppercase" }}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={4}>
                        <Form.Item label="Código postal" name={"codigo_postal"}>
                            <Select {...selectCodigoPostalProps}>
                                {codigosPostales &&
                                    codigosPostales.map((item, optionIndex) => {
                                        return (
                                            <Option
                                                key={
                                                    "optionIndex" + optionIndex
                                                }
                                                value={item.id}
                                            >
                                                {item.nombre}
                                            </Option>
                                        );
                                    })}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={8}>
                        <Form.Item label="Colonia" name={"colonia_id"}>
                            <Select {...selectColoniasProps}>
                                {colonias &&
                                    colonias.map((item, optionIndex) => (
                                        <Option
                                            key={"optionIndex" + optionIndex}
                                            value={item.id}
                                        >
                                            {item.nombre_localidad}
                                        </Option>
                                    ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={8}>
                        <Form.Item label="Delegación" name={"delegacion"}>
                            <Select {...selectDelegacionProps} />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item
                    label="Coordenadas"
                    style={{ marginTop: 15, marginBottom: 15 }}
                >
                    <Map
                        direccion={_direccion}
                        setCoordenadasMapa={setCoordenadasMapa}
                    />
                </Form.Item>
                <Space
                    direction={"horizontal"}
                    align={"end"}
                    style={{ justifyContent: "flex-end", display: "flex" }}
                >
                    <Button
                        onClick={() => {
                            actualizarDireccion();
                        }}
                    >
                        Actualizar dirección
                    </Button>
                </Space>
            </Form>
        </>
    ) : (
        <Loading />
    );
}
