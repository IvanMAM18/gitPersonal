import { useEffect, useState } from "react";
import { Button, Checkbox, Form, Input, message, Modal, Space } from "antd";
import {
    createLicenciaFuncionamientoPDF,
    createPreviewLicenciaFuncionamientoPDF,
} from "./licenciaFuncionamientoPDF_Functions";
import useGetEntidadRevisoraComercioDirectorRolId from "../../../utils/hooks/useGetEntidadRevisoraComercioDirectorRolId";
import useGetDireccionDeNotificacion from "../../../utils/hooks/useGetDireccionDeNotificacion";
import useSaveAndSignResolutivo from "../../../utils/hooks/useSaveAndSignResolutivo";
import moment from "moment";
import {
    setPredioInfoToFormLicenciaFuncionamiento,
    licenciaDeFuncionamientoFormFields,
    jsonToFormData,
    setLicenciaDeFuncionamientoFormDataFromNegocio,
    licenciaFormRules,
    getTramiteAlcoholPagado,
} from "../utils";

const zona = {
    federal: "ZONA FEDERAL",
    ejidal: "ZONA EJIDAL",
};

export default function LicenciaFuncionamiento({ negocio_data }) {
    const [direccionDeNotificacion, getDireccionDeNotificacion] =
        useGetDireccionDeNotificacion();
    const [entidadRevisoraComercioRolId, getEntidadRevisoraComercioRolId] =
        useGetEntidadRevisoraComercioDirectorRolId();
    const [openModal, setOpenModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resolutivo, saveResolutivo] = useSaveAndSignResolutivo();
    const [predioInfo, setPredioInfo] = useState(false);
    const loggedUserRolId = parseInt(window?.user?.role_id ?? -1);
    const [form] = Form.useForm();

    useEffect(() => {
        if (direccionDeNotificacion === null) {
            getDireccionDeNotificacion(negocio_data?.id ?? 0);
        } else {
            form.setFieldsValue({
                domicilio_notificaciones: direccionDeNotificacion,
            });
        }
    }, [direccionDeNotificacion]);

    useEffect(() => {
        if (resolutivo !== null && resolutivo !== undefined) {
            const values = JSON.parse(resolutivo.detalles);
            createLicenciaFuncionamientoPDF({
                ...values,
                clave_catastral:
                    values.clave_catastral ||
                    zona[negocio_data.tipo_predio_propiedad],
                id: resolutivo?.id ?? "",
                folio: resolutivo?.folio ?? "",
                girosObjArray: negocio_data?.giro_comercial ?? [],
                venta_alcohol: negocio_data?.venta_alcohol,
                fecha_expedicion: moment(values?.fecha_expedicion).format(
                    "dddd, MMMM Do YYYY"
                ),
                tramite_alcohol_pagado: getTramiteAlcoholPagado(negocio_data),
                year_creacion_tramite: new Date(negocio_data?.fecha_creacion_tramite).getFullYear()
            });
        }
    }, [resolutivo]);

    useEffect(() => {
        getEntidadRevisoraComercioRolId();
    }, []);

    useEffect(() => {
        if (predioInfo === false) {
            setPredioInfoToFormLicenciaFuncionamiento(
                form,
                negocio_data,
                setPredioInfo
            );
        }
    }, [predioInfo]);

    useEffect(() => {
        if ((form ?? false) !== false) {
            setLicenciaDeFuncionamientoFormDataFromNegocio(negocio_data, form);
        }
    }, [negocio_data]);

    const generatePreview = async () => {
        setOpenModal(true);
        setLoading(true);
        const values = form.getFieldsValue(licenciaDeFuncionamientoFormFields);
        const valuesKeys = Object.keys(values);
        valuesKeys.forEach((valueKey) => {
            if (values[valueKey] === undefined || values[valueKey] === null) {
                values[valueKey] = "";
            }
        });
        const dataParaPdf = {
            ...values,
            clave_catastral:
                values.clave_catastral ||
                zona[negocio_data.tipo_predio_propiedad],
            girosObjArray: negocio_data?.giro_comercial ?? [],
            venta_alcohol: negocio_data?.venta_alcohol,
            tramite_alcohol_pagado: getTramiteAlcoholPagado(negocio_data),
            clave_alcohol: negocio_data?.licencia_alcohol?.licencia?.clave ?? "",
            year_creacion_tramite: new Date(negocio_data?.fecha_creacion_tramite).getFullYear()
        }
        console.log(dataParaPdf)
        await createPreviewLicenciaFuncionamientoPDF(dataParaPdf).catch((error) => {
            console.log({ error });
            setOpenModal(false);
            message.error(
                "Hubo un problema al generar el preview del documento"
            );
        });
        setLoading(false);
    };

    const onFormComplete = (values) => {
        values = {
            ...values,
            negocio_id: negocio_data?.id ?? 0,
            entidad_revisora_id: parseInt(window?.user?.entidad_revision ?? 0),
            venta_alcohol: negocio_data?.venta_alcohol,
            tramite_id: negocio_data?.resolutivo_tramite_id,
            clave_alcohol: negocio_data?.licencia_alcohol?.licencia?.clave ?? "",
            tramite_alcohol_pagado: getTramiteAlcoholPagado(negocio_data),
            year_creacion_tramite: new Date(negocio_data?.fecha_creacion_tramite).getFullYear()
        };

        const valuesData = jsonToFormData(values);

        valuesData.append("formDataAsString", JSON.stringify(values));
        saveResolutivo(
            valuesData,
            "/app/save_resolutivo_licencia_funcionamiento",
            loggedUserRolId === entidadRevisoraComercioRolId,
            setLoading
        );
    };

    const onFormCompleteFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
    };

    const predioEjidalFederal = (tipo_predio) =>
        tipo_predio === "ejidal" || tipo_predio === "federal";

    return (
        <>
            {predioInfo ? (
                <Form
                    name="LICENCIA DE FUNCIONAMIENTO PARA GIROS ESTABLECIDOS COMERCIALES, INDUSTRIALES Y DE SERVICIOS"
                    onFinish={onFormComplete}
                    onFinishFailed={onFormCompleteFailed}
                    autoComplete="off"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    labelAlign="left"
                    form={form}
                >
                    <Form.Item
                        label="Nombre:"
                        name="nombre"
                        rules={licenciaFormRules}
                    >
                        <Input disabled={!!form.getFieldValue("nombre")} />
                    </Form.Item>

                    <Form.Item
                        label="Razón social:"
                        name="razon_social"
                        rules={licenciaFormRules}
                    >
                        <Input
                            disabled={!!form.getFieldValue("razon_social")}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Regimen de capital:"
                        name="regimen_capital"
                        rules={licenciaFormRules}
                    >
                        <Input
                            disabled={!!form.getFieldValue("regimen_capital")}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Giros:"
                        name="giros"
                        rules={licenciaFormRules}
                    >
                        <Input disabled={!!form.getFieldValue("giros")} />
                    </Form.Item>
                    <Form.Item
                        label="Fecha inicio de operaciones:"
                        name="fecha_inicio_operaciones"
                        rules={licenciaFormRules}
                    >
                        <Input
                            disabled={
                                !!form.getFieldValue("fecha_inicio_operaciones")
                            }
                        />
                    </Form.Item>
                    <Form.Item
                        label="Domicilio para oír y recibir notificaciones:"
                        name="domicilio_notificaciones"
                        rules={licenciaFormRules}
                    >
                        <Input
                            disabled={
                                !!form.getFieldValue("domicilio_notificaciones")
                            }
                        />
                    </Form.Item>
                    <Form.Item
                        label="Organismo al que pertenece:"
                        name="organismo"
                        rules={licenciaFormRules}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Teléfono:"
                        name="telefono"
                        rules={licenciaFormRules}
                    >
                        <Input disabled={!!form.getFieldValue("telefono")} />
                    </Form.Item>
                    <Form.Item
                        label="Email:"
                        name="email"
                        rules={licenciaFormRules}
                    >
                        <Input disabled={!!form.getFieldValue("email")} />
                    </Form.Item>
                    <Form.Item
                        label="Nombre comercial del establecimiento:"
                        name="nombre_comercial"
                        rules={[
                            {
                                required: true,
                                message:
                                    "Ingrese el nombre comercial del establecimiento!",
                            },
                        ]}
                    >
                        <Input
                            disabled={!!form.getFieldValue("nombre_comercial")}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Clave de registro municipal:"
                        name="clave_registro_municipal"
                        rules={licenciaFormRules}
                    >
                        <Input
                            disabled={
                                !!form.getFieldValue("clave_registro_municipal")
                            }
                        />
                    </Form.Item>
                    <Form.Item
                        label="Dirección:"
                        name="direccion"
                        rules={licenciaFormRules}
                    >
                        <Input disabled={!!form.getFieldValue("direccion")} />
                    </Form.Item>

                    <Form.Item
                        label="Registro federal de contribuyente:"
                        name="registro_federal_contribuyente"
                        rules={licenciaFormRules}
                    >
                        <Input
                            disabled={
                                !!form.getFieldValue(
                                    "registro_federal_contribuyente"
                                )
                            }
                        />
                    </Form.Item>
                    <Form.Item
                        label="Registro federal persona moral:"
                        name="registro_federal_pm"
                        rules={licenciaFormRules}
                    >
                        <Input
                            disabled={
                                !!form.getFieldValue("registro_federal_pm")
                            }
                        />
                    </Form.Item>
                    <Form.Item
                        label="Horario normal utilizado para trabajar:"
                        name="horario_normal"
                        rules={licenciaFormRules}
                    >
                        <Input
                            disabled={!!form.getFieldValue("horario_normal")}
                        />
                    </Form.Item>
                    <Form.Item
                        label="CURP:"
                        name="curp"
                        rules={licenciaFormRules}
                    >
                        <Input disabled={!!form.getFieldValue("curp")} />
                    </Form.Item>
                    <Form.Item
                        label="Tipo de predio:"
                        name="tipo_predio"
                        rules={licenciaFormRules}
                    >
                        <Input disabled={!!form.getFieldValue("tipo_predio")} />
                    </Form.Item>
                    <Form.Item
                        label="Clave catastral:"
                        name="clave_catastral"
                        rules={
                            predioEjidalFederal(
                                negocio_data.tipo_predio_propiedad
                            )
                                ? []
                                : licenciaFormRules
                        }
                    >
                        <Input
                            disabled={
                                (negocio_data.persona.curp !== null &&
                                    negocio_data.persona.curp !== undefined &&
                                    negocio_data.persona.curp !== "") ||
                                negocio_data.tipo_predio_propiedad ===
                                "federal" ||
                                negocio_data.tipo_predio_propiedad === "ejidal"
                            }
                        />
                    </Form.Item>
                    <Form.Item
                        label="Venta alcohol?:"
                        name="venta_alcohol"
                        rules={licenciaFormRules}
                    >
                        <Checkbox
                            disabled={true}
                            checked={negocio_data.venta_alcohol ?? false}
                        />
                    </Form.Item>
                    <Form.Item
                        style={{ paddingTop: 15, textAlign: "right" }}
                        wrapperCol={{
                            offset: 11,
                            span: 13,
                        }}
                    >
                        <Space>
                            <Button
                                type="default"
                                htmlType="button"
                                onClick={generatePreview}
                                loading={loading}
                            >
                                Ver Preview
                            </Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={loading}
                            >
                                {`${loggedUserRolId ===
                                    entidadRevisoraComercioRolId
                                    ? " Guardar y Descagar resolutivo"
                                    : "Guardar resolutivo"
                                    }`}
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            ) : (
                <h4 style={{ textAlign: "center", padding: 15 }}>
                    Cargando información...
                </h4>
            )}
            <Modal
                width={"80%"}
                title={`Vista previa del resolutivo para ${negocio_data?.nombre_del_negocio ?? ""
                    }`}
                open={openModal}
                footer={
                    <Button onClick={() => setOpenModal(false)}>Cerrar</Button>
                }
                onCancel={() => setOpenModal(false)}
            >
                <div id="pdf-preview" style={{ height: "90%" }}></div>
            </Modal>
        </>
    );
}
