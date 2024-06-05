import { useEffect, useState } from "react";
import { Button, Form, Input, message, Modal, Space } from "antd";
import { createLicenciaAlcoholesPDF } from "./licenciaAlcoholesPDFunctions";
import useGetEntidadRevisoraDirectorRolId from "../../../../utils/hooks/useGetEntidadRevisoraDirectorRolId";
import useGetDireccionDeNotificacion from "../../../../utils/hooks/useGetDireccionDeNotificacion";
import useSaveAndSignResolutivo from "../../../../utils/hooks/useSaveAndSignResolutivo";
import { jsonToFormData, licenciaFormRules } from "../../utils";
import {
    alcoholesFormFields,
    setAlcoholesFormDataFromNegocio,
    fillFormWithResolutivoDataAlcoholes,
} from "./utils_alcoholes";
import { clasificacionAlcoholes } from "../../clasificacionAlcoholes";
import useCheckAndGetResolutivoPorNegocioAndER from "../../../../utils/hooks/useCheckAndGetResolutivoPorNegocioAndER";

export default function LicenciaFuncionamientoAlcoholes({ tramite }) {
    const currentYearFilter = parseInt(localStorage?.currentYearFilter);
    const [direccionDeNotificacion, getDireccionDeNotificacion] =
        useGetDireccionDeNotificacion();
    const [entidadRevisoraComercioRolId, getEntidadRevisoraComercioRolId] =
        useGetEntidadRevisoraDirectorRolId();
    const [openModal, setOpenModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resolutivo, saveResolutivo] = useSaveAndSignResolutivo();
    const loggedUserRolId = parseInt(window?.user?.role_id ?? -1);
    const [form] = Form.useForm();
    const [formDataReady, setFormaDataReady] = useState(false);
    const [resolutivoGuardado, checkAndGetResolutivoPorNegocioAndER] =
        useCheckAndGetResolutivoPorNegocioAndER();

    useEffect(() => {
        if (resolutivoGuardado) {
            const resolutivoData = resolutivoGuardado?.detalles
                ? JSON.parse(resolutivoGuardado?.detalles)
                : null;
            if (resolutivoData !== null) {
                fillFormWithResolutivoDataAlcoholes(
                    form ?? null,
                    resolutivoData
                );
            }
        }
    }, [resolutivoGuardado]);

    useEffect(() => {
        if (direccionDeNotificacion === null) {
            getDireccionDeNotificacion(
                tramite?.licencia?.propietario?.direccion_de_notificacion_id
            );
        } else {
            setAlcoholesFormDataFromNegocio(
                {
                    ...tramite,
                    domicilio_notificaciones_propietario:
                        direccionDeNotificacion,
                },
                form,
                setFormaDataReady
            );
        }
    }, [direccionDeNotificacion]);

    useEffect(() => {
        if (resolutivo !== null && resolutivo !== undefined) {
            const values = JSON.parse(resolutivo.detalles);
            createLicenciaAlcoholesPDF(
                {
                    ...values,
                    id: resolutivo?.id ?? "",
                    folio: resolutivo?.folio ?? "",
                },
                false
            );
        }
    }, [resolutivo]);

    useEffect(() => {
        getEntidadRevisoraComercioRolId();
        checkAndGetResolutivoPorNegocioAndER(
            parseInt(window?.user?.entidad_revision ?? 0),
            tramite?.negocio_operador?.id,
            currentYearFilter
        );
    }, []);

    const generatePreview = async () => {
        setOpenModal(true);
        setLoading(true);
        const values = form.getFieldsValue(alcoholesFormFields);

        const valuesKeys = Object.keys(values);
        valuesKeys.forEach((valueKey) => {
            if (values[valueKey] === undefined || values[valueKey] === null) {
                values[valueKey] = "";
            }
        });
        await createLicenciaAlcoholesPDF(
            {
                ...values,
                alcohol_tipo: clasificacionAlcoholes.filter((clasificacion) => {
                    const licenciaTipo =
                        tramite?.negocio_operador?.licencia_alcohol?.licencia?.tipo?.toUpperCase();
                    const tipo = clasificacion?.tipos?.toLocaleUpperCase();
                    const _clasificacion =
                        clasificacion?.clasificacion?.toLocaleUpperCase();
                    return (
                        licenciaTipo === tipo || licenciaTipo === _clasificacion
                    );
                })?.[0],
            },
            true
        ).catch((error) => {
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
            negocio_id: tramite?.negocio_operador?.id ?? 0,
            entidad_revisora_id: parseInt(window?.user?.entidad_revision ?? 0),
            tramite_id: tramite?.resolutivo_tramite_id,
            alcohol_tipo: clasificacionAlcoholes.filter((clasificacion) => {
                const licenciaTipo =
                    tramite?.negocio_operador?.licencia_alcohol?.licencia?.tipo?.toUpperCase();
                const tipo = clasificacion?.tipos?.toLocaleUpperCase();
                const _clasificacion =
                    clasificacion?.clasificacion?.toLocaleUpperCase();
                return licenciaTipo === tipo || licenciaTipo === _clasificacion;
            })?.[0],
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

    return (
        <>
            {formDataReady === true ? (
                <Form
                    name="LICENCIA DE ALCOHOL"
                    onFinish={onFormComplete}
                    autoComplete="off"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    labelAlign="left"
                    form={form}
                >
                    <h5>Datos Propietario</h5>
                    <Form.Item
                        label="Nombre:"
                        name="nombre_propietario"
                        rules={licenciaFormRules}
                    >
                        <Input
                            disabled={
                                !!form.getFieldValue("nombre_propietario")
                            }
                        />
                    </Form.Item>
                    <Form.Item
                        label="CURP:"
                        name="curp_propietario"
                        rules={licenciaFormRules}
                    >
                        <Input
                            disabled={!!form.getFieldValue("curp_propietario")}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Registro federal de contribuyente:"
                        name="rfc_propietario"
                        rules={licenciaFormRules}
                    >
                        <Input
                            disabled={!!form.getFieldValue("rfc_propietario")}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Registro federal persona moral:"
                        name="registro_federal_pm_propietario"
                        rules={licenciaFormRules}
                    >
                        <Input
                            disabled={
                                !!form.getFieldValue(
                                    "registro_federal_pm_propietario"
                                )
                            }
                        />
                    </Form.Item>
                    <Form.Item
                        label="Teléfono:"
                        name="telefono_propietario"
                    //rules={licenciaFormRules}
                    >
                        <Input
                            disabled={
                                !!form.getFieldValue("telefono_propietario")
                            }
                        />
                    </Form.Item>
                    <Form.Item
                        label="Antecedentes:"
                        name="antecedentes"
                        rules={licenciaFormRules}
                    >
                        <Input
                            style={{ textTransform: "uppercase" }}
                            disabled={!!form.getFieldValue("antecedentes")}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Domicilio para oír y recibir notificaciones:"
                        name="domicilio_notificaciones_propietario"
                        rules={licenciaFormRules}
                    >
                        <Input
                            style={{ textTransform: "uppercase" }}
                            disabled={
                                !!form.getFieldValue(
                                    "domicilio_notificaciones_propietario"
                                )
                            }
                        />
                    </Form.Item>
                    <Form.Item
                        label="Email:"
                        name="email_propietario"
                        rules={licenciaFormRules}
                    >
                        <Input
                            disabled={!!form.getFieldValue("email_propietario")}
                        />
                    </Form.Item>
                    {/* <h5>Datos Propietario</h5> */}
                    <Form.Item
                        label="Licencia no.:"
                        name="no_licencia_2"
                        rules={licenciaFormRules}
                    >
                        <Input
                            disabled={!!form.getFieldValue("no_licencia_2")}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Tipo:"
                        name="tipo"
                        rules={licenciaFormRules}
                    >
                        <Input disabled={!!form.getFieldValue("tipo")} />
                    </Form.Item>
                    {/* <Form.Item
                        label="Horario normal utilizado para trabajar:"
                        name="horario_normal"
                        rules={licenciaFormRules}
                    >
                        <Input
                            disabled={!!form.getFieldValue("horario_normal")}
                        />
                    </Form.Item> */}
                    <h5>Datos del Operador</h5>
                    <Form.Item
                        label="Nombre comercial del establecimiento:"
                        name="nombre_comercial_operador"
                        rules={licenciaFormRules}
                    >
                        <Input
                            disabled={
                                !!form.getFieldValue(
                                    "nombre_comercial_operador"
                                )
                            }
                        />
                    </Form.Item>
                    <Form.Item
                        label="Domicilio:"
                        name="direccion_operador"
                        rules={licenciaFormRules}
                    >
                        <Input
                            disabled={
                                !!form.getFieldValue("direccion_operador")
                            }
                        />
                    </Form.Item>
                    <Form.Item
                        label="No. licencia de funcionamiento:"
                        name="no_licencia_operador"
                        rules={licenciaFormRules}
                    >
                        <Input
                            disabled={
                                !!form.getFieldValue("no_licencia_operador")
                            }
                        />
                    </Form.Item>
                    <Form.Item
                        label="Clave de registro municipal:"
                        name="clave_registro_municipal_operador"
                        rules={licenciaFormRules}
                    >
                        <Input
                            disabled={
                                !!form.getFieldValue(
                                    "clave_registro_municipal_operador"
                                )
                            }
                        />
                    </Form.Item>
                    {/* <h5>Datos del Operador</h5> */}

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
                title={`Vista previa del resolutivo `}
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
