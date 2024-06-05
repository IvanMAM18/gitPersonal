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
import useGetDireccion from "../hooks/useGetDireccion";
import useGetColoniasByCodigoPostal from "../../../utils/hooks/useGetColoniasByCodigoPostal";
import axios from "axios";
import Notificacion from "../../../components/Notificacion";
import Map from "../../Cruds/CrudNegocio/components/Direccion/Map";
import { validarDatosRequeridos } from "./utils";
import Loading from "../../Cruds/CrudNegocio/components/Loading/Loading";
import { delegacionDefault, getListaDelegacionSelectOptions } from "../../../utils/ListaDelegaciones";

const Option = Select.Option;

export default function Direccion({
    personaMoralId,
    direccionId,
    showAdd,
    setDireccionNotificacionId,
    setDireccionId,
    codigosPostales,
    direccionAActualizar,
    tabChanged,
    showDelegacion = true
}) {
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
    const [colonias, getColoniasByCodigoPostal] =
        useGetColoniasByCodigoPostal();
    const [direccion, getDireccion] = useGetDireccion();
    const [_direccion, setDireccion] = useState({
        calle_principal: null,
        calles: null,
        codigo_postal: null,
        colonia_id: -1,
        latitud: null,
        longitude: null,
        numero_externo: null,
        numero_interno: null,
        id: null,
        delegacion: null
    });

    const [codigoPostal, setCodigoPostal] = useState(null);
    const [coloniaId, setColoniaId] = useState(null);

    useEffect(() => {
        getDireccion(direccionId);
    }, [direccionId, tabChanged]);

    useEffect(() => {
        if (direccion !== null) {
            setDireccion({
                ..._direccion,
                calle_principal: direccion?.calle_principal ?? null,
                calles: direccion?.calles ?? null,
                numero_externo: direccion?.numero_externo ?? null,
                numero_interno: direccion?.numero_interno ?? null,
                colonia_id: direccion?.colonia_id ?? -1,
                codigo_postal: direccion?.codigo_postal ?? null,
                latitud: direccion?.latitud ?? null,
                longitude: direccion?.longitude ?? null,
                id: direccion?.id ?? null,
                delegacion: showDelegacion ? direccion?.delegacion ?? delegacionDefault : null,
            });
            setCodigoPostal(direccion?.codigo_postal ?? null);
            if (direccionAActualizar === "direccion_id") {
                setDireccionId(direccion?.id ?? null);
            }

            if (direccionAActualizar === "direccion_notificacion_id") {
                setDireccionNotificacionId(direccion?.id ?? null);
            }
        }
    }, [direccion]);

    useEffect(() => {
        if (colonias.length > 0) {
            const colonia =
                colonias.find(
                    (colonia) => colonia.id === direccion?.colonia_id
                ) ?? null;
            setColoniaId(colonia?.id ?? -1);
        }
    }, [colonias]);

    useEffect(() => {
        if (codigoPostal !== null) {
            getColoniasByCodigoPostal(codigoPostal.toString());
        }
    }, [codigoPostal]);

    useEffect(() => {
        if (coloniaId !== null) {
            setDireccion({
                ..._direccion,
                colonia_id: coloniaId,
                codigo_postal: codigoPostal,
            });
            form.setFieldsValue({
                colonia_id: coloniaId,
            });
        }
    }, [coloniaId]);

    const setCoordenadasMapa = ({ latitud, longitude }) => {
        coordenadasMapa.latitud = latitud;
        coordenadasMapa.longitude = longitude;
    };

    const saveDireciconPersonaMoral = (url, values) => {
        axios
            .post(`/app${url}`, {
                ...values,
                ...coordenadasMapa,
            })
            .then((response) => {
                if (direccionAActualizar === "direccion_id") {
                    setNotificacionData({
                        title: "Actualización de datos generales.",
                        description: "Actualización de datos exitosa.",
                        open: true,
                        type: "success",
                        setNotificationData: setNotificacionData,
                    });

                    setDireccion({ ..._direccion, ...coordenadasMapa });
                    setDireccionId(response?.data?.id ?? null);
                }

                if (direccionAActualizar === "direccion_notificacion_id") {
                    setNotificacionData({
                        title: "Actualización de datos generales.",
                        description: "Actualización de datos exitosa.",
                        open: true,
                        type: "success",
                        setNotificationData: setNotificacionData,
                    });
                    setDireccionNotificacionId(response?.data?.id ?? null);
                }
            })
            .catch((error) => {
                setNotificacionData({
                    title: "Actualización de datos generales.",
                    description: "Ha habido un erro al actualizar los datos.",
                    open: true,
                    type: "error",
                    setNotificationData: setNotificacionData,
                });
                console.log(error);
            });
    };

    const crearDireccion = () => {
        const direccionValues = form.getFieldsValue(Object.keys(_direccion));
        if (
            validarDatosRequeridos(direccionValues, setNotificacionData) ===
            true
        )
            saveDireciconPersonaMoral("/guardar_direccion_persona_moral", {
                ...direccionValues,
                persona_moral_id: personaMoralId,
                accion: direccionAActualizar,
            });
    };

    const actualizarDireccion = () => {
        const direccionValues = form.getFieldsValue(Object.keys(_direccion));
        if (
            validarDatosRequeridos(direccionValues, setNotificacionData) ===
            true
        )
            saveDireciconPersonaMoral("/actualizar_direccion_persona_moral", {
                ...direccionValues,
                persona_moral_id: personaMoralId,
                accion: direccionAActualizar,
            });
    };

    const selectCodigoPostalProps = {
        showSearch: true,
        placeholder: "Códigos Postales",
        optionFilterProp: "children",
        filterOption: (input, option) =>
            option.value.includes(input.toString()),
        filterSort: (optionA, optionB) => optionB.value - optionA.value,
        onChange: (value, v) => {
            setCodigoPostal(value);
        },
        value: codigoPostal,
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
                            <Select
                                {...{
                                    showSearch: true,
                                    placeholder: "Colonias",
                                    optionFilterProp: "children",
                                    filterOption: (input, option) => {
                                        return (
                                            option?.children
                                                ?.toUpperCase()
                                                ?.includes(
                                                    input.toUpperCase()
                                                ) ?? false
                                        );
                                    },
                                    filterSort: (optionA, optionB) =>
                                        optionB.value - optionA.value,
                                    onChange: (value, v) => {
                                        console.log({ value });
                                        setColoniaId(value);
                                    },
                                }}
                                value={coloniaId}
                            >
                                {colonias &&
                                    [
                                        {
                                            id: -1,
                                            nombre_localidad:
                                                "Seleccione una colonia",
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
                        </Form.Item>
                    </Col>
                    {showDelegacion &&
                        <Col xs={24} sm={24} md={12} lg={8}>
                            <Form.Item label="Delegación" name={"delegacion"}>
                                <Select
                                    {...selectDelegacionProps}
                                />
                            </Form.Item>
                        </Col>}
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
                    {showAdd && (
                        <Button
                            onClick={() => {
                                crearDireccion();
                            }}
                        >
                            Guardar como nueva dirección
                        </Button>
                    )}
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
