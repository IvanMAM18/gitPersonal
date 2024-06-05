import { SmileOutlined } from '@ant-design/icons';
import { Timeline, Tag } from 'antd';
import React from 'react';
import status from '../../../utils/statuses';
import moment from "moment";
const d = (date) => moment(date).format("DD/MM/YYYY - HH:mm:SS a");

export default function ObservacionesTimeline({ observacionesHistorial }) {
    console.log({ observacionesHistorial });
    return (
        <Timeline className='observaciones-timeline'>
            {
                observacionesHistorial.map(observacion => {
                    return (
                        <Timeline.Item dot={status.iconoConColor(
                            observacion.status
                        )} color="red">
                            <p><Tag color={status.color(observacion.status)}>
                                Estatus: {observacion.status}</Tag></p>

                            {observacion.observacion ? (
                                <p>
                                    <strong>Observación: </strong><span style={{ color: "blue" }}><i>{observacion.observacion}</i></span>
                                </p>
                            ) : (
                                <p style={{ color: "gray" }}>
                                    Revisión sin observaciones
                                </p>
                            )}
                            <p><strong>Fecha: </strong>{d(observacion.created_at)} <strong>Revisor:</strong> {observacion?.nombre_revisor ?? "NA"}</p>
                            {
                                observacion.negociosRequisitosArray != [] ? (
                                    <small>
                                        Requisitos solicitados
                                        <br />
                                    </small>

                                ) : (
                                    <small style={{ color: "gray" }}>
                                        No se solicitaron requisitos
                                        <br />
                                    </small>
                                )
                            }
                            <ul>
                                {
                                    observacion.negociosRequisitosArray?.map(negocio_requisito => {
                                        return (
                                            // <p>{negocio_requisito.nombre_requisito}</p>
                                            <li
                                                key={
                                                    "nr" + negocio_requisito.id
                                                }
                                            >
                                                <Tag
                                                    color={status.color(
                                                        negocio_requisito.status_requisito
                                                    )}
                                                >
                                                    {status.icono(
                                                        negocio_requisito.status_requisito
                                                    )}{" "}
                                                    ·{" "}
                                                    {
                                                        negocio_requisito.status_requisito
                                                    }{" "}
                                                    --{" "}
                                                    {
                                                        negocio_requisito.nombre_requisito
                                                    }
                                                </Tag>
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                        </Timeline.Item>
                    )
                })
            }
        </Timeline>
    )
}