import React from "react";
import { Button, Table, Tag, Divider,} from "antd";
import status from "../utils/statuses";

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
    impacto,
    onTramiteIdSelected,
    revisionesActivas
}) {
    if (!data) {
        return null;
    }

    const abrirAvisoEntero = (avisoEntero) => {
        window.open(
            `/entidad-revision/avisos-enteros/${avisoEntero.id}/pdf`,
            "_blank",
            "fullscreen=yes"
        );
    };
    return (
        <Table
            bordered
            columns={[
                {
                    title: "ID (trámite)",
                    dataIndex: "revision_id",
                    key: "revision_id",
                    render: (_, record) => {
                        return <h6>{record.tramite_padre_id}</h6>;
                    },
                },
                {
                    title: "Entidad revisora",
                    dataIndex: "entidad",
                    key: "entidad",
                    render: (_, record) => {
                        return <h6>{record.catalogo_tramites[0].nombre}</h6>;
                    },
                },
                {
                    title: "Estado",
                    dataIndex: "revision_status",
                    key: "revision_status",
                    render: (_, record) => {
                        /*
                        if (
                            // TODO: aquí se valida protección civil con el nombre
                            (record.catalogo_tramites[0].nombre ===
                                "Dictamen de Medio Ambiente" &&
                                _ !== status.APROBADO) ||
                            (_ !== status.VISTO_BUENO &&
                                impacto === "mediano_alto_impacto")
                        ) {
                            _ = status.ENVIADO;
                        }*/
                        const catalogoTramite = record.catalogo_tramites[0];
                        const avisoEntero = record.aviso_entero;
                        const estadoAvisoEntero =
                                    avisoEntero?.estado ?? "PENDIENTE";
                        return (status.tag(_))
                        // return (
                        //     <span className="comercio-admin-progreso-row">
                        //         {status.tag(_)}
                        //         {catalogoTramite.pago ? (
                        //             <Tag color="gold">
                        //                 Requiere pago
                        //             </Tag>
                        //         ) : (
                        //             <Tag>No requiere pago</Tag>
                        //         )}
                        //         {catalogoTramite.pago ? (
                        //             <Tag>
                        //                 AVISO {estadoAvisoEntero}
                        //             </Tag>
                        //         ) : null}
                                
                                
                        //     </span>
                        // );
                        
                    },
                },
                {
                    title: "Pago",
                    dataIndex: "pago",
                    key: "pago",
                    render: (_, record) => {
                        const pagoRequerido = record.catalogo_tramites[0].pago
                            ? (
                                // <Tag color="warning">
                                //     Pago requerido (pendiente)
                                // </Tag>
                                null
                            ) : (
                                <Tag>Pago no requerido</Tag>
                            );
                        const avisoEntero = record.aviso_entero;
                        if(!avisoEntero)
                                return pagoRequerido;

                        return avisoEntero.pagado
                            ? (
                                <Tag color="success">
                                    Pagado
                                </Tag>
                                
                            ) : (
                                <div>
                                    {pagoRequerido}
                                    <Button
                                        type="primary"
                                        onClick={() =>
                                            abrirAvisoEntero(
                                                record.aviso_entero
                                            )
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
                    render: (_, tramite) => {
                        return (
                            <Button
                                type="link"
                                onClick={() => onTramiteIdSelected(tramite.id)}
                            >
                                Detalles
                            </Button>
                        );
                    },
                },
            ]}
            dataSource={data}
            pagination={false}
        ></Table>
    );
}
