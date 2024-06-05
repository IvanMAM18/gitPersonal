import React, { useEffect, useState } from "react";
import {
    Button,
    Form,
    Input,
    DatePicker,
    Modal,
    Select,
    Space,
    InputNumber,
} from "antd";
import useGetEntidadRevisoraDirectorRolId from "../../../../utils/hooks/useGetEntidadRevisoraDirectorRolId";
import useCheckAndGetResolutivoPorNegocioERAndObs from "../../../../utils/hooks/useCheckAndGetResolutivoPorNegocioERAndObs";
import useSaveAndSignResolutivo from "../../../../utils/hooks/useSaveAndSignResolutivo";
import {
    fillFormWithResolutivoDataConstanciaInhabilitacion,
    fillFormFromNegocioForConstanciaInhabilitacion,
    jsonToFormData,
} from "./utils";
import {
    constanciaInhabilitacionFields,
    tiposIdentificacion,
    indentificadores,
    entidadesExpiden,
} from "./constants";
import { createConstanciaInhabilitacionPdf } from "./pdfUtils";
import locale from "antd/es/date-picker/locale/es_ES";
import moment from "moment";

const { Option } = Select;

export default function ConstanciaNoSujecion({ tramite }) {
    const loggedUserRolId = window?.user?.role_id ?? null;
    const [showModal, setShowModal] = useState(false);
    const [resolutivoGuardadoYFirmado, saveAndSignResolutivo] =
        useSaveAndSignResolutivo();
    const [entidadRevisoraDirectorRolId, getEntidadRevisoraDirectorRolId] =
        useGetEntidadRevisoraDirectorRolId();
    const [resolutivoGuardado, checkAndGetResolutivoPorNegocioERAndObs] =
        useCheckAndGetResolutivoPorNegocioERAndObs();
    const [form] = Form.useForm();

    useEffect(() => {
        getEntidadRevisoraDirectorRolId();
        checkAndGetResolutivoPorNegocioERAndObs(
            parseInt(window?.user?.entidad_revision ?? 0),
            tramite?.resolutivo_tramite_id,
            "ConstanciaNoSujecion",
            parseInt(localStorage?.currentYearFilter)
        );
        fillFormFromNegocioForConstanciaInhabilitacion(form ?? null, tramite);
    }, []);

    useEffect(() => {
        if (resolutivoGuardado) {
            const resolutivoData = resolutivoGuardado?.detalles
                ? JSON.parse(resolutivoGuardado?.detalles)
                : null;

            fillFormWithResolutivoDataConstanciaInhabilitacion(
                form,
                resolutivoData
            );
        }
    }, [resolutivoGuardado]);

    useEffect(() => {
        if (resolutivoGuardadoYFirmado !== null) {
            const values = form.getFieldsValue(constanciaInhabilitacionFields);
            crearResolutivoPDF(resolutivoGuardadoYFirmado, values);
        }
    }, [resolutivoGuardadoYFirmado]);

    const onFormComplete = (values) => {
        const valuesData = jsonToFormData({
            ...values,
            fecha: values?.fecha?.format("dddd, MMMM Do YYYY"),
            tramite_id: tramite?.id ?? 0,
            entidad_revisora_id: parseInt(window?.user?.entidad_revision ?? 0),
            firmar:
                parseInt(loggedUserRolId) === entidadRevisoraDirectorRolId
                    ? 1
                    : 0,
            tramite_id: tramite?.resolutivo_tramite_id,
            observaciones: "ConstanciaNoSujecion",
        });
        valuesData.append("formDataAsString", JSON.stringify({
            ...values,
            year: currentYearFilter
        }));
        saveAndSignResolutivo(
            valuesData,
            "/app/save_resolutivos_contraloria",
            parseInt(loggedUserRolId) === entidadRevisoraDirectorRolId,
            currentYearFilter
        );
    };

    const crearResolutivoPDF = (_resolutivo, formValues) => {
        const detalles = _resolutivo?.detalles
            ? JSON.parse(_resolutivo?.detalles)
            : null;
        if (detalles !== null) {
            //llamar funcion para generar pdf
            createConstanciaInhabilitacionPdf(
                {
                    ...formValues,
                    ...detalles,
                    fecha: formValues?.fecha ?? "",
                    folio: _resolutivo?.folio ?? "NA",
                },
                false,
                "Constancia-NSPA"
            );
        }
    };

    const generarPreview = () => {
        const values = form.getFieldsValue(constanciaInhabilitacionFields);
        createConstanciaInhabilitacionPdf(
            {
                ...values,
                fecha: values?.fecha ?? "",
            },
            true,
            "Constancia-NSPA"
        );
        setShowModal(true);
    };

    return (
        <Form
            name="CONSTANCIA DE NO SUJECIÓN A PROCEDIMIENTO ADMINISTRATIVO"
            onFinish={onFormComplete}
            autoComplete="off"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            labelAlign="left"
            form={form}
            initialValues={{ fecha: moment(), año_fiscal: moment(), dias_vigencia: 10 }}
        >
            <Form.Item
                label="Nombre de la persona:"
                name="solicitante"
                rules={[
                    {
                        required: true,
                        message: "Campo requerido!",
                    },
                ]}
            >
                <Input
                    style={{ textTransform: "uppercase" }}
                    disabled={!!form.getFieldValue("solicitante")}
                />
            </Form.Item>
            <Form.Item
                label="CURP:"
                name="curp"
                rules={[
                    {
                        required: true,
                        message: "Campo requerido!",
                    },
                ]}
            >
                <Input
                    style={{ textTransform: "uppercase" }}
                    disabled={!!form.getFieldValue("curp")}
                />
            </Form.Item>
            <Form.Item
                tooltip="Identificación que presenta "
                label="Tipo de identificación:"
                name="identificacion"
                rules={[
                    {
                        required: true,
                        message: "Ingrese el tipo de identificación!",
                    },
                ]}
            >
                <Select
                    placeholder="Tipo de identificación"
                    optionFilterProp="children"
                >
                    {tiposIdentificacion?.map((item, optionIndex) => (
                        <Option key={"index" + optionIndex} value={item.id}>
                            {item.name}
                        </Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item
                tooltip="Nombre del Identificador"
                label="Identificador:"
                name="identificador"
                rules={[
                    {
                        required: true,
                        message: "Ingrese el identificador!",
                    },
                ]}
            >
                <Select
                    placeholder="Nombre del Identificador"
                    optionFilterProp="children"
                >
                    {indentificadores?.map((item, optionIndex) => (
                        <Option key={"index" + optionIndex} value={item.id}>
                            {item.name}
                        </Option>
                    ))}
                </Select>
            </Form.Item>
            <Form.Item
                tooltip="Folio único de la identificación"
                label="Num. de identificaión:"
                name="num_identifiacion"
                rules={[
                    {
                        required: true,
                        message: "Campo requerido!",
                    },
                ]}
            >
                <Input
                    style={{ textTransform: "uppercase" }}
                    maxLength={18}
                    minLength={8}
                //disabled={!!form.getFieldValue("curp")}
                />
            </Form.Item>
            <Form.Item
                tooltip="Entidades"
                label="Entidad que expide:"
                name="entidad_expide"
                rules={[
                    {
                        required: true,
                        message: "Ingrese la entidad que expide!",
                    },
                ]}
            >
                <Select
                    placeholder="Entidad que expide"
                    optionFilterProp="children"
                >
                    {entidadesExpiden?.map((item, optionIndex) => (
                        <Option key={"index" + optionIndex} value={item.id}>
                            {item.name}
                        </Option>
                    ))}
                </Select>
            </Form.Item>
            <Form.Item
                label="Fecha:"
                name="fecha"
                rules={[{ required: true, message: "Ingrese la fecha!" }]}
            >
                <DatePicker
                    locale={locale}
                    disabledDate={(current) => {
                        if (current && current < moment().endOf("day")) {
                            return true;
                        } else {
                            if (current.day() !== 0 && current.day() !== 1) {
                                return false;
                            } else {
                                return true;
                            }
                        }
                    }}
                    disabled
                />
            </Form.Item>
            <Form.Item
                tooltip="Vigencia de la constancia"
                label="Días de vigencia:"
                name="dias_vigencia"
                rules={[
                    {
                        required: true,
                        message: "Campo requerido!",
                    },
                ]}
            >
                <InputNumber
                    min={1}
                    max={15}
                    style={{ textTransform: "uppercase" }}
                    disabled={true}
                //disabled={!!form.getFieldValue("dias_vigencia")}
                />
            </Form.Item>
            <Form.Item
                wrapperCol={{
                    offset: 14,
                    span: 10,
                }}
            >
                <Space>
                    <Button
                        type="default"
                        htmlType="button"
                        onClick={() => generarPreview()}
                    >
                        Ver Preview
                    </Button>
                    <Button type="primary" htmlType="submit">
                        {`${parseInt(loggedUserRolId) ===
                            entidadRevisoraDirectorRolId
                            ? "Generar resolutivo"
                            : "Guardar resolutivo"
                            }`}
                    </Button>
                </Space>
            </Form.Item>
            <Form.Item>
                <Modal
                    width={"80%"}
                    title={`Vista previa del resolutivo para ${tramite?.nombre_del_tramite ?? ""
                        }`}
                    open={showModal}
                    footer={
                        <Button onClick={() => setShowModal(false)}>
                            Cerrar
                        </Button>
                    }
                    onCancel={() => setShowModal(false)}
                >
                    <div id="pdf-preview-ci" style={{ height: "90%" }}></div>
                </Modal>
            </Form.Item>
        </Form>
    );
}
