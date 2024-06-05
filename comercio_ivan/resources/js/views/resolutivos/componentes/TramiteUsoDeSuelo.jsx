import { useEffect, useState } from "react";
import {
    Form,
    Button,
    Input,
    Upload,
    message,
    Radio,
    Space,
    Modal,
} from "antd";
import {
    createTramiteUsoDeSueloPDF,
    createPreviewTramiteUsoDeSueloPDF,
} from "./funciones_resolutivos";
import useGetEntidadRevisoraDirectorRolId from "../../../utils/hooks/useGetEntidadRevisoraDirectorRolId";
import useSaveResolutivo from "../../../utils/hooks/useSaveResolutivo";
import {
    getDescripcionUbicacion,
    usoDeSueloFormFields,
    getPredioInfo,
    fillFormWithNegocioData,
    getRules,
    getFileObject,
} from "../utils";
import DraggerBody from "./DraggerBody";
import useGetResolutivoImage from "../../../utils/hooks/useGetResolutivoImage";
import { useParams } from "react-router-dom";
import useCheckAndGetResolutivoPorNegocioAndER from "../../../utils/hooks/useCheckAndGetResolutivoPorNegocioAndER";
import useFirmarResolutivo from "../../../utils/hooks/useFirmarResolutivo";

let error_uids = [];
let error_uids_messages = [];

let error_uids2 = [];
let error_uids_messages2 = [];

const props = {
    accept: "image/png, image/jpeg",
    name: "plano_macrolocalizacion",
    action: "",
    multiple: false,
    className: "dragger-container-custom",
    maxCount: 1,
    onRemove: (file) => {
        error_uids_messages = error_uids_messages.filter(
            (uidObject) => file.uid !== Object.keys(uidObject)[0]
        );
        error_uids = error_uids.filter((uidString) => file.uid !== uidString);
    },
    beforeUpload: (file, fileList) => {
        const _URL = window.URL || window.webkitURL;
        const img = new Image();
        img.src = _URL.createObjectURL(file);
        const isLt2mb = file.size / 1024 / 1024 < 2;
        if (!isLt2mb) {
            error_uids.push(file?.uid);
            error_uids_messages.push({
                [file?.uid]: "La imagen debe pesar menos de 2mb!",
            });
            return Upload.LIST_IGNORE;
        }
    },
};
const props_intensidad = {
    accept: "image/png, image/jpeg",
    name: "plano_macrolocalizacion",
    action: "",
    multiple: false,
    className: "dragger-container-custom",
    maxCount: 1,
    onRemove: (file) => {
        error_uids_messages2 = error_uids_messages2.filter(
            (uidObject) => file.uid !== Object.keys(uidObject)[0]
        );
        error_uids2 = error_uids2.filter((uidString) => file.uid !== uidString);
    },
    beforeUpload: (file, fileList) => {
        error_uids2 = [];
        error_uids_messages2 = [];
        const _URL = window.URL || window.webkitURL;
        const img = new Image();
        img.src = _URL.createObjectURL(file);
        /*img.onload = function () {
            if (img.width / img.height !== 2) {
                error_uids2.push(file?.uid);
                error_uids_messages2.push({
                    [file?.uid]:
                        "La imagen debe tener el doble de ancho que de alto!",
                });

                message.error(
                    "La imagen debe tener el mismo de ancho que de alto!"
                );
            }
        };*/
        const isLt2mb = file.size / 1024 / 1024 < 2;
        if (!isLt2mb) {
            error_uids2.push(file?.uid);
            error_uids_messages2.push({
                [file?.uid]: "La imagen debe pesar menos de 2mb!",
            });
            return Upload.LIST_IGNORE;
        }
    },
};

