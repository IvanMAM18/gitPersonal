import React, {useEffect, useState} from 'react';
import status from "../utils/statuses";
import { Spin, Table, Space, Tabs, Tag, Button, Divider, Modal, Timeline, Upload } from "antd";
import { CloudDownloadOutlined, UploadOutlined } from "@ant-design/icons";
import RequisitoUpload from './RequisitoUpload';
import RequisitoTexto from './RequisitoTexto';

function RequisitoListItem({requisito, revisionStatus, estadoRevisionId, reload}) {
    let esImagen;
    const tipoRequisito = requisito.requisito.tipo;
    const esArchivo = tipoRequisito == 'ARCHIVO';
    const esTexto = tipoRequisito == 'TEXTO';
    const requisitoSubido = requisito.requisito.negocio_archivo;

    if(esArchivo && requisitoSubido) {
        const path = requisito.requisito.negocio_archivo.archivo_path.toLowerCase();
        esImagen = path.endsWith("jpg") || path.endsWith("png");
    }

    return (
        <div
            className="sare--list-item"
            key={
                "requisito" +
                requisito.id
            }
        >
            { 
                esArchivo && requisitoSubido && esImagen && (
                    <Image
                        width={100}
                        height={100}
                        src={
                            "/" +
                            requisito
                                .requisito
                                .negocio_archivo
                                .archivo_path
                        }
                    />
                )
            }
            {
                esArchivo && requisitoSubido && !esImagen && (
                    <a
                        href={
                            "/" + requisito
                                .requisito
                                .negocio_archivo
                                .archivo_path
                        }
                        target="_blank"
                    >
                        VER
                        DOCUMENTO
                    </a>
                )
            }
            {
                esArchivo && !requisitoSubido && (
                    <Tag>N/D</Tag>
                )
            }
            {
                esTexto && (
                    <Tag>{
                            requisito.valor ? 
                                requisito.valor : 
                                'N/D'
                        }</Tag>
                )
            }

            <Tag
                color={status.color(
                    requisito.status
                )}
            >
                <span
                    style={{
                        fontSize: 15,
                    }}
                >
                    {status.icono(
                        requisito.status
                    )}
                    &nbsp;
                    {
                        requisito.status
                    }
                </span>
            </Tag>

            <h6>
                {
                    requisito
                        .requisito
                        .descripcion
                }
            </h6>
            
            {
                esArchivo && (
                    <RequisitoUpload 
                        requisito={requisito} 
                        revisionStatus={revisionStatus} 
                        estadoRevisionId={estadoRevisionId}
                        reload={reload}
                    />
                )
            }

            {
                esTexto && (
                    <RequisitoTexto 
                        requisito={requisito} 
                        revisionStatus={revisionStatus} 
                        estadoRevisionId={estadoRevisionId}
                        reload={reload}
                    />
                )
            }
        </div>
    );
}

export default RequisitoListItem;