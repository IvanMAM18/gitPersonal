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
      render: (_, record) => {
        
        const isArchivoPathValid = record.archivo_path !== undefined && record.archivo_path !== null;
        const isStatusValid = record.status !== 'APROBADO' && record.status !== 'RECHAZADO';
        const canShowAprobarButton = isArchivoPathValid ;

        return (
          <Space size="middle">
            
            {isStatusValid ? (
              <div className='checkbox-container'>
                <Button style={{ margin: 3 }} onClick={() => {
                  setDocumentoElegido(record);
                  setModalQuitarDocumento(true);
                }}>
                  Quitar
                </Button>
                {canShowAprobarButton ? (
                  <Button style={{ margin: 3 }} type="primary" onClick={() => {
                    setDocumentoElegido(record);
                    setModalAprobarDocumento(true);
                  }}>
                    Aprobar
                  </Button>
                ) : (
                  null
                )}
              </div>
            ) : (
              <span style={{ color: "green", fontWeight: 'bold' }}>Aprobado</span>
            )}
          </Space>
        );
      },
    },
  ];

  const documentosFromRevisions = (negocio) => {
    var requisitosArray = [];
    negocio.revisiones?.map((revisiones) => {
      revisiones?.estados_revision?.map((estado_revision) => {
        console.log("revisiones: ", revisiones)
        if (estado_revision && estado_revision.negocio_requisitos && estado_revision.negocio_requisitos.length > 0) {
          estado_revision?.negocio_requisitos?.map((negocio_requisito) => {
          console.log("NEGOCIO REQUISITO UPDATED: ", negocio_requisito?.requisito?.negocio_archivo?.created_at)
          try {
            let requisito_json = {
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
              updated_at: negocio_requisito?.requisito?.negocio_archivo?.created_at ? getCreatedAtFormattedUtcToLaPazTimezone(negocio_requisito?.requisito?.negocio_archivo?.created_at) : "N/D"
              
            };
            requisitosArray.push(requisito_json);
          } catch (error) {
            console.log(error)
          }
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
        if (res.data == 1) {
          openNotification("success", "success-notification", "Quitar Documento", "El documento se ha quitado con éxito.")
          refreshPage()
        } else {
          openNotification("error", "error-notification", "Quitar Documento", "Hubo un problema en el servidor para quitar el documento, inténtelo de nuevo.")
        }
      })
      .catch(err => {
        openNotification("error", "error-notification", "Quitar Documento", "Hubo un problema en el servidor para quitar el documento, inténtelo de nuevo.")
      })
  }

  const rechazarDocumentos = (documento) => {
    axios.post("/app/rechazar-documento", documento)
      .then(res => {
        if (res.data == 1) {
          openNotification("success", "success-notification", "Rechazar Documento", "El documento se ha rechazado con éxito.")
          refreshPage()
        } else {
          openNotification("error", "error-notification", "Rechazar Documento", "Hubo un problema en el servidor para rechazar el documento, inténtelo de nuevo.")
        }
      })
      .catch(err => {
        openNotification("error", "error-notification", "Rechazar Documento", "Hubo un problema en el servidor para rechazar el documento, inténtelo de nuevo.")
      })
  }

  const aprobarDocumentos = () => {
    setModalAprobarDocumento(false)
    axios.post("/app/aprobar-documento", documentoElegido)
      .then(res => {
        if (res.data == 1) {
          openNotification("success", "success-notification", "Aprobar Documento", "El documento se ha aprobado con éxito.")
          updateNegocioState()
          refreshPage()
        } else {
          openNotification("error", "error-notification", "Aprobar Documento", "Hubo un problema en el servidor para aprobar el documento, inténtelo de nuevo.")
        }
      })
      .catch(err => {
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

  )
}
