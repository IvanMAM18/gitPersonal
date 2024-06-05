import React, { useState, useEffect } from "react";
import { Card, Image, Button, notification, Modal, Tag, Space, Table }
  from 'antd'
import axios from "axios";
import { getCreatedAtFormattedUtcToLaPazTimezone } from "../../ComercioSarePro/Utils";
import useNegocioDetallesEntidadRevisora from "../../../utils/hooks/useNegocioDetallesEntidadRevisora";
import status from "../../../utils/statuses";
import { green } from "tailwindcss/colors";



export default function DocumentosGrid({ negocio, negocioDocumentosGrid,  updateNegocioState, refreshDocumentosGrid, refreshPage}) {

  const [documentosAprobados, updateDocumentosAprobados] = useState()
  const [modalAprobarDocumento, setModalAprobarDocumento] = useState(false);
  const [modalQuitarDocumento, setModalQuitarDocumento] = useState(false);
  const [documentoElegido, setDocumentoElegido] = useState({});

  console.log("DOCUMENTOS GRID: ", refreshPage)

  const columns = [
    {
      title: 'Archivo',
      dataIndex: 'descripcion',
      key: 'descripcion',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Vista Previa',
      dataIndex: 'archivo_path',
      key: 'archivo_path',
      render: (_, record) => {
        let publicImage = {};
        if (record.archivo_path?.search(".pdf") > -1) {
          publicImage = {
            image: "/" + record.archivo_path.replace("public", "/"),
            type: "pdf"
          }
          return (
            <a href={publicImage.image} target="_blank">
              Abrir PDF
            </a>
          )
        }
        else if (record.archivo_path == undefined) {
          publicImage = {
            image: "/imagenes/file-not-found.png",
            type: "image",
            preview: false
          }
          return <span> N/D </span>
        }
        else {
          publicImage = {
            image: "/" + record.archivo_path?.replace("public", "/"),
            type: "image",
            preview: true
          }
          return (
            <Image
              width={100}
              src={publicImage.image}
              preview={publicImage.preview}
            />
          );
        }
      }
    },
    {
      title: 'Fecha de carga',
      dataIndex: 'updated_at',
      key: 'updated_at',
      render: (_, record) => <a>{

          record?.updated_at
        }</a>,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          {/* <Button type="primary" onClick={() => {
            setDocumentoElegido(record);
            setModalAprobarDocumento(true);
          }}>
            Aprobar
          </Button> */}

          {record.status !== 'APROBADO' &&
            record.status !== 'RECHAZADO' ? (
            <div className='checkbox-container'>
              {
                /*record.entidad == 'Protección civil' &&
                  record.nombre == 'Programa interno de proteccion civil' &&*/
                  record.revision_status != 'APROBADO' ? (
                  <>
                    <Button style={{ margin: 3 }} onClick={() => {
                      setDocumentoElegido(record);
                      setModalQuitarDocumento(true);
                    }}>
                      Quitar
                    </Button>
                    <Button style={{ margin: 3 }} type="primary" onClick={() => {
                      setDocumentoElegido(record);
                      setModalAprobarDocumento(true);
                    }}>
                      Aprobar
                    </Button>
                  </>
                ) : (
                  // Mostrar ambos botones en otros casos, incluyendo la validación de archivo_path
                  record.archivo_path !== undefined && record.archivo_path !== null ? (
                    <>
                     <Button style={{ margin: 3 }} onClick={() => {
                      setDocumentoElegido(record);
                      setModalQuitarDocumento(true);
                    }}>
                      Quitar
                    </Button>
                      <Button type="primary" onClick={() => {
                        setDocumentoElegido(record);
                        setModalAprobarDocumento(true);
                      }}>
                        Aprobar
                      </Button>
                    </>
                  ) : (
                    <span>N/D</span>
                  )
                )}
            </div>
          ) : (
            <span style={{color: "green", fontSize: 'bold'}}>Aprobado</span>
          )
          }
        </Space>
      ),
    },
  ];

  const documentosFromRevisions = (negocio) => {
    var requisitosArray = [];
    // console.log("negocio.revisiones: ", negocio.revisiones)
    // if (negocio.length <= 0) {
    //   return [];
    // }
    // debugger
    negocio.revisiones?.map((revisiones) => {
      revisiones?.estados_revision?.map((estado_revision) => {
        console.log("revisiones: ", revisiones)
        if (estado_revision && estado_revision.negocio_requisitos && estado_revision.negocio_requisitos.length > 0) {
          estado_revision?.negocio_requisitos?.map((negocio_requisito) => {
          console.log("NEGOCIO REQUISITO UPDATED: ", negocio_requisito?.requisito?.negocio_archivo?.created_at)
          try {
            let requisito_json = {
              // id: negocio_requisito?.requisito?.id,
              // nombre: negocio_requisito?.requisito?.nombre,
              // archivo_path:
              // negocio_requisito?.requisito?.negocio_archivo?.archivo_path,
              // requisito_id:
              // negocio_requisito?.requisito?.negocio_archivo?.requisito_id,
              // status: negocio_requisito?.status,
              // descripcion: negocio_requisito?.requisito?.descripcion,
              // accepted: false,
              // negocio_requisito_id: negocio_requisito.id,
              // revision_id: negocio_requisito.revision_id,
              // negocio_id: negocio.negocio_id,
              // revision_status: revisiones?.status,
              // entidad: revisiones?.entidad.nombre,
              id: negocio_requisito?.requisito?.id,
              nombre: negocio_requisito?.requisito?.nombre,
              archivo_path: negocio_requisito?.requisito?.negocio_archivo?.archivo_path,
              requisito_id: negocio_requisito?.requisito?.negocio_archivo?.requisito_id,
              status: negocio_requisito?.status,
              descripcion: negocio_requisito?.requisito?.descripcion,
              accepted: false,
              negocio_requisito_id: negocio_requisito.id,
              revision_id: negocio_requisito.revision_id,
              negocio_id: negocio.negocio_id,
              revision_status: revisiones?.status,
              entidad: revisiones?.entidad.nombre,
              updated_at:negocio_requisito?.requisito?.negocio_archivo?.created_at ? getCreatedAtFormattedUtcToLaPazTimezone(negocio_requisito?.requisito?.negocio_archivo?.created_at) : "N/D"
              // revision_negocio_id: requisito.revision_negocio_id,
              // revision_negocio_status: requisito.revision_negocio_
            };
            requisitosArray.push(requisito_json);
          } catch (error) {
            console.log(error)
          }
          //debugger
        });
      }
      });
    });
    return requisitosArray;
  };

  const openNotification = (type, className, message, description) => {
    notification[type]({
      duration: 3,
      className: className,
      message: message,
      description: description,
      onclose: () => {}
    });
  };

  useEffect(() => {
    updateDocumentosAprobados(documentosFromRevisions(negocio))
  }, [negocio]);

  useEffect(() => {
    if (negocioDocumentosGrid != undefined && negocioDocumentosGrid != []) {
      updateDocumentosAprobados(documentosFromRevisions(negocioDocumentosGrid))
    }
    else {
      updateDocumentosAprobados(documentosFromRevisions([]))
    }

  }, [negocioDocumentosGrid]);

  const quitarDocumento = () => {
    console.log(documentoElegido)
    let documentObject = {
      documento_id: documentoElegido.id,
      revision_id: documentoElegido.revision_id,
    }
    setModalQuitarDocumento(false)
    axios.post('/app/borrar-documento', documentObject)
      .then(res => {
        // console.log(res)
        if (res.data == 1) {
          openNotification("success", "success-notification", "Quitar Documento", "El documento se ha quitado con éxito.")
          refreshPage()
        } else {
          openNotification("error", "error-notification", "Quitar Documento", "Hubo un problema en el servidor para quitar el documento, inténtelo de nuevo.")
        }
      })
      .catch(err => {
        // console.error(err);
        openNotification("error", "error-notification", "Quitar Documento", "Hubo un problema en el servidor para quitar el documento, inténtelo de nuevo.")
      })
  }

  const rechazarDocumentos = (documento) => {
    // console.log(documento)
    axios.post("/app/rechazar-documento", documento)
      .then(res => {
        // console.log(res)
        if (res.data == 1) {
          openNotification("success", "success-notification", "Rechazar Documento", "El documento se ha rechazado con éxito.")
          refreshPage()
        } else {
          openNotification("error", "error-notification", "Rechazar Documento", "Hubo un problema en el servidor para rechazar el documento, inténtelo de nuevo.")
        }
      })
      .catch(err => {
        // console.error(err);
        openNotification("error", "error-notification", "Rechazar Documento", "Hubo un problema en el servidor para rechazar el documento, inténtelo de nuevo.")
      })
  }

  const aprobarDocumentos = () => {
    // console.log(documentoElegido)
    setModalAprobarDocumento(false)
    axios.post("/app/aprobar-documento", documentoElegido)
      .then(res => {
        // console.log(res)
        if (res.data == 1) {
          openNotification("success", "success-notification", "Aprobar Documento", "El documento se ha aprobado con éxito.")
          updateNegocioState()
          refreshPage()
        } else {
          openNotification("error", "error-notification", "Aprobar Documento", "Hubo un problema en el servidor para aprobar el documento, inténtelo de nuevo.")
        }
      })
      .catch(err => {
        // console.error(err);
        openNotification("error", "error-notification", "Aprobar Documento", "Hubo un problema en el servidor para aprobar el documento, inténtelo de nuevo.")
      })
  }

  return (
    <>
      <Table columns={columns} dataSource={documentosAprobados} />
      <Modal
        title="Aprobar Documento"
        centered
        visible={modalAprobarDocumento}
        onOk={() => aprobarDocumentos()}
        onCancel={() => {
          setModalAprobarDocumento(false);
        }}
      >
        <p>
          ¿Está seguro que desear aprobar el documento?
        </p>
      </Modal>
      <Modal
        title="Quitar Documento"
        centered
        visible={modalQuitarDocumento}
        onOk={() => quitarDocumento()}
        onCancel={() => {
          setModalQuitarDocumento(false);
        }}
      >
        <p>
          ¿Está seguro que desear quitar el documento?
        </p>
      </Modal>
    </>
    // <div className='documentos-subidos-section'>
    /*{ {
      documentosAprobados?.map(documentos => {
        let publicImage = {};
        if (documentos.archivo_path?.search(".pdf") > -1) {
          publicImage = {
            image: "/" + documentos.archivo_path.replace("public", "/"),
            type: "pdf"
          }
        }
        else if (documentos.archivo_path == undefined) {
          publicImage = {
            image: "/imagenes/file-not-found.png",
            type: "image",
            preview: false
          }
        }
        else {
          publicImage = {
            image: "/" + documentos.archivo_path?.replace("public", "/"),
            type: "image",
            preview: true
          }
        }
        return (
          <Card key={documentos.negocio_requisito_id} className="sare--card">

            {
              documentos.status == 'APROBADO'
                || documentos.status == 'RECHAZADO'
                || documentos.status == 'VISOR' ? (status.tag(documentos.status)) : (null)

            }
            <p>{documentos.descripcion}</p>
            <div className='documentosRequeridosDiv'>
              {
                publicImage.type === "pdf" ? (
                  <a href={publicImage.image} target="_blank">
                    <Image className="center-image" width={100} preview={false} src="https://upload.wikimedia.org/wikipedia/commons/3/3f/Pdf_icon_file.png" />
                  </a>
                ) : publicImage.type === "image" ? (
                  <Image
                    preview={publicImage.preview}
                    className="center-image"
                    width={100}
                    src={publicImage.image}
                  />
                ) : (
                  null
                )
              }
            </div>
            {
              documentos.status !== 'APROBADO' &&
                documentos.status !== 'RECHAZADO' ? (
                <div className='checkbox-container'>
                  {documentos.entidad == 'Protección civil' &&
                    documentos.nombre == 'Programa interno de proteccion civil' &&
                    documentos.revision_status != 'APROBADO' ? (
                    <>
                      <Button style={{margin: 3}} onClick={() => {
                          setDocumentoElegido(documentos);
                          setModalQuitarDocumento(true);
                        }}>
                        Quitar
                      </Button>
                      <Button style={{margin: 3}} type="primary" onClick={() => {
                        setDocumentoElegido(documentos);
                        setModalAprobarDocumento(true);
                        }}>
                          Aprobar
                        </Button>
                    </>
                  ) : (
                    // Mostrar ambos botones en otros casos, incluyendo la validación de archivo_path
                    documentos.archivo_path !== undefined && documentos.archivo_path !== null ? (
                      <>
                        <Button type="primary" onClick={() => {
                          setDocumentoElegido(documentos);
                          setModalAprobarDocumento(true);
                        }}>
                          Aprobar
                        </Button>
                      </>
                    ) : (
                      null
                    )
                  )}
                </div>
              ) : (
                null
              )
            }

          </Card>
        )
      })
    }
  }*/

  )
}
