import React, {useEffect, useState} from 'react';
import status from "../utils/statuses";
import { Spin, Table, Space, Tabs, Tag, Button, Divider, Modal, Timeline, Upload } from "antd";
import { CloudDownloadOutlined, UploadOutlined } from "@ant-design/icons";

function RequisitoUpload({requisito, revisionStatus, estadoRevisionId}) {
    const uploadProps = {
        accept: "application/pdf,img/png,img/jpg,img/jpeg",
        name: requisito.requisito.codigo,
        action:
            "/app/file-negocio-profile-update/" +
            requisito.requisito.codigo,
        data: {
            _token: document.head.querySelector('meta[name="csrf-token"]').content ?? window.csrf,
            filename: requisito.requisito.codigo,
            estado_revision_id: estadoRevisionId,
            // negocio_id: negocio.id,
        },
        onChange(info) {
            if (
                info.file.status !==
                "uploading"
            ) {
            }
            if (
                info.file.status ===
                "done"
            ) {
                reload();
            } else if (
                info.file.status ===
                "error"
            ) {
                message.error(
                    `${info.file.name} file upload failed.`
                );
            }
        },
    };

    return (
        <Upload
            {...uploadProps}
        >
            <Button>
                <UploadOutlined />
                {!!requisito.requisito.negocio_archivo ? "Resubir" : "Subir requisito"}
            </Button>
            <br></br>
            {
                (revisionStatus === status.APROBADO || requisito.status === status.APROBADO) &&
                <small>
                    Aprobada
                </small>
            }
        </Upload>
    );
}

export default RequisitoUpload;
