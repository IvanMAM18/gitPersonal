import React, { useEffect, useState } from "react";
import { Button, Table, Tag, Modal } from "antd";
import status from "../../utils/statuses";
import ResolutivoManager from "./ResolutivoManager";

/**
 * Solo hay que pasarle un array de revisiones
 * para que imprima el status de cada entidad
 * y si está disponible el status del pago
 *
 * UPDATE: ya no funciona con revisiones, funciona
 * con trámites
 */

export default function TablaDeRevisiones({
    data,
    onTramiteIdSelected,
    resolutivos,
    giro_comercial,
    num_empleados_h,
    num_empleados_m,
    superficie_mayor_250,
    tipo_predio_propiedad,
    nombre_tramite_comercio = "",
}) {
    const [resolutivo, setResolutivo] = useState(null);
    const [resolutivoLF, setResolutivoLF] = useState(null);
    const columnasTablaRevisiones = [
        {
            title: "ID (trámite)",
            dataIndex: "revision_id",
            key: "revision_id",
            render: (_, record) => <h6>{record.tramite_padre_id}</h6>,
        },
        {
            title: "Entidad revisora",
            dataIndex: "entidad",
            key: "entidad",
            render: (_, record) => (
                <h6>{record.catalogo_tramites[0].nombre}</h6>
            ),
        },
        {
            title: "Estado",
            dataIndex: "revision_status",
            key: "revision_status",
            render: (_, record) => status.tag(_),
        },
        {
            title: "Pago",
            dataIndex: "pago",
            key: "pago",
            render: (_, record) => {
                const pagoRequerido = record.catalogo_tramites[0].pago ? (
                    <Tag color="warning">Pago requerido (pendiente)</Tag>
                ) : (
                    <Tag>Pago no requerido</Tag>
                );
                const avisoEntero = record.aviso_entero;

                if (!avisoEntero || avisoEntero.estado==='EXPIRADO') return pagoRequerido;
                return avisoEntero.pagado ? (
                    <Tag color="success">Pagado</Tag>
                ) : (
                    <div>
                        {pagoRequerido}
                        <Button
                            type="primary"
                            onClick={() =>
                                abrirAvisoEntero(record.aviso_entero)
                            }
                        >
                            Pagar (Aviso entero)
                        </Button>
                    </div>
                );
            },
        },
        {
            title: "Detalles",
            dataIndex: "pago",
            key: "pago",
            render: (_, tramite) => (
                <Button
                    type="link"
                    onClick={() => onTramiteIdSelected(tramite.id)}
                >
                    Detalles
                </Button>
            ),
        },/*
        {
            title: "Resolutivo",
            dataIndex: "resolutivo",
            key: "resolutivo",
            render: (_, record) => getResolutivoColumnContent(record),
        },*/
    ];

    const getResolutivoColumnContent = (record) => {
        const resolutivoParaTramite = resolutivos?.find(
            (resolutivo) =>
                resolutivo?.entidad_revisora_id ===
                record?.catalogo_tramites?.[0]?.entidad_revisora_id
        );

        return (
            <Button
                type="link"
                onClick={() =>
                    setResolutivo({
                        id: resolutivoParaTramite?.id ?? null,
                        folio: resolutivoParaTramite?.folio ?? null,
                        entidadRevisoraId:
                            resolutivoParaTramite?.entidad_revisora_id,
                        nombreTramite:
                            record?.catalogo_tramites?.[0]?.nombre ?? "",
                        ...JSON.parse(resolutivoParaTramite?.detalles),
                        giro_comercial: giro_comercial ?? [],
                        num_empleados_h: num_empleados_h ?? 0,
                        num_empleados_m: num_empleados_m ?? 0,
                        superficie_mayor_250: superficie_mayor_250 ?? 0,
                        tipo_predio_propiedad: tipo_predio_propiedad,
                    })
                }
                disabled={
                    resolutivoParaTramite === null ||
                    resolutivoParaTramite === undefined
                }
            >
                Ver
            </Button>
        );
    };

    const abrirAvisoEntero = (avisoEntero) => {
        window.open(
            `/entidad-revision/avisos-enteros/${avisoEntero.id}/pdf`,
            "_blank",
            "fullscreen=yes"
        );
    };

    const getVerLicenciaButton = () => {
        const resolutivoParaTramite = resolutivos?.find(
            (resolutivo) => resolutivo?.entidad_revisora_id === 5
        );

        console.log({ resolutivoParaTramite });
        if (
            resolutivoParaTramite?.entidad_revisora_id === 5 &&
            resolutivoParaTramite?.folio !== null
        ) {
            setResolutivoLF({
                id: resolutivoParaTramite?.id ?? null,
                folio: resolutivoParaTramite?.folio ?? null,
                entidadRevisoraId: resolutivoParaTramite?.entidad_revisora_id,
                nombreTramite: nombre_tramite_comercio ?? "",
                ...JSON.parse(resolutivoParaTramite?.detalles),
                giro_comercial: giro_comercial ?? [],
                num_empleados_h: num_empleados_h ?? 0,
                num_empleados_m: num_empleados_m ?? 0,
                superficie_mayor_250: superficie_mayor_250 ?? 0,
                tipo_predio_propiedad: tipo_predio_propiedad,
            });
        }
    };

    useEffect(() => {
        if (resolutivos !== null) {
            getVerLicenciaButton();
        }
    }, [resolutivos]);
    return (
        <>

            <Table
                bordered
                columns={columnasTablaRevisiones}
                dataSource={data}
                pagination={false}
            />
            <Modal
                title={resolutivo?.nombreTramite}
                open={resolutivo !== null}
                onCancel={() => setResolutivo(null)}
                onOk={() => setResolutivo(null)}
                width={"85%"}
            >
                <ResolutivoManager
                    resolutivo={resolutivo}
                    giro_comercial={giro_comercial ?? []}
                    num_empleados_h={num_empleados_h ?? 0}
                    num_empleados_m={num_empleados_m ?? 0}
                />
            </Modal>
        </>
    );
}
