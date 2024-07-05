import React, { useEffect, useState } from 'react'
import {Timeline, Tag, message, Modal} from 'antd'
import axios from 'axios'
import { CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons'
import status from '../../utils/statuses'
import { getCreatedAtFormattedUtcToLaPazTimezone } from '@/views/ComercioSarePro/Utils'
import moment from "moment";

const estados = [null, 'Enviado', 'Aprobado', 'Rechazado', 'Enviado']

const getDot = archivo => {
    if (archivo) {
        return <CheckCircleOutlined style={{color: '#4BBF39'}}/>
    }
    return <ClockCircleOutlined style={{color: 'lightgray'}}/>
}

function EntidadRevisionModal ({revision, onClose}) {

    const [detalles, setDetalles] = useState(null)

    useEffect(() => fetchDetallesRevision(), [])

    const fetchDetallesRevision = () => {
        axios.get('/app/comercio-admin/detalles-revision/' + revision.id)
            .then((response) => {
                setDetalles(response.data)
            })
            .catch(errors => {
                console.log(errors)
                setDetalles(null)
            })
    }

    const onTimelineItemClick = (requisito) => {
        if (!requisito.requisito.negocio_archivo) {
            message.error('El propietario no ha subido este requisito')
        }
        window.open('/' + requisito.requisito.negocio_archivo.archivo_path)
    }

    const toDate = (date) => {
        return moment(date).format('D \\d\\e MMMM \\d\\e\\l YYYY')
    }

    return (
        <>
            {detalles &&
            <Modal
                destroyOnClose
                onCancel={() => onClose()}
                open={revision}
                footer={null}>
                <div>
                    <h5>{detalles.revision.entidad.nombre}</h5>
                    <br/>
                    {
                        detalles.revision.condicionantes_revision.length
                            ? <i><b>Condicionantes:</b></i>
                            : <i style={{color: 'gray'}}><b>No se solicitaron condicionantes</b></i>
                    }
                    <ul className="pl-3">
                        {detalles.revision.condicionantes_revision.map(pivot =>
                            <li>- {pivot.condicionante.descripcion}</li>
                        )}
                    </ul>

                    <hr/>

                    {detalles.aviso_entero &&
                    <div className="mb-3">
                        <div>
                            <a target="_blank" href={`/entidad-revision/avisos-enteros/${detalles.aviso_entero.id}/pdf`}>
                                Aviso Entero
                            </a> generado por <b>{detalles.servidor_publico}</b> el <b>{toDate(detalles.aviso_entero.created_at)}</b>.
                        </div>
                        <hr/>
                    </div>
                    }

                    <Timeline className="mt-4">
                        {
                            detalles.revision.estados_revision.map((estado_revision, erkey) => {
                                return (
                                    <Timeline.Item key={'er' + erkey} dot={status.iconoConColor(estado_revision.status)}>
                                        <div className="flex justify-between">
                                            <p>
                                                <b>{status.format(estado_revision.status)}:</b> {moment(estado_revision.created_at).format('YYYY-MM-DD HH:mm')}
                                            </p>
                                            {erkey !== 0 &&
                                            <p style={{color: 'gray'}}>
                                                {estado_revision.revisor.nombre} {estado_revision.revisor.apellido_pat[0]}.
                                            </p>
                                            }
                                        </div>

                                        <p>{estado_revision.observaciones || 'Revisión sin observaciones'}</p>

                                        <Timeline>
                                            {!!estado_revision.negocio_requisitos && estado_revision.negocio_requisitos.map((requisito, reqkey) => {
                                                return (
                                                    <Timeline.Item key={'req' + reqkey}
                                                                   className="cursor-pointer"
                                                                   dot={getDot(requisito.requisito.negocio_archivo)}
                                                                   onClick={() => onTimelineItemClick(requisito)}>
                                                        {requisito.requisito.descripcion}
                                                        {requisito.requisito.negocio_archivo != null &&
                                                            <span> - <b>{toDate(requisito.requisito.negocio_archivo.created_at)}</b></span>
                                                        }
                                                    </Timeline.Item>
                                                )
                                            })
                                            }
                                        </Timeline>
                                    </Timeline.Item>
                                )
                            })
                        }
                    </Timeline>

                </div>
            </Modal>
            }
        </>
    )
}

export default EntidadRevisionModal
