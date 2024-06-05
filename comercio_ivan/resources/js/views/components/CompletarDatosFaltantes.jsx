import { UploadOutlined } from "@ant-design/icons";
import {
    Button,
    Divider,
    message,
    Form,
    Input,
    InputNumber,
    Modal,
    Radio,
    Upload,
    Popconfirm,
} from "antd";
import Horario from "./Horario";
import axios from "axios";
import React, { useEffect, useState } from "react";

var data = {};

const uploadHeaders = {
    _token:  document.head.querySelector('meta[name="csrf-token"]').content ?? window.csrf,
};

function CompletarDatosFaltantes() {
    const [modalAbierto, setModalAbierto] = useState(false);
    const [negocios, setNegocios] = useState([]);
    const [loading, setLoading] = useState(false);
    const [tipoDePredio, setTipoDePredio] = useState({});
    const [tamanoEmpresa, setTamanoEmpresa] = useState({});

    useEffect(() => {
        axios.get("/app/datos-faltantes-de-negocios").then((response) => {
        if (response.data.negocios_datos_faltantes.length) {
                for (const negocio of response.data.negocios_datos_faltantes) {
                    data[negocio.id] = {};
                    if (!negocio.superficie_m2) {
                        data[negocio.id].superficie_m2 = 0;
                    }
                    if (!negocio.cajones_estacionamiento) {
                        data[negocio.id].cajones_estacionamiento = 0;
                    }
                    if (!negocio.foto_frontal_fachada) {
                        data[negocio.id].foto_frontal_fachada = "";
                    }
                    if (!negocio.comprobante_domicilio) {
                        data[negocio.id].comprobante_domicilio = "";
                    }
                    if (!negocio.tipo_predio_propiedad) {
                        data[negocio.id].tipo_predio_propiedad = "mi_propiedad";
                    }
                    if (!negocio.documento_predio_propiedad) {
                        data[negocio.id].documento_predio_propiedad = "";
                    }
                    if (!negocio.descripcion_actividad) {
                        data[negocio.id].descripcion_actividad = "";
                    }
                    if (negocio.venta_alcohol === null) {
                        data[negocio.id].venta_alcohol = null;
                    }
                    /*if(tamanoEmpresa[negocio.id] !== 'autoempleado')
                    {
                        if (negocio.no_empleados_h == 0 & negocio.no_empleados_m ==0) {
                            data[negocio.id].no_empleados_h = 0;
                            data[negocio.id].no_empleados_m = 0;
                        }
                        else
                        {
                            data[negocio.id].no_empleados_h =negocio.no_empleados_h;
                            data[negocio.id].no_empleados_m = negocio.no_empleados_m;
                        }

                    }
                    if (negocio.autoempleo === false) {
                        data[negocio.id].autoempleo = false;
                    }
                    if (
                        negocio?.horarios === null ||
                        negocio?.horarios === "[]" ||
                        negocio?.horarios.includes('Invalid')
                    ) {
                        data[negocio.id].horarios = null;
                    }*/
                }
                setModalAbierto(true);
                setNegocios(response.data.negocios_datos_faltantes);

                var prediosInitData = {}
                response.data.negocios_datos_faltantes.forEach((negocio) => {
                    prediosInitData[negocio.id] = 'mi_propiedad'
                })
                setTipoDePredio(prediosInitData)

                var tamanoEmpresaInitData = {}
                response.data.negocios_datos_faltantes.forEach((negocio) => {
                    tamanoEmpresaInitData[negocio.id] = 'grande'
                    data[negocio.id].tamano_empresa = 'grande'
                })
                setTamanoEmpresa(tamanoEmpresaInitData)

            }
        })
        .catch((error) => {
            console.log('error', error);
        });
    }, []);

    const submit = () => {
        setLoading(true);
        for (const negocio in data) {
            if (Object.hasOwnProperty.call(data, negocio)) {
                for (const field in data[negocio]) {
                    if (Object.hasOwnProperty.call(data[negocio], field)) {
                        if (
                            !data[negocio][field] && (
                                field !== "venta_alcohol"  && field !== "no_empleados_h" && field !== "no_empleados_m" && field !== "autoempleo" && field !== "cajones_estacionamiento")
                        ) {
                            message.error(
                                'Todos los campos del formulario son requeridos, falta "' +
                                    field.replace(/_/g, " ") +
                                    '" de ' +
                                    negocio
                            );
                            return;
                        }

                        // venta de alcohol es un boolean
                        // así que si es false fallaría la
                        // valicación de arriba
                        if (field === "venta_alcohol" ) {

                            if (data[negocio][field] === null) {
                                message.error(
                                    'Todos los campos del formulario son requeridos, falta "' +
                                        field.replace(/_/g, " ") +
                                        '" de ' +
                                        negocio
                                );
                                return;
                            }
                        }
                    }
                }
            }
            if (data[negocio] && typeof data[negocio] === 'object' && 'autoempleo' in data[negocio]) {
                if (data[negocio]["autoempleo"] === false)
                {
                    var mujeres=data[negocio]["no_empleados_m"];
                    var hombres=data[negocio]["no_empleados_h"];
                    if((mujeres+hombres)<1)
                   {

                    message.error(
                        'Debe existir al menos un empleado '
                    );
                    return;
                   }
                   else
                   {
                    if(data[negocio]["no_empleados_m"]==null) data[negocio]["no_empleados_m"]=0;
                    if(data[negocio]["no_empleados_h"]==null) data[negocio]["no_empleados_h"]=0;
                   }
                }
                else
                {
                    data[negocio]["no_empleados_m"]=0;
                    data[negocio]["no_empleados_h"]=0;
                }
            }
        }

        axios
            .post("/app/datos-faltantes-de-negocios", data)
            .then((result) => {
                console.log(result.data)
                setModalAbierto(false);
                if (result.data.ok) {
                    message.success("Completado");
                }
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const setHorarioFaltante = (horario, negocioId) => {
        data[negocioId].horarios = horario;
    };

    return (
        <>
            <Modal
                visible={modalAbierto}
                width={700}
                title="Negocio con datos Faltantes"
                footer={
                    <>
                        <Popconfirm
                            okText="Salir"
                            cancelText="Quedarse"
                            title="Si cierras esta ventana se terminará tu sesión, y deberás iniciar de nuevo"
                            onConfirm={async () => {
                                const response = await axios.post("/logout");
                                if (response.status === 200) {
                                    location.href = "/login";
                                }
                            }}
                        >
                            <Button>Cancelar</Button>
                        </Popconfirm>
                        <Button onClick={submit}>Enviar información</Button>
                    </>
                }
            >
                <p>
                    Recientemente actualizamos la información requerida para los
                    negocios, algunos de los negocios que has registrado
                    necesitan actualizarse
                </p>
                {negocios.map((negocio, key) => {
                    return (
                        <div key={"n" + key}>
                            <Divider />
                            <h5>{negocio.nombre_del_negocio} ({negocio.id})</h5>
                            {
                                (negocio.horarios==null || negocio.horarios.includes('Invalid') || negocio.horarios === "[]") && (
                                    <>
                                        <p>Horario</p>
                                        <Horario
                                            setHorarioFaltante={setHorarioFaltante}
                                            negocioId={negocio.id}
                                        />
                                    </>
                                )
                            }
                            {!negocio.superficie_m2 && (
                                <>
                                    <br />
                                    <Form.Item label="Superficie construida del comercio (m^2)">
                                        <InputNumber
                                            precision={0}
                                            min={0}
                                            placeholder="400"
                                            onChange={(val) => {
                                                data[negocio.id].superficie_m2 =
                                                    parseInt(val);
                                            }}
                                        />
                                    </Form.Item>
                                </>
                            )}
                            {!negocio.descripcion_actividad && (
                                <>
                                    <br />
                                    <Form.Item label="Descripcion de actividad">
                                        <Input.TextArea
                                            rows={3}
                                            placeholder="Mi empresa se dedica a..."
                                            onChange={(e) => {
                                                data[
                                                    negocio.id
                                                ].descripcion_actividad =
                                                    e.target.value;
                                            }}
                                        />
                                    </Form.Item>
                                </>
                            )}
                            {!negocio.cajones_estacionamiento && (
                                <>
                                    <br />
                                    <Form.Item label="Cantidad de cajones de estacionamiento">
                                        <InputNumber
                                            min={0}
                                            placeholder="10"
                                            onChange={(val) => {
                                                data[negocio.id].cajones_estacionamiento = parseInt(val);
                                            }}
                                        />
                                    </Form.Item>
                                </>
                            )}
                            {!negocio.foto_frontal_fachada && (
                                <>
                                    <br />
                                    <Form.Item label="Fotografía de la fachada del negocio">
                                        <Upload
                                            onChange={(info) => {
                                                const { status } = info.file;
                                                if (status !== "uploading") {
                                                    // console.log(info.file, info.fileList);
                                                }
                                                if (status === "done") {
                                                    data[negocio.id].foto_frontal_fachada = info.file.response;
                                                    message.success(`La imagen se cargó correctamente`);
                                                } else if (status === "error") {
                                                    message.error("Carga fallida");
                                                }
                                            }}
                                            name="foto_frontal_negocio"
                                            action="/app/uploads/foto-frontal-negocio"
                                            listType="picture"
                                            accept="image/png, image/jpeg, image/jpg, application/pdf"
                                            multiple={false}
                                            data={{ _token: document.head.querySelector('meta[name="csrf-token"]').content }}
                                            maxCount={1}
                                        >
                                            <Button icon={<UploadOutlined />}>
                                                De click para subir imagen
                                            </Button>
                                        </Upload>
                                    </Form.Item>
                                </>
                            )}
                            {!negocio.comprobante_domicilio && (
                                <>
                                    <br />
                                    <Form.Item label="Comprobante de domicilio del establecimiento (SAPA)">
                                        <Upload
                                            onChange={(info) => {
                                                const { status } = info.file;
                                                if (status !== "uploading") {
                                                    // console.log(info.file, info.fileList);
                                                }
                                                if (status === "done") {
                                                    data[negocio.id].comprobante_domicilio = info.file.response;
                                                    message.success(`El comprobante se cargó correctamente`);
                                                } else if (status === "error") {
                                                    message.error("Carga fallida");
                                                }
                                            }}
                                            name="comprobante_domicilio_negocio"
                                            action="/app/uploads/comprobante-domicilio-negocio"
                                            listType="picture"
                                            accept="image/png, image/jpeg, image/jpg, application/pdf"
                                            multiple={false}
                                            data={{ _token: document.head.querySelector('meta[name="csrf-token"]').content  }}
                                            maxCount={1}
                                        >
                                            <Button icon={<UploadOutlined />}>
                                                De click para el comprobante
                                            </Button>
                                        </Upload>
                                    </Form.Item>
                                </>
                            )}


                            {negocio.venta_alcohol === null && (
                                <>
                                    <br />
                                    <Form.Item label="¿Se vende alcohol en su establecimiento?">
                                        <Radio.Group
                                            onChange={(val) => {
                                                data[negocio.id].venta_alcohol = val.target.value;
                                            }}
                                        >
                                            <Radio value={true}>Sí</Radio>
                                            <Radio value={false}>No</Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                </>
                            )}

                        {/*negocio.no_empleados_h === 0 && negocio.no_empleados_m === 0 &&  negocio.autoempleo=== false &&(
                                <>
                                <br />
                                <Form.Item label="Autoempleo (Si: Empleados se asignarán como 0)">
                                        <Radio.Group
                                            onChange={(val) => {
                                                data[negocio.id].autoempleo = val.target.value;
                                                if(data[negocio.id].autoempleo===true)
                                                {
                                                    data[negocio.id].no_empleados_h=0;
                                                    data[negocio.id].no_empleados_m=0;
                                                }
                                                else
                                                {
                                                    data[negocio.id].no_empleados_h=null;
                                                    data[negocio.id].no_empleados_m=null;
                                                }
                                            }}
                                        >
                                        <Radio value={true}>Sí</Radio>
                                        <Radio value={false}>No</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </>
                            )*/}
                            {(negocio.no_empleados_h +negocio.no_empleados_m)  == 0  &&  negocio.autoempleo!==true  &&(
                                <>
                                    <br />
                                    <Form.Item label="Cantidad de empleados (Hombre)">
                                        <InputNumber
                                            disabled={tamanoEmpresa[negocio.id] === 'autoempleo'}
                                            precision={0}
                                            min={0}
                                            placeholder="5"
                                            onChange={(val) => {
                                                data[negocio.id].no_empleados_h = parseInt(val);
                                            }}
                                        />
                                    </Form.Item>
                                </>
                            )}

                            {(negocio.no_empleados_h +negocio.no_empleados_m)  == 0   && negocio.autoempleo!== true && (
                                <>
                                    <br />
                                    <Form.Item label="Cantidad de empleados (Mujer)">
                                        <InputNumber
                                            disabled={tamanoEmpresa[negocio.id] === 'autoempleo'}
                                            precision={0}
                                            min={0}
                                            placeholder="5"
                                            onChange={(val) => {
                                                data[negocio.id].no_empleados_m = parseInt(val);
                                            }}
                                        />
                                    </Form.Item>
                                </>
                            )}

                            {!negocio.tipo_predio_propiedad && (
                                <>
                                    <br />
                                    <Form.Item label="Tipo de predio">
                                        <Radio.Group
                                            value={tipoDePredio[negocio.id]}
                                            onChange={(val) => {
                                                data[negocio.id].tipo_predio_propiedad = val.target.value;
                                                setTipoDePredio({
                                                    ...tipoDePredio,
                                                    [negocio.id]: val.target.value,
                                                });
                                            }}
                                        >
                                            <Radio value="mi_propiedad">De mi propiedad</Radio>
                                            <Radio value="rentado">Rentado</Radio>
                                            <Radio value="prestado">Prestado</Radio>
                                            <Radio value="federal">Zona federal</Radio>
                                            <Radio value="ejidal">Ejidal</Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                </>
                            )}

                            {!negocio.tamano_empresa && (
                                <>
                                    <br />
                                    <Form.Item  labelAlign={'left'}
                                    label="Actualizar y proporcionar la información correctamente, de acuerdo a la siguiente estratificación">
                                        <br />
                                        <Radio.Group
                                            value={tamanoEmpresa[negocio.id]}
                                            onChange={(e) => {
                                                data[negocio.id].tamano_empresa = e.target.value;
                                                setTamanoEmpresa({
                                                    ...tamanoEmpresa,
                                                    [negocio.id]: e.target.value,
                                                });
                                            }}
                                        >
                                            <Radio value="autoempleo">AUTOEMPLEO (sin empleados)</Radio>
                                            <Radio value="micro">MICRO ( 1-10 empleados)</Radio>
                                            <Radio value="pequeña">PEQUEÑA (11-30 empleados)</Radio>
                                            <Radio value="mediana">MEDIANA (31-100 empleados)</Radio>
                                            <Radio value="grande">GRANDE (101 empleados en adelante)</Radio>
                                        </Radio.Group>
                                        <br />   <br />
                                        <label style={{textAlign:'justify'}}><b>La falta oportuna de las declaraciones, así como la falsedad de datos contenidos en las mismas, la resistencia a
                        las visitas de inspección conducentes a la correcta determinación de la base gravable, y, en general, el incumplimiento de las obligaciones fiscales será sancionadas, independientemente de
                        la responsabilidad de tipo penal en qué se incurre, con multa de 150 veces el valor de la Unidad de Medida y Actualización.
Ley de Hacienda para el Municipio de La Paz, B.C.S. Artículo 124.</b></label>
                                    </Form.Item>
                                </>
                            )}

                            {!negocio.documento_predio_propiedad && (
                                <>
                                    <br />
                                    <Form.Item
                                        label={
                                            {
                                                mi_propiedad:
                                                    "Subir escrituras o titulo de propiedad",
                                                rentado: "Subir contrato de arrendamiento",
                                                prestado: "Subir carta comodato",
                                                federal: "Subir acta de zona federal",
                                                ejidal: "Mapa cartográfico o croquis de coordenadas UTM",
                                            }[tipoDePredio[negocio.id]] ||
                                            "Seleccione una opción arriba"
                                        }
                                        name="documento_predio_propiedad"
                                    >
                                        <Upload
                                            onChange={(info) => {
                                                const { status } = info.file;
                                                if (status === "done") {
                                                    message.success(`Documento enviado correctamente`);
                                                    // se llama comprobante_domicilio para que se autorrellene en backend
                                                    data[negocio.id].documento_predio_propiedad = info.file.response;
                                                } else if (status === "error") {
                                                    if (info.file.response.includes("bytes exceeds the limit")) {
                                                        message.error("El documento es demasiado grande, el límite de subida es de 50 MB");
                                                    } else {
                                                        message.error("Ocurrió un error al subir el documento");
                                                    }
                                                }
                                            }}
                                            accept="image/png, image/jpeg, image/jpg, application/pdf"
                                            name="documento_tipo_predio"
                                            action="/app/uploads/predio-propiedad"
                                            data={uploadHeaders}
                                        >
                                            <Button icon={<UploadOutlined />}>
                                                {{
                                                    mi_propiedad: "escrituras o titulo de propiedad",
                                                    rentado: "contrato de arrendamiento",
                                                    prestado: "carta comodato",
                                                    federal: "Subir acta de zona federal",
                                                    ejidal: "Mapa cartográfico o croquis de coordenadas UTM",
                                                }[tipoDePredio[negocio.id]] || "Cargar documento"}
                                            </Button>
                                        </Upload>
                                    </Form.Item>
                                </>
                            )}
                        </div>
                    );
                })}
            </Modal>
        </>
    );
}

export default CompletarDatosFaltantes;
