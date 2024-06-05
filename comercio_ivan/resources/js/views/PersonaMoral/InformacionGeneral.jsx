import React, { useState, useEffect, useRef } from "react";
import catalogoRegimenFiscal from "../../utils/regimenFiscalList";
import { regimenes_capital } from "../../utils/ListaRegimenesCapital";
import Notificacion from "./Notificacion";
import { Button, Form, Input, Select, Space, Upload, Radio } from "antd";

import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import useValidarRFC from "../../utils/hooks/useValidarRFC";
import { convertStringsToUppercase, rfc_regex } from "./utils";
import Direccion from "./Direccion";
import { validarDatosRequeridos } from "./utils";
import "./CrudPersonaModalStyles.scss";
import useGetNegocios from "./hooks/useGetNegocios";

const { Option } = Select;
const uploadHeaders = {
    _token: document.head.querySelector('meta[name="csrf-token"]').content ?? window.csrf,
};
const direccionDefaultValues = {
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
};
export default function InformacionGeneral({
    getAllDataToSave,
    setAllDataToSave,
    setRegister
}) {
    const notiRef = useRef(null);
    const [form] = Form.useForm();
    const [showNewDir, setShowNewDir] = useState(false);
    const [esRFCVAlido, validarRFC] = useValidarRFC();
    const [negociosNoPersonaMoral, setNegociosNoPersonaMoral] = useState();
    const [negocios, getNegocios] = useGetNegocios();

    useEffect(() => {
        getNegocios('user');
    }, []);
    useEffect(() => {
        if (negocios?.length > 0) {
            setNegociosNoPersonaMoral(negocios?.filter(negocio => negocio?.persona_moral_id === null) ?? [])
        }
    }, [negocios]);

    let direccion = {
        ...getAllDataToSave()?.direccion,
        ...direccionDefaultValues,
    };

    let direccionNoti = {
        ...getAllDataToSave()?.direccionNoti,
        ...direccionDefaultValues,
    };

    const [regimenFiscalList] = useState(
        catalogoRegimenFiscal.filter(
            (regimenFiscal) => regimenFiscal?.persona_moral === true
        )
    );
    const [regimenCapitalList] = useState(regimenes_capital);

    const saveData = () => {
        const dataToSave = {
            ...getAllDataToSave(),
            mismaDireccion: !showNewDir,
            acta_constitutiva_path:
                getAllDataToSave()?.acta_constitutiva?.[0]?.response ?? null,
        };

        axios
            .post(
                "/app/crear_persona_moral",
                convertStringsToUppercase(dataToSave, [
                    "acta_constitutiva_path",
                ])
            )
            .then((response) => {
                if (response?.data?.error_rfc === true) {
                    notiRef?.current?.showNotification({
                        title: "RFC en uso.",
                        description: "El RFC ingresado ya ha sido registrado.",
                        type: "error",
                        open: true,
                    });
                } else {
                    notiRef?.current?.showNotification({
                        title: "Actualización de datos generales.",
                        description: "Actualización de datos exitosa.",
                        type: "success",
                        open: true,
                    });
                    setRegister(false);
                }
            })
            .catch((error) => {
                notiRef?.current?.showNotification({
                    title: "Actualización de datos generales.",
                    description: "Ha habido un erro al actualizar los datos.",
                    type: "error",
                    open: true,
                });
            });
    };

    const validateData = () => {
        if (
            validarDatosRequeridos(
                getDireccionData(),
                notiRef?.current?.showNotification
            ) === false
        ) {
            return;
        }
        if (
            showNewDir === true &&
            validarDatosRequeridos(
                getDireccionNotiData(),
                notiRef?.current?.showNotification
            ) === false
        ) {
            return;
        }

        saveData();
    }

    useEffect(() => {
        if (esRFCVAlido !== null) {
            if (
                esRFCVAlido.cancelado === false &&
                esRFCVAlido.localizado === true
            ) {
                validateData();
            } else {
                notiRef?.current?.showNotification({
                    title: "RFC no valido.",
                    description: "El RFC ingresado no es un RFC valido.",
                    type: "error",
                    open: true,
                });
            }
        }
    }, [esRFCVAlido]);

    const onFinish = (values) => {
        validarRFC(values?.rfc);
    };

    const getRegimenFiscalSelectOptions = () =>
        regimenFiscalList?.map((regimenFiscal) => (
            <Option
                value={regimenFiscal?.id}
                key={regimenFiscal?.id ?? Math.random()}
            >
                {regimenFiscal?.name}
            </Option>
        )) ?? <></>;

    const getRegimenCapitalSelectOptions = () =>
        regimenCapitalList?.map((regimenCapital) => (
            <Option
                value={regimenCapital?.id}
                key={regimenCapital?.id ?? Math.random()}
            >
                {`${regimenCapital?.id} - ${regimenCapital?.name}`}
            </Option>
        )) ?? <></>;

    const normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e.fileList;
    };

    const uploadActaResult = (info) => {
        const { status } = info.file;
        if (status === "done") {
            notiRef?.current?.showNotification({
                title: "Acta Constitutiva.",
                description: "Acta subida correctamente.",
                type: "success",
                open: true,
            });
        } else if (status === "error") {
            let errorMessage = "";
            if (info.file.response.includes("bytes exceeds the limit")) {
                errorMessage =
                    "El archivo es demasiado grande, el límite de subida es de 50 MB";
            } else {
                errorMessage = "Ocurrió un error al subir el archivo";
            }
            notiRef?.current?.showNotification({
                title: "Acta Constitutiva.",
                description: errorMessage,
                type: "error",
                open: true,
            });
        }
    };

    const getDireccionData = () => {
        return getAllDataToSave()?.direccion;
    };

    const getDireccionNotiData = () => {
        return getAllDataToSave()?.direccionNoti;
    };

    return (
        <>
            <Notificacion ref={notiRef} />

            <Form
                key={Math.random()}
                layout={"vertical"}
                ref={form}
                name="persona_moral"
                onFinish={onFinish}
                onValuesChange={(changedValues, allValues) => {
                    if (allValues?.direccion_noti_group === "nueva_direccion") {
                        setShowNewDir(true);
                    }
                    if (allValues?.direccion_noti_group === "misma_direccion") {
                        setShowNewDir(false);
                    }
                    console.log({
                        ...getAllDataToSave(),
                        ...allValues,
                        direccion: getDireccionData(),
                        direccionNoti: getDireccionNotiData(),
                        mismaDireccion:
                            allValues?.direccion_noti_group ===
                            "misma_direccion",
                    });
                    setAllDataToSave({
                        ...getAllDataToSave(),
                        ...allValues,
                        direccion: getDireccionData(),
                        direccionNoti: getDireccionNotiData(),
                        mismaDireccion:
                            allValues?.direccion_noti_group ===
                            "misma_direccion",
                    });
                }}
                initialValues={{
                    ...getAllDataToSave(),
                    direccion_noti_group:
                        getAllDataToSave()?.direccion_noti_group ??
                        "misma_direccion",

                }}
            >
                <Form.Item
                    name="negocio_id"
                    label="Negocio a asignar"
                >
                    <Select

                        style={{
                            width: 500,
                        }}
                        disabled={(negociosNoPersonaMoral?.length ?? 0) === 0}
                        options={[
                            {
                                value: -1,
                                label: negociosNoPersonaMoral?.length > 0 ? "No asignar a ningun negocio" : "No hay negocios para asignar",
                            },
                            ...negociosNoPersonaMoral?.map(negocioNoPersonaMoral => ({
                                value: negocioNoPersonaMoral?.id,
                                label: negocioNoPersonaMoral?.nombre_del_negocio
                            })) ?? []
                        ]}
                    />
                </Form.Item>
                <Form.Item
                    name="razon_social"
                    label="Razón social"
                    rules={[
                        {
                            required: true,
                            message: "Este campo es requerido!",
                        },
                    ]}
                >
                    <Input style={{ textTransform: "uppercase" }} />
                </Form.Item>
                <Form.Item
                    name="regimen_fiscal"
                    label="Régimen fiscal"
                    rules={[
                        {
                            required: true,
                            message: "Este campo es requerido!",
                        },
                    ]}
                >
                    <Select
                        placeholder="Seleccione un régimen fiscal"
                        allowClear
                    >
                        {getRegimenFiscalSelectOptions()}
                    </Select>
                </Form.Item>
                <Form.Item
                    name="regimen_capital"
                    label="Régimen de capital"
                    rules={[
                        {
                            required: true,
                            message: "Este campo es requerido!",
                        },
                    ]}
                >
                    <Select
                        placeholder="Seleccione un régimen de capital"
                        allowClear
                    >
                        {getRegimenCapitalSelectOptions()}
                    </Select>
                </Form.Item>
                <Form.Item
                    name="rfc"
                    rules={[
                        {
                            required: true,
                            pattern: rfc_regex,
                            message: "Este campo es requerido!",
                        },
                    ]}
                    validations={[{ pattern: rfc_regex }]}
                >
                    <Input
                        placeholder="RFC"
                        style={{ textTransform: "uppercase" }}
                        maxLength={12}
                        minLength={12}
                    />
                </Form.Item>
                <Form.Item
                    name="acta_constitutiva"
                    label="Acta Constitutiva / Poder Notarial"
                    valuePropName="acta_constitutiva"
                    getValueFromEvent={normFile}
                    extra="Admite archivos PDF"
                    rules={[{ required: true }]}
                >
                    <Upload
                        onChange={(info) => uploadActaResult(info)}
                        name="acta_constitutiva"
                        action="/app/uploads/acta-constitutiva"
                        data={uploadHeaders}
                    >
                        <Button icon={<UploadOutlined />}>
                            Da click para cargar
                        </Button>
                    </Upload>
                </Form.Item>
                <div className="direcciones">
                    <Direccion
                        key={"direccion_persona_moral"}
                        setDireccion={(newDirData) => {
                            setAllDataToSave({
                                ...getAllDataToSave(),
                                direccion: newDirData,
                            });
                        }}
                        title="Dirección"
                        getDireccionData={getDireccionData}
                    />

                    <h3 style={{ margin: 15, marginBottom: 8 }}>
                        Dirección de notificación
                    </h3>
                    <Form.Item
                        name="direccion_noti_group"
                        rules={[{ required: true }]}
                    >
                        <Radio.Group>
                            <Radio value={"misma_direccion"}>
                                Usar la misma dirección ya ingresada
                            </Radio>
                            <Radio value="nueva_direccion">
                                + Agregar dirección
                            </Radio>
                        </Radio.Group>
                    </Form.Item>

                    {showNewDir && (
                        <Direccion
                            key={"direccion_persona_moral_notificacion"}
                            setDireccion={(newDirData) => {
                                setAllDataToSave({
                                    ...getAllDataToSave(),
                                    direccionNoti: newDirData,
                                });
                            }}
                            getDireccionData={getDireccionNotiData}
                        />
                    )}
                </div>
                <Form.Item>
                    <Space
                        direction={"horizontal"}
                        align={"end"}
                        style={{
                            justifyContent: "flex-end",
                            display: "flex",
                        }}
                    >
                        <Button
                            type="primary"
                            htmlType="submit"
                            key={"guardar"}
                        >
                            Guardar
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </>
    );
}
