import React, { useEffect } from "react";
import { Image, Table}
    from 'antd'

export default function DocumentosUsuariosGrid({ documentosUsuariosRequisitos }) {

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
    ];

    return (
        <>
            <Table columns={columns} dataSource={documentosUsuariosRequisitos} />
            {/* <div className='documentos-subidos-section'>
                {
                    documentosUsuariosRequisitos?.map(documentos => {
                        let publicImage = {};
                        if (documentos.nombre === "Acta Constitutiva") {
                            publicImage = {
                                url: "/" + documentos.archivo_path.replace("public/", "storage/"),
                                type: "pdf"
                            }
                        }
                        else if (documentos.archivo_path?.search(".pdf") > -1) {
                            publicImage = {
                                url: "/" + documentos.archivo_path.replace("public", "/"),
                                type: "pdf"
                            }
                        }
                        else if (documentos.archivo_path == undefined) {
                            publicImage = {
                                url: null,
                                type: null
                            }
                        }
                        else {
                            publicImage = {
                                url: "/" + documentos.archivo_path?.replace("public", "/"),
                                type: "image"
                            }
                        }

                        return (
                            <Card key={documentos.id} className="sare--card">
                                <div className='documentosRequeridosDiv'>
                                    <p className="title">{documentos.descripcion}</p>
                                    {
                                        !!publicImage && publicImage.type === "pdf" ? (
                                            <a href={publicImage.url} target="_blank">
                                                <Image width={150} preview={false} src="https://upload.wikimedia.org/wikipedia/commons/3/3f/Pdf_icon_file.png" />
                                            </a>
                                        ) : publicImage.type === "image" ? (
                                            <Image
                                                width={150}
                                                src={publicImage.url}
                                            />
                                        ) : (
                                            <div></div>
                                        )
                                    }
                                </div>
                            </Card>
                        )
                    })
                }
            </div> */}
        </>

    )
}