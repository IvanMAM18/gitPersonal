import React, { useEffect, useState } from 'react'
import { Timeline, Tag, message } from 'antd'
import axios from 'axios'
import { CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons'
import status from '../../utils/statuses'
import moment from 'moment'

const estados = [null, 'Enviado', 'Aprobado', 'Rechazado', 'Enviado']

const getDot = archivo => {
  if (archivo) {
    return <CheckCircleOutlined style={{color: '#4BBF39'}}/>
  }
  return <ClockCircleOutlined style={{color: 'lightgray'}}/>
}

function EntidadRevision (props) {
  const [revision, setRevision] = useState(null)

  useEffect(() => {
    // seteamos la revision incompleta que venía desde la tabla
    setRevision(props.revision)
    axios.get('/app/comercio-admin/detalles-revision/' + props.revision.id)
      .then(({data}) => {
        // aquí recuperamos y actualizamos la info completa, incluye los requisitos y archivos
        setRevision(data)
      })
  }, [])

  if (!revision) {
    return null
  }

  return (
    <div>
      <h5>{ revision.entidad.nombre }</h5>
      <br/>
      {
        props.revision.condicionantes_revision.length
          ? <i><b>Condicionantes</b></i>
          : <i style={{color:'gray'}}><b>No se solicitaron condicionantes</b></i>
      }
      <br /><br />
      <ul>
        {
          props.revision.condicionantes_revision.map(cr => {
            return (
              <li>{cr.condicionante.descripcion}</li>
            )
          })
        }
      </ul>

      <Timeline>
        {
          revision.estados_revision.map((estado_revision, erkey) => {
            return (
              <Timeline.Item
                key={'er'+erkey}
                dot={status.iconoConColor(estado_revision.status)}>
                <div style={{display:'flex', flexDirection:'row', justifyContent:'space-between'}}>
                  <p><b>{status.format(estado_revision.status)}</b> &nbsp;&nbsp;&nbsp; {moment(estado_revision.created_at).format('YYYY-MM-DD HH:mm')}</p>
                   {
                    erkey !== 0 &&
                    <p style={{color:'gray'}}>
                      {estado_revision.revisor?.nombre} {estado_revision.revisor?.apellido_pat[0]}.
                    </p>
                  }
                  
                </div>
                <p>{estado_revision.observaciones || 'Revisión sin observaciones'}</p>
                <br/>
                <br/>
                <br/>
                <Timeline>
                  {
                    !!estado_revision.negocio_requisitos &&
                    estado_revision.negocio_requisitos.map((requisito, reqkey) => {
                      return (
                        <Timeline.Item key={'req'+reqkey} style={{cursor:'pointer'}} dot={getDot(requisito.requisito.negocio_archivo)} onClick={() => {
                          if (!requisito.requisito.negocio_archivo) {
                            return message.error('El propietario no ha subido este requisito')
                          }
                          window.open('/' + requisito.requisito.negocio_archivo.archivo_path)
                        }}>
                          { requisito.requisito.descripcion }
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
  )
}

export default EntidadRevision
