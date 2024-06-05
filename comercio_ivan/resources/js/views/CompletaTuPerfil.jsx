import React, { useEffect, useState } from 'react'
import { Upload, Button, message, Row, Col, Card, Tag, Divider, Image } from 'antd'
import { CheckCircleOutlined, InfoCircleOutlined , SyncOutlined } from '@ant-design/icons'
import fileUploadHandlers from '../utils/file-upload-handlers'
import { CopyOutlined } from '@ant-design/icons';
import useRequisitos from '../utils/hooks/useRequisitos'
import usePersonasMorales from '../utils/hooks/usePersonasMorales'
import axios from 'axios';
import RolesRouter from './RolesRouter';

function getArchivoPathDeRequisito (nombreRequisito, requisitos) {
  const finalRequisito = requisitos.find(requisito => {
    // return requisito.requisito.nombre === nombreRequisito
    return requisito.requisito.codigo === nombreRequisito
  })

  if (finalRequisito) {
    return '/' + finalRequisito.archivo_path
  }

  return false
}

function CompletaTuPerfil () {

  const [fetched, setFetched] = useState(false)
  const [requisitos, setRequisitos] = useState([])
  const [tipoRequisitos, setTipoRequisitos] = useState([])
  const [personasMorales, refresh] = usePersonasMorales()

  useEffect(() => {
    axios.get('/app/requisitos')
      .then(result => {
        if (result.data.ok) {
          setRequisitos(result.data.requisitos)
          setTipoRequisitos(result.data.requisitos.map(req => req.requisito.codigo))
          // setTipoRequisitos(result.data.requisitos.map(req => req.requisito.nombre))
        }
        setFetched(true)
      })
  }, [])

  return (
    <div className="sare--container">
      <RolesRouter/>
      {/* TODO: Agregar datos de usuario no editables */}
      <h1>Expediente digital</h1>
      <Row>
        {
          fileUploadHandlers.map(element => {
            return (
              <Col xl={8} md={12} sm={24} key={element.name}>
                <Card>
                  <p>{element.dsiplayname} </p>
                  <p>
                    {
                      tipoRequisitos.includes(element.name) ? (
                        <Tag color="success"><CheckCircleOutlined/> &nbsp;Subido</Tag>
                      ) : (
                        <Tag color={fetched ? 'warning' : undefined}>
                          { fetched ? <InfoCircleOutlined/> : <SyncOutlined/> } &nbsp;
                          { fetched ? 'Pendiente' : 'Cargando...'}
                          &nbsp; {element.required ? '(requerido)' : '(opcional)'}
                        </Tag>
                      )
                    }
                    {
                      (!!getArchivoPathDeRequisito(element.name, requisitos) && getArchivoPathDeRequisito(element.name, requisitos).endsWith('.pdf')) &&
                      <a target="_blank" href={getArchivoPathDeRequisito(element.name, requisitos)}>Vista previa</a>
                    }
                  </p>
                  <Divider/>
                  {
                    (!!getArchivoPathDeRequisito(element.name, requisitos) && !getArchivoPathDeRequisito(element.name, requisitos).endsWith('.pdf')) && (
                      <Image
                        width="100%"
                        src={getArchivoPathDeRequisito(element.name, requisitos)}/>
                    )
                  }
                  <Upload.Dragger
                    name={element.name}
                    action={element.action}
                    data={{
                      _token: document.head.querySelector('meta[name="csrf-token"]').content ?? window.csrf,
                      filename: element.name,
                      tipo_usuario: 'fisica'
                    }}
                    accept="image/png, image/jpeg, image/jpg, application/pdf"
                    {...element}
                    onChange={(info) => {
                      const { status } = info.file;
                      if (status !== 'uploading') {
                        // console.log(info.file, info.fileList);
                      }
                      if (status === 'done') {
                        // console.log(requisitos, info.file.response)
                        location.reload()
                        // setRequisitos([ ...requisitos, info.file.response ])
                        // setTipoRequisitos([ ...tipoRequisitos, element.name ])

                        message.success(`Se subió ${element.name.replace(/\-/g, ' ')} correctamente`);
                      } else if (status === 'error') {
                        message.error('Carga fallida');
                      }
                    }}>
                    <p className="ant-upload-drag-icon">
                      { element.ic }
                    </p>
                    <p className="ant-upload-text">Haga click o arrastre aquí</p>
                  </Upload.Dragger>
                </Card>
              </Col>
            )
          })
        }
      </Row>
      <Divider/>
      {
        personasMorales.map(personaMoral => {
          return (
            <span key={personaMoral.id}>
              <h1>{personaMoral.razon_social} &nbsp;&nbsp;&nbsp;&nbsp; <small>{personaMoral.rfc}</small></h1>
              <Row>
                <Col xl={8} md={12} sm={24}>
                  <a href={'/' + personaMoral.acta_constitutiva_path.replace('public', 'storage')} target="_blank">Ver acta constitutiva</a>
                  <Upload.Dragger
                    name="acta_constitutiva"
                    action="/app/uploads/acta-constitutiva"
                    data={{
                      _token: document.head.querySelector('meta[name="csrf-token"]').content ?? window.csrf,
                      filename: 'acta_constitutiva',
                      tipo_usuario: 'moral',
                      persona_moral_id: personaMoral.id
                    }}
                    onChange={(info) => {
                    const { status } = info.file;
                    if (status !== 'uploading') {
                      // console.log(info.file, info.fileList);
                    }
                    if (status === 'done') {
                      const filename = info.file.response;
                      console.log(info.file.response)
                      axios.put('/app/uploads/acta-constitutiva', {
                        _token: document.head.querySelector('meta[name="csrf-token"]').content ?? window.csrf,
                        persona_moral_id: personaMoral.id,
                        new_acta_constitutiva: filename
                      })
                        .then(() => location.reload())
                      message.success(`Se subió su acta constitutiva correctamente`);
                    } else if (status === 'error') {
                      message.error('Carga fallida');
                    }
                  }}>
                    <p className="ant-upload-drag-icon"><CopyOutlined/></p>
                    <p className="ant-upload-text">Haga click o arrastre aquí para reemplazar acta constitutiva</p>
                  </Upload.Dragger>
                </Col>
              </Row>
              <p>&nbsp;</p>
              <Divider/>
            </span>
          )
        })
      }
    </div>
  );
}

export default CompletaTuPerfil;
