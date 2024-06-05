import React, { useState } from "react";
import { Link } from "react-router-dom";
import NegocioForm from "./components/Negocio/NegocioForm";
import { Modal, Tabs } from "antd";
import Direccion from "./components/Direccion/Direccion";
import "./styles/CrudNegocioStyles.scss";
import { EditOutlined } from "@ant-design/icons";

export default function CrudNegocio({ negocio }) {
    const [isModalOpen, setIsModelOpen] = useState(false);
    const items = [
        {
            key: "1",
            label: `Información general`,
            children: <NegocioForm negocio={negocio} />,
        },
        {
            key: "2",
            label: `Dirección`,
            children: <Direccion direccionId={negocio?.direccion_id} />,
            disabled: negocio?.validado_por !== 0,
        },
    ];
    return (
        <>
            <Link onClick={() => setIsModelOpen(true)} title="Editar Negocio"><EditOutlined style={{ fontSize: 16 }} /></Link>
            <Modal
                open={isModalOpen}
                title={"Actualizar información del negocio"}
                onCancel={() => setIsModelOpen(false)}
                width={"70%"}
                footer={<></>}
            >
                <p>
                    Solo la siguiente información se puede actualizar del negocio.
                </p>

                <Tabs
                    className="crud-negocio-layout"
                    defaultActiveKey="1"
                    items={items}
                />
            </Modal>
        </>
    );
}
