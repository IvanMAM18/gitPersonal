import React from 'react'
import { EditOutlined } from "@ant-design/icons";
import {
    Button,
    Popover,
    Tag,
} from "antd";

export default function GirosColumn({ giros, negocio, statusDeUsoDeSueloDeNegocio, abrirEditorDeGirosNegocioModal }) {
    const getGirosElement = (giros, negocio, statusDeUsoDeSueloDeNegocio, abrirEditorDeGirosNegocioModal) => (<>
        {
            window?.user?.role != "ComercioAdminVisor" ? (
                <Button
                    disabled={statusDeUsoDeSueloDeNegocio(
                        negocio
                    )}
                    size="small"
                    icon={<EditOutlined />}
                    type="primary"
                    onClick={() => {
                        abrirEditorDeGirosNegocioModal(
                            negocio.id
                        );
                    }}
                />
            ) : null
        }

        {giros?.map((giro, id) => (
            <Popover
                key={"gc" + id}
                placement="top"
                title={giro?.tipo?.replace(
                    /_/g,
                    " "
                )}
                content={giro?.descripcion}
                trigger="click"
            >
                <Tag style={{ whiteSpace: "break-spaces" }}>{giro?.nombre}</Tag>
            </Popover>
        )
        )}
    </>)
    return (
        <>{getGirosElement(giros, negocio, statusDeUsoDeSueloDeNegocio, abrirEditorDeGirosNegocioModal)}</>
    )
}
