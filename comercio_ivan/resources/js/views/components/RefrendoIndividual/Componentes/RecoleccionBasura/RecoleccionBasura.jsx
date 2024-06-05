import React, { useEffect, useState } from "react";
import { Space, Radio, Alert, Divider, Select } from "antd";
import axios from "axios";

export default function RecoleccionBasura({
    setServicioRecoleccionPrivado,
    setTarifaRecoleccionId,
    girosComerciales,
    setNivelRecoleccionBasura,
    defaultValuesRecoleccionBasura
}) {
    const [servicioPublicoIds, setServicioPublicoIds] = useState([]);
    const [periodo, setPeriodo] = useState((!!defaultValuesRecoleccionBasura?.tarifaRecoleccionBasura?.periodo
        ? defaultValuesRecoleccionBasura?.tarifaRecoleccionBasura?.periodo : defaultValuesRecoleccionBasura?.nivel_recoleccion_basura));
    const [volumen, setVolumen] = useState(defaultValuesRecoleccionBasura?.tarifaRecoleccionBasura?.volumen);
    const [disableVolumenBajo, setDisableVolumenBajo] = useState(false);
    const [disableVolumenMediano, setDisableVolumenMediano] = useState(false);
    const [disableVolumenAlto, setDisableVolumenAlto] = useState(false);
    const [catalogoRecoleccionPrivada, setCatalogoRecoleccionPrivada] = useState([]);

    const loadItems = async () => {
        await axios.post('/app/catalogo-servicio-privado-recoleccion-basura', {})
            .then(response => {
                const options = response?.data?.map(option => ({ label: option?.title, value: option?.value }));
                setCatalogoRecoleccionPrivada(options);
            });
    };
    const handleRadioChange = (e) => {
        setPeriodo(e.target.value);
    };
    const validateGirosComerciales = () => {

        if (girosComerciales?.filter((giro) => giro.servicio_publico_id === 12).length >= 1) {
            setServicioPublicoIds([]);
            setTarifaRecoleccionId({ id: 92 });
            return;
        }
        const giroToSetPayment = { giros: [] };
        giroToSetPayment.giros = girosComerciales?.filter(
            (giroComercial) => giroComercial.tipo === "mediano_alto_impacto"
        );
        if (giroToSetPayment?.giros?.length === 0) {
            giroToSetPayment.giros = girosComerciales?.filter(
                (giroComercial) => giroComercial.tipo === "bajo_impacto"
            );
        }
        setServicioPublicoIds(
            [
                ...new Set(
                    giroToSetPayment?.giros?.map(
                        (giro) => giro.servicio_publico_id
                    )
                ),
            ] ?? []
        );
    };

    useEffect(() => {
        validateGirosComerciales();
    }, [girosComerciales]);

    useEffect(() => {
        switch (periodo) {
            case "cuenta_propia":
                setDisableVolumenBajo(true);
                setDisableVolumenMediano(true);
                setDisableVolumenAlto(true);
                setTarifaRecoleccionId({ id: 93 });
                setNivelRecoleccionBasura("cuenta_propia");
                return;
            case "servicio_privado":
                loadItems();
                setDisableVolumenBajo(true);
                setDisableVolumenMediano(true);
                setDisableVolumenAlto(true);
                setTarifaRecoleccionId({ id: 94 });
                setNivelRecoleccionBasura("servicio_privado");
                return;
            case "Diario":
                setDisableVolumenBajo(true);
                setDisableVolumenMediano(true);
                setDisableVolumenAlto(false);
                setVolumen("Alto");
                setNivelRecoleccionBasura("diario");
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
                setNivelRecoleccionBasura("2_veces_por_semana");
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
                setNivelRecoleccionBasura("3_veces_por_semana");
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
                    servicios_ids: servicioPublicoIds,
                    periodo: periodo,
                    volumen: volumen,
                })
                .then((respuesta) => {
                    setTarifaRecoleccionId(respuesta?.data[0] ?? null);
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
                        (servicioPublicoIds?.length ?? 0) > 0 ? false : true
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
                    value={volumen ?? !!defaultValuesRecoleccionBasura?.tarifaRecoleccionBasura?.volumen}
                    style={{ textAlign: "right" }}
                    disabled={
                        (servicioPublicoIds?.length ?? 0) > 0 ? false : true
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


                periodo === "servicio_privado" &&
                catalogoRecoleccionPrivada?.length > 0 && (
                    <>
                        <Divider></Divider>
                        <Alert
                            type="warning"
                            showIcon
                            message="Haz seleccionado <<Contrato de recolección de basura privado>> debes especificar el servicio de recolección de desechos que has contratado"
                        />
                        <Select
                            placeholder="selecciona una opción"
                            style={{ width: "100%" }}
                            onChange={setServicioRecoleccionPrivado}
                            options={catalogoRecoleccionPrivada}
                            defaultValue={defaultValuesRecoleccionBasura?.servicio_priv_recoleccion}
                        />
                    </>
                )
            }
        </>
    );
}
