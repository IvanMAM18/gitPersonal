import React, { useEffect, useState } from "react";
import { Space, Radio, Alert, Button, Divider, Select } from "antd";
import axios from "axios";
import { CloudDownloadOutlined, DownloadOutlined } from "@ant-design/icons";

export default function RecoleccionBasura({
    onServicioDeRecoleccionChange,
    setRecoleccionBasura,
    girosComerciales,
    onChange,
}) {
    const [girosComercialesIds, setGirosComercialesIds] = useState([]);
    const [periodo, setPeriodo] = useState();
    const [volumen, setVolumen] = useState();
    const [disableVolumenBajo, setDisableVolumenBajo] = useState(false);
    const [disableVolumenMediano, setDisableVolumenMediano] = useState(false);
    const [disableVolumenAlto, setDisableVolumenAlto] = useState(false);
    const [selectData, setSelectData] = useState([]);

    const loadItems = async () => {
        await axios.post('/app/catalogo-servicio-privado-recoleccion-basura')
          .then(response => {
            console.log(response.data);
            setSelectData(response.data);
        });
    };
    const handleRadioChange = (e) => {
        setPeriodo(e.target.value);
        if (e.target.value === "servicio_privado") {
            loadItems() ;
        }
    };
    const validateGirosComerciales = () => {
        console.log(
            girosComerciales?.filter((giro) => giro.servicio_publico_id === 12)
                .length
        );
        if (
            girosComerciales?.filter((giro) => giro.servicio_publico_id === 12)
                .length >= 1
        ) {
            setGirosComercialesIds([]);
            setRecoleccionBasura({ id: 92 });
            return;
        }
        const giroToSetPayment = { giros: [] };
        giroToSetPayment.giros = girosComerciales.filter(
            (giroComercial) => giroComercial.tipo === "mediano_alto_impacto"
        );
        if (giroToSetPayment?.giros?.length === 0) {
            giroToSetPayment.giros = girosComerciales.filter(
                (giroComercial) => giroComercial.tipo === "bajo_impacto"
            );
        }
        console.log(girosComerciales);
        console.log({ giroToSetPayment });
        console.log([
            ...new Set(
                giroToSetPayment?.giros.map((giro) => giro.servicio_publico_id)
            ),
        ]);
        setGirosComercialesIds(
            [
                ...new Set(
                    giroToSetPayment?.giros.map(
                        (giro) => giro.servicio_publico_id
                    )
                ),
            ] ?? []
        );
    };

    useEffect(() => {
        setRecoleccionBasura(null);
        validateGirosComerciales();
    }, [girosComerciales]);


    useEffect(() => {
        switch (periodo) {
            case "cuenta_propia":
                setDisableVolumenBajo(true);
                setDisableVolumenMediano(true);
                setDisableVolumenAlto(true);
                setRecoleccionBasura({ id: 93 });
                onChange("cuenta_propia");
                return;
            case "servicio_privado":
                setDisableVolumenBajo(true);
                setDisableVolumenMediano(true);
                setDisableVolumenAlto(true);
                setRecoleccionBasura({ id: 94 });
                onChange("servicio_privado");
                return;
            case "Diario":
                setDisableVolumenBajo(true);
                setDisableVolumenMediano(true);
                setDisableVolumenAlto(false);
                setVolumen("Alto");
                onChange("diario");
                break;
            case "2 veces por semana":
                setDisableVolumenBajo(false);
                setDisableVolumenMediano(false);
                setDisableVolumenAlto(true);
                if (volumen === "Alto") {
                    setVolumen("");
                } else {
                    setVolumen(volumen);
                }
                onChange("2_veces_por_semana");
                break;
            case "3 veces por semana":
                setDisableVolumenBajo(true);
                setDisableVolumenMediano(false);
                setDisableVolumenAlto(false);
                if (volumen === "Bajo") {
                    setVolumen("");
                } else {
                    setVolumen(volumen);
                }
                onChange("3_veces_por_semana");
                break;
            default:
                setDisableVolumenBajo(false);
                setDisableVolumenMediano(false);
                setDisableVolumenAlto(false);
                setVolumen(volumen);
                break;
        }
        if (
            periodo !== null &&
            periodo !== undefined &&
            volumen !== null &&
            volumen !== undefined
        ) {
            axios
                .post("/app/get_tarifa_by_giro_comercial_recoleccion_basura", {
                    servicios_ids: girosComercialesIds,
                    periodo: periodo,
                    volumen: volumen,
                })
                .then((respuesta) => {
                    console.log(respuesta?.data[0]?.valor_uma ?? 0);
                    setRecoleccionBasura(respuesta?.data[0] ?? null);
                })
                .catch((error) => console.log(error));
        }
    }, [periodo, volumen]);

    return (
        <>
            <Space direction="vertical" style={{ width: "100%" }} align="end">
                <div
                    style={{
                        marginTop: 10,
                        marginBottom: 5,
                        textAlign: "right",
                    }}
                >
                    Seleccione el periodo de recolección
                </div>
                <Radio.Group
                    onChange={handleRadioChange}
                    value={periodo}
                    style={{ textAlign: "right" }}
                    disabled={
                        (girosComercialesIds?.length ?? 0) > 0 ? false : true
                    }
                >
                    <Radio value={"2 veces por semana"}>
                        2 veces por semana
                    </Radio>
                    <Radio value={"3 veces por semana"}>
                        3 veces por semana
                    </Radio>
                    <Radio value={"Diario"}>Diario</Radio>
                    <Radio value={"cuenta_propia"}>
                        Tiro la basura por mi cuenta en el relleno sanitario
                    </Radio>
                    <Radio value={"servicio_privado"}>
                        Contrato de recolección de basura privado
                    </Radio>
                </Radio.Group>
                <div
                    style={{
                        marginTop: 10,
                        marginBottom: 5,
                        textAlign: "right",
                    }}
                >
                    Seleccione el volumen de generacón
                </div>
                <Radio.Group
                    onChange={(e) => setVolumen(e.target.value)}
                    value={volumen}
                    style={{ textAlign: "right" }}
                    disabled={
                        (girosComercialesIds?.length ?? 0) > 0 ? false : true
                    }
                >
                    <Radio value={"Bajo"} disabled={disableVolumenBajo}>
                        Bajo
                    </Radio>
                    <Radio value={"Medio"} disabled={disableVolumenMediano}>
                        Medio
                    </Radio>
                    <Radio value={"Alto"} disabled={disableVolumenAlto}>
                        Alto
                    </Radio>
                </Radio.Group>
            </Space>

            {
                // este PDF se debe dar el contribuyente
                // cuando seleccione cuenta_propia, este será
                // requerido en el futuro por una entidad como
                // requisito
                /* periodo === 'cuenta_propia'  && (
                     <>
                      <Divider></Divider>
                        <Alert type="warning" showIcon message="Haz seleccionado <<Tiro la basura por mi cuenta en el relleno sanitario>> es necesario que descargues este documento y lo completes, será requerido por la revisión más adelante (puedes encontrarlo en los detalles de este trámites)"/>

                        <Button icon={<CloudDownloadOutlined/>} type="primary" block target="_blank" href="/CONVENIO_POR_USO_DEL_RELLENO_SANITARIO.pdf">Descargar PDF</Button>
                    </>
                )*/
            }
            {
                // este PDF se debe dar el contribuyente
                // cuando seleccione cuenta_propia, este será
                // requerido en el futuro por una entidad como
                // requisito
                //
                // 240 recolectora ambiental y servicios integrales
                // 760 Ecología y movimiento

                periodo === "servicio_privado" && (
                    <>
                        <Divider></Divider>
                        <Alert
                            type="warning"
                            showIcon
                            message="Haz seleccionado <<Contrato de recolección de basura privado>> debes especificar el servicio de recolección de desechos que has contratado"
                        />
                        <Select
                            defaultValue="selecciona una opción"
                            style={{ width: "100%" }}
                            onChange={onServicioDeRecoleccionChange}
                            options={selectData}
                        />
                    </>
                )
            }
        </>
    );
}