export default function TramiteUsoDeSuelo({ negocio_data }) {

    const currentYearFilter = parseInt(localStorage?.currentYearFilter);
    const { negocioId } = useParams();
    const [resolutivoFirmado, firmarResolutivo] = useFirmarResolutivo();
    const [entidadRevisoraDirectorRolId, getEntidadRevisoraDirectorRolId] = useGetEntidadRevisoraDirectorRolId();
    const [resolutivosGuardado, checkAndGetResolutivoPorNegocioAndER] = useCheckAndGetResolutivoPorNegocioAndER();
    const [savedResolutivo, saveResolutivo] = useSaveResolutivo();
    const [image, getResolutivoImage] = useGetResolutivoImage();
    const [image1, getResolutivoImage1] = useGetResolutivoImage();
    const [image2, getResolutivoImage2] = useGetResolutivoImage();
    const [image3, getResolutivoImage3] = useGetResolutivoImage();
    const loggedUserRolId = parseInt(window?.user?.role_id ?? 0);
    const [form] = Form.useForm();
    const [predioInfo, setPredioInfo] = useState(false);
    const [otros, setOtros] = useState(false);
    const [loading, setLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [_resolutivo, setResolutivo] = useState();

    useEffect(() => {
        checkAndGetResolutivoPorNegocioAndER(
            parseInt(window?.user?.entidad_revision ?? 0),
            parseInt(negocioId), currentYearFilter,
            currentYearFilter
        );
        getEntidadRevisoraDirectorRolId();
    }, []);

    useEffect(() => {
        if (resolutivosGuardado !== null) {
            const resolutivoData = JSON.parse(
                resolutivosGuardado?.detalles ?? ""
            );
            delete resolutivoData.compatibilidad;
            delete resolutivoData.intensidad_uso_suelo;
            delete resolutivoData.plano_macrolocalizacion;
            form.setFieldsValue(resolutivoData);
        }
    }, [resolutivosGuardado]);

    const setImageToState = (image) => {
        if (
            (resolutivoFirmado !== null || resolutivosGuardado !== null) &&
            image !== null
        ) {
            const resolutivoData = JSON.parse(
                resolutivoFirmado?.detalles
                    ? resolutivoFirmado?.detalles
                    : resolutivosGuardado?.detalles
            );
            delete resolutivoData.compatibilidad;
            delete resolutivoData.intensidad_uso_suelo;
            delete resolutivoData.plano_macrolocalizacion;
            setResolutivo({
                ...resolutivoData,
                ..._resolutivo,
                [image.field]: image,
            });
        }
    };

    useEffect(() => {
        if (
            loggedUserRolId === entidadRevisoraDirectorRolId &&
            (resolutivoFirmado?.folio !== "" ||
                resolutivosGuardado?.folio !== "") &&
            (_resolutivo?.[image1?.field] ?? false) &&
            (_resolutivo?.[image2?.field] ?? false) &&
            (_resolutivo?.[image3?.field] ?? false)
        ) {
            descargarResolutivo({
                ..._resolutivo,
                folio:
                    resolutivoFirmado?.folio !== "" &&
                        resolutivoFirmado?.folio !== null &&
                        resolutivoFirmado?.folio !== undefined
                        ? resolutivoFirmado?.folio
                        : resolutivosGuardado?.folio,
            });
        }
    }, [_resolutivo, image1, image2, image3]);

    useEffect(() => {
        setImageToState(image1);
    }, [image1]);
    useEffect(() => {
        setImageToState(image2);
    }, [image2]);
    useEffect(() => {
        setImageToState(image3);
    }, [image3]);

    useEffect(() => {
        if (savedResolutivo !== null && image !== null) {
            const resolutivoData = JSON.parse(savedResolutivo?.detalles ?? "");
            setResolutivo({
                ...resolutivoData,
                ..._resolutivo,
                [image.field]: image,
            });
            if (
                loggedUserRolId === entidadRevisoraDirectorRolId &&
                image.field === "plano_macrolocalizacion"
            ) {
                descargarResolutivo({
                    ..._resolutivo,
                    folio: savedResolutivo?.folio,
                });
            }
        }
    }, [image]);

    useEffect(() => {
        if (savedResolutivo !== null) {
            message.success("Resolutivo guardado con éxito");
            if (
                (savedResolutivo?.folio ?? "") !== "" &&
                loggedUserRolId === entidadRevisoraDirectorRolId
            ) {
                const resolutivoData = JSON.parse(
                    savedResolutivo?.detalles ?? ""
                );

                const compatibilidad_url = resolutivoData?.compatibilidad ?? "";
                const intensidad_uso_suelo_url =
                    resolutivoData?.intensidad_uso_suelo ?? "";
                const plano_macrolocalizacion_url =
                    resolutivoData?.plano_macrolocalizacion ?? "";
                if (compatibilidad_url !== "")
                    getResolutivoImage({
                        url: compatibilidad_url,
                        field: "compatibilidad",
                    });
                if (intensidad_uso_suelo_url !== "")
                    getResolutivoImage({
                        url: intensidad_uso_suelo_url,
                        field: "intensidad_uso_suelo",
                    });
                if (plano_macrolocalizacion_url !== "")
                    getResolutivoImage({
                        url: plano_macrolocalizacion_url,
                        field: "plano_macrolocalizacion",
                    });
            }
            if (
                savedResolutivo?.folio === "" &&
                loggedUserRolId === entidadRevisoraDirectorRolId
            ) {
                _firmarResolutivo();
            }
        }
    }, [savedResolutivo]);

    useEffect(() => {
        if (resolutivoFirmado !== null) {
            const resolutivoData = JSON.parse(
                resolutivoFirmado?.detalles ?? ""
            );
            const compatibilidad_url = resolutivoData?.compatibilidad ?? "";
            const intensidad_uso_suelo_url =
                resolutivoData?.intensidad_uso_suelo ?? "";
            const plano_macrolocalizacion_url =
                resolutivoData?.plano_macrolocalizacion ?? "";

            if (compatibilidad_url !== "")
                getResolutivoImage1({
                    url: compatibilidad_url,
                    field: "compatibilidad",
                });
            if (intensidad_uso_suelo_url !== "")
                getResolutivoImage2({
                    url: intensidad_uso_suelo_url,
                    field: "intensidad_uso_suelo",
                });
            if (plano_macrolocalizacion_url !== "")
                getResolutivoImage3({
                    url: plano_macrolocalizacion_url,
                    field: "plano_macrolocalizacion",
                });
        }
    }, [resolutivoFirmado]);

    useEffect(() => {
        if (predioInfo === false) {
            getPredioInfo(form, negocio_data, setPredioInfo);
        }
        if ((negocio_data ?? false) !== false && (form ?? false) !== false) {
            fillFormWithNegocioData(form, negocio_data);
        }
    }, [predioInfo, negocio_data]);

    const generatePreview = async (savedResolutivo = null) => {
        const resolutivoDetalles = JSON.parse(
            resolutivosGuardado?.detalles ?? "{}"
        );

        setLoading(true);
        const values =
            resolutivosGuardado !== null
                ? resolutivoDetalles
                : form.getFieldsValue(usoDeSueloFormFields);
        const valuesKeys = Object.keys(values);
        valuesKeys.forEach((valueKey) => {
            if (values[valueKey] === undefined || values[valueKey] === null) {
                switch (valueKey) {
                    case "plano_macrolocalizacion":
                    case "compatibilidad":
                    case "intensidad_uso_suelo":
                        values[valueKey] = [];
                        break;

                    default:
                        values[valueKey] = "";
                        break;
                }
            }
        });
        await createPreviewTramiteUsoDeSueloPDF({
            ...values,
            ubicacion_predio: getDescripcionUbicacion(
                form.getFieldValue("clave_plano"),
                form.getFieldValue("ubicacion_predio")
            ),
        })
            .then(() => {
                error_uids = [];
                error_uids2 = [];

                setOpenModal(true);
            })
            .catch((error) => {
                console.log({ error });
                message.error(
                    "Hubo un problema al generar el preview del documento"
                );
            })
            .finally(() => setLoading(false));
    };

    const descargarResolutivo = async (resolutivo = null) => {
        const values = resolutivo
            ? resolutivo
            : form.getFieldsValue(usoDeSueloFormFields);
        console.log({ values });
        await createTramiteUsoDeSueloPDF({
            ...values,
            fecha_creacion_tramite: negocio_data?.fecha_creacion_tramite,
            ubicacion_predio: getDescripcionUbicacion(
                form.getFieldValue("clave_plano"),
                form.getFieldValue("ubicacion_predio")
            ),
        })
            .then(() => {
                error_uids = [];
                error_uids2 = [];
            })
            .catch((error) => {
                console.log({ error });
                message.error("Hubo un problema al generar el documento");
            }).finally(() => setLoading(false));
    };

    const onFormComplete = async (values) => {
        setLoading(true);

        console.log({ resolutivosGuardado }, { values });
        if (resolutivosGuardado != null && resolutivosGuardado?.folio !== "") {
            const resolutivoData = JSON.parse(
                resolutivosGuardado?.detalles ?? ""
            );
            const compatibilidad_url = resolutivoData?.compatibilidad ?? "";
            const intensidad_uso_suelo_url =
                resolutivoData?.intensidad_uso_suelo ?? "";
            const plano_macrolocalizacion_url =
                resolutivoData?.plano_macrolocalizacion ?? "";

            if (compatibilidad_url !== "")
                getResolutivoImage1({
                    url: compatibilidad_url,
                    field: "compatibilidad",
                });
            if (intensidad_uso_suelo_url !== "")
                getResolutivoImage2({
                    url: intensidad_uso_suelo_url,
                    field: "intensidad_uso_suelo",
                });
            if (plano_macrolocalizacion_url !== "") {
                getResolutivoImage3({
                    url: plano_macrolocalizacion_url,
                    field: "plano_macrolocalizacion",
                });
            }
            return;
        }

        if (resolutivosGuardado === null) {
            _saveResolutivo(values);
        }
        if (resolutivosGuardado?.folio === "") {
            _firmarResolutivo();
        }
    };

    const _saveResolutivo = async (values) => {
        values = {
            ...values,
            negocio_id: negocio_data.id,
            entidad_revisora_id: Number(window?.user?.entidad_revision ?? 0),
            tramite_id: negocio_data?.resolutivo_tramite_id,
        };
        const valuesForm = getFileObject(values, [
            "compatibilidad",
            "intensidad_uso_suelo",
            "plano_macrolocalizacion",
        ]);
        const valuesJson = valuesForm.values;

        valuesForm.formData.append(
            "formDataAsString",
            JSON.stringify(valuesJson)
        );
        saveResolutivo(valuesForm.formData);
        error_uids = [];
        error_uids2 = [];
        setLoading(false);
    };

    const _firmarResolutivo = () => {
        firmarResolutivo(
            parseInt(window?.user?.entidad_revision ?? 0),
            parseInt(negocioId),
            currentYearFilter
        );
        setLoading(false);
    };

    const onFormCompleteFailed = (errorInfo) =>
        console.log("Failed:", errorInfo);

    const normFile = (e) =>
        e?.fileList.map((file, index) => {
            return {
                ...file,
                status: error_uids.includes(file.uid) ? "error" : "sucess",
            };
        });

    return (
        <>
            {predioInfo ? (
                <Form
                    name="TRÁMITE DE USO DE SUELO"
                    onFinish={onFormComplete}
                    onFinishFailed={onFormCompleteFailed}
                    autoComplete="off"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    labelAlign="left"
                    form={form}
                >
                    <Form.Item
                        label="Quien solicita:"
                        name="quien_solicita"
                        rules={getRules("Este campo es obligatorio!")}>
                        <Input
                            disabled={!!form.getFieldValue("quien_solicita")}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Fecha de inicio de trámite:"
                        name="fecha_inicio_tramite"
                        rules={getRules(
                            "Ingrese la fecha cuando se inicio el trámite!"
                        )}>
                        <Input
                            disabled={
                                !!form.getFieldValue("fecha_inicio_tramite")
                            }
                        />
                    </Form.Item>
                    <Form.Item
                        label="Tipo de uso de suelo:"
                        name="autorizacion_uso_suelo"
                        rules={getRules("Este campo es obligatorio!")}>
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Para:"
                        name="negocio"
                        rules={getRules("Este campo es obligatorio!")}>
                        <Input disabled={!!form.getFieldValue("negocio")} />
                    </Form.Item>
                    <Form.Item
                        label="Clave catastral:"
                        name="clave_catastral"
                        rules={getRules("Este campo es obligatorio!")}>
                        <Input disabled={
                                (negocio_data?.clave_catastral ?? 0) !== 0
                                    ? true
                                    : false
                            }
                        />
                    </Form.Item>
                    <Form.Item
                        label="Tipo de predio:"
                        name="tipo_predio"
                        rules={getRules("Este campo es obligatorio!")}>
                        <Input
                            disabled={
                                (negocio_data?.tipo_predio ?? 0) !== 0
                                    ? true
                                    : false
                            }
                        />
                    </Form.Item>
                    <Form.Item
                        label={<span>Superficie del terreno:</span>}
                        name="superficie"
                        rules={getRules("Este campo es obligatorio!")}>
                        <Input disabled={!!form.getFieldValue("superficie")} />
                    </Form.Item>
                    <Form.Item
                        label="Ubicación del terreno:"
                        name="direccion"
                        rules={getRules("Este campo es obligatorio!")}>
                        <Input disabled={!!form.getFieldValue("direccion")} />
                    </Form.Item>
                    <Form.Item
                        label="Antecedentes"
                        name="antecedentes"
                        rules={getRules("Este campo es obligatorio!")}>
                        <Input.TextArea
                            rows={
                                form.getFieldValue("antecedentes").split("\n")
                                    ?.length ?? 4
                            }
                        />
                    </Form.Item>
                    <Form.Item
                        label="Clave del plano"
                        name="clave_plano"
                        rules={[
                            {
                                required: !otros,
                                message: "Este campo es obligatorio!",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Ubicación del predio"
                        name="ubicacion_predio"
                        rules={getRules("Este campo es obligatorio!")}
                    >
                        <Radio.Group
                            onChange={(e) =>
                                setOtros(
                                    e.target.value === "otros" ? true : false
                                )
                            }
                        >
                            <Radio value="la_paz">La Paz</Radio>
                            <Radio value="los_barriles">Los Barriles</Radio>
                            <Radio value="todos_santos">Todos Santos</Radio>
                            <Radio value="otros">Otros</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item
                        label="Mapa de plano y macrolocalización"
                        className="dragger-container"
                        rules={getRules("Este campo es obligatorio!")}
                    >
                        <Form.Item
                            name="plano_macrolocalizacion"
                            valuePropName="fileList"
                            rules={[
                                {
                                    required:
                                        resolutivoFirmado?.plano_macrolocalizacion ===
                                        null,
                                    message: "Este campo es obligatorio!",
                                },
                            ]}
                            getValueFromEvent={(e) =>
                                normFile(
                                    e,
                                    "macrolocalizacion",
                                    [0],
                                    "/imagenes/placeholder.jpg"
                                )
                            }
                        >
                            <Upload.Dragger
                                {...props}
                                style={{
                                    width: "100%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    padding: 10,
                                }}
                            >
                                <DraggerBody
                                    identificador={"macrolocalizacion"}
                                    cantidad={[0]}
                                    placeholder={"/imagenes/placeholder.jpg"}
                                />
                            </Upload.Dragger>
                        </Form.Item>
                    </Form.Item>
                    <Form.Item
                        label="Descripción de acuerdo a normatividad y lineamientos:"
                        name="desc_normatividad_lineamientos"
                        rules={[
                            {
                                required: !otros,
                                message: "Este campo es obligatorio!",
                            },
                        ]}
                    >
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item
                        label="Tabla de intensidad de uso desuelo"
                        className="dragger-container"
                    >
                        <Form.Item
                            name="intensidad_uso_suelo"
                            valuePropName="fileList"
                            rules={[
                                {
                                    required:
                                        !otros &&
                                        resolutivoFirmado?.intensidad_uso_suelo ===
                                        null,
                                    message: "Este campo es obligatorio!",
                                },
                            ]}
                            getValueFromEvent={(e) =>
                                normFile(
                                    e,
                                    "intensidad_uso_suelo",
                                    [0],
                                    "/imagenes/placeholder-2-1.jpg"
                                )
                            }
                            noStyle
                        >
                            <Upload.Dragger
                                {...props_intensidad}
                                style={{
                                    width: "100%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    padding: 10,
                                }}
                            >
                                <DraggerBody
                                    identificador={"intensidad_uso_suelo"}
                                    cantidad={[0]}
                                    placeholder={
                                        "/imagenes/placeholder-2-1.jpg"
                                    }
                                />
                            </Upload.Dragger>
                        </Form.Item>
                    </Form.Item>
                    <Form.Item
                        label="Tabla de compatibilidad"
                        className="dragger-container"
                    >
                        <Form.Item
                            name="compatibilidad"
                            valuePropName="fileList"
                            rules={[
                                {
                                    required:
                                        !otros &&
                                        resolutivoFirmado?.compatibilidad ===
                                        null,
                                    message: "Este campo es obligatorio!",
                                },
                            ]}
                            getValueFromEvent={(e) =>
                                normFile(
                                    e,
                                    "compatibilidad",
                                    [0],
                                    "/imagenes/placeholder-2-1.jpg"
                                )
                            }
                            noStyle
                        >
                            <Upload.Dragger
                                {...{
                                    ...props_intensidad,
                                    name: "compatibilidad",
                                }}
                                style={{
                                    width: "100%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    padding: 10,
                                }}
                            >
                                <DraggerBody
                                    identificador={"compatibilidad"}
                                    cantidad={[0]}
                                    placeholder={
                                        "/imagenes/placeholder-2-1.jpg"
                                    }
                                />
                            </Upload.Dragger>
                        </Form.Item>
                    </Form.Item>
                    <Form.Item
                        label="Descripción del resolutivo:"
                        name="descripcion_resolutivo"
                        rules={getRules("Este campo es obligatorio!")}
                    >
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item
                        label="Condicionante del resolutivo:"
                        name="condicion_resolutivo"
                        rules={getRules("Este campo es obligatorio!")}
                    >
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item
                        label="Comentarios:"
                        name="comentarios"
                        rules={getRules("Este campo es obligatorio!")}
                    >
                        <Input.TextArea />
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
                                onClick={() =>
                                    generatePreview(
                                        _resolutivo ? _resolutivo : null
                                    )
                                }
                                loading={loading}
                            >
                                Ver Preview
                            </Button>
                            {loggedUserRolId === entidadRevisoraDirectorRolId &&
                                resolutivosGuardado !== null ? (
                                <Button
                                    type="primary"
                                    loading={loading}
                                    htmlType="submit"
                                >
                                    {`${resolutivosGuardado?.folio === "" ||
                                        resolutivoFirmado?.folio === ""
                                        ? "Firmar y "
                                        : ""
                                        }descagar resolutivo`}
                                </Button>
                            ) : (
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={loading}
                                    disabled={
                                        resolutivosGuardado !== null ||
                                        savedResolutivo !== null
                                    }
                                >
                                    {`Guardar resolutivo ${loggedUserRolId ===
                                        entidadRevisoraDirectorRolId &&
                                        resolutivosGuardado === null
                                        ? "y descargar"
                                        : ""
                                        }`}
                                </Button>
                            )}
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
                title={`Vista previa del savedResolutivo para ${negocio_data?.nombre_del_negocio ?? ""
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
