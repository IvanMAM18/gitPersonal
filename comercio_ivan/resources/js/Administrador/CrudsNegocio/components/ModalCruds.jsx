import { Modal } from "antd";
import React from "react";
import PersonaMoral from "./PersonaMoral";

export default function ModalCruds({
    showModal,
    setShowModal,
    modeloActualizar,
}) {
    const getCrudToDisplay = () => {
        switch (modeloActualizar?.key) {
            case "persona_moral":
                return (
                    <PersonaMoral
                        personaMoral={modeloActualizar?.data ?? null}
                        setShowModal={setShowModal}
                        key={Math.random()}
                    />
                );

            default:
                return <div>Placeholder</div>;
        }
    };

    return (
        <Modal
            title={modeloActualizar?.title}
            open={showModal}
            onCancel={() => setShowModal(false)}
            key={modeloActualizar?.id ?? Math.random()}
            onOk={() => setShowModal(false)}
            okText={"Cerrar modal"}
            footer={[<div key={Math.random()}></div>]}
            width={"70%"}
        >
            {getCrudToDisplay()}
        </Modal>
    );
}
