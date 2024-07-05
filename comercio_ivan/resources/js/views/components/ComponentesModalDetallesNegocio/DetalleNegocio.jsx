import { Divider, Popover, Tag } from "antd";
import status from "../../../utils/statuses";
import moment from "moment";

import {
    CheckCircleOutlined,
    ClockCircleOutlined,
    CloseCircleOutlined,
    ExclamationCircleOutlined,
    MinusCircleOutlined,
    SyncOutlined,
  } from '@ant-design/icons';

export default function DetalleNegocio({ negocio, useDivider = true }) {

    console.log("NEGOCIOS DETALLE NEGOCIOS: ", negocio.giro_comercial)
    return (
        <>
            {negocio?.created_at && (
                <div className="sare--descriptions-column">
                    <p>
                        <b>Nombre: </b> {negocio?.nombre_del_negocio}
                    </p>
                    <p>
                        <b>Descripción de actividad: </b>{" "}
                        {negocio?.descripcion_actividad}
                    </p>
                    <p>
                        <b>Venta de alcohol: </b>{" "}
                        {negocio?.venta_alcohol ? "Sí" : "No"}
                    </p>

                    <p>
                        <b>Giros comerciales: </b>{" "}
                        {negocio?.giro_comercial ? (
                            negocio?.giro_comercial?.map((giro_comercial) => (
                                <Tag>{giro_comercial.nombre}</Tag>
                            ))
                        ) : null}
                    </p>
                    {negocio.foto_frontal_fachada ? (
                        <p>
                            <a
                                href={
                                    "/" +
                                    negocio.foto_frontal_fachada.replace(
                                        "public",
                                        "storage"
                                    )
                                }
                                target="_blank"
                            >
                                <b>Foto de fachada ↗</b>
                            </a>
                        </p>
                    ) : (
                        <p>
                            <b>Foto de la fachada no disponible</b>
                        </p>
                    )}
                    {negocio.comprobante_domicilio ? (
                        <p>
                            <a
                                href={
                                    "/" +
                                    negocio.comprobante_domicilio.replace(
                                        "public",
                                        "storage"
                                    )
                                }
                                target="_blank"
                            >
                                <b>Comprobante de domicilio ↗</b>
                            </a>
                        </p>
                    ) : (
                        <p>
                            <b>Comprobante de domicilio no disponible</b>
                        </p>
                    )}
                    {
                            !!negocio.documento_predio_propiedad ? (
                                <p><a href={'/' + negocio.documento_predio_propiedad.replace('public', 'storage')} target="_blank"><b>Documento de propiedad ↗</b></a></p>
                            ) : (
                                <p><b>Documento de propiedad no disponible</b></p>
                            )
                        }
                    <p>
                        <b>Estado: </b>
                        {status.tag(
                            `${
                                negocio?.status === "APROBADO"
                                    ? negocio?.status + "_DN"
                                    : negocio?.status
                            }`
                        )}
                    </p>
                    <p>
                        <b>Teléfono: </b> {negocio?.telefono ?? "N/D"}
                    </p>
                    <p>
                        <b>Fecha de registro: </b>
                        {moment(negocio.created_at).format("YYYY/MM/DD")}
                    </p>
                    <p>
                        <b>Fecha de inicio del trámite: </b>
                        {
                            `${
                                negocio?.tramite_padre[0]?.created_at
                                    ? moment(negocio?.tramite_padre[0]?.created_at).format("YYYY/MM/DD")
                                    : "N/D"
                            }`
                        }
                    </p>
                    <p>
                        <b>Inicio de operaciones: </b>
                        {moment(negocio.fecha_inicio_operaciones).format(
                            "YYYY/MM/DD"
                        )}
                    </p>
                    <p>
                        <b>Impacto: </b>
                        {negocio.impacto_giro_comercial.replace(/_/g, " ")}
                    </p>
                    <p>
                        <b>Sector: </b> {negocio.sector}
                    </p>
                    <p>
                        <b>Superficie (m^2): </b>
                        {negocio.superficie_m2}
                    </p>
                    <p>
                        <b>Cajones de estacionamiento: </b>
                        {negocio.cajones_estacionamiento}
                    </p>
                    <p>
                        <b>Tamaño Empresa: </b>
                        {negocio.tamano_empresa}
                    </p>
                </div>
            )}
        </>
    );
}
