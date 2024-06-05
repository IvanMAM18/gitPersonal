import React, { useEffect, useState } from "react";
import useGetNegocios from "./hooks/useGetNegocios";
import { Table, Button } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { getNegocioColumns } from "./Utils/Constants";
import ModalCruds from "./components/ModalCruds";

export default function CrudNegocio() {
    const [showModal, setShowModal] = useState(false);
    const [personaMoral, setPersonaMoral] = useState(false);
    const [negociosAdmin, getNegociosAdmin] = useGetNegocios();
    const [negociosUser, getNegociosUser] = useGetNegocios();

    useEffect(() => {
        getNegociosAdmin("admin");
        getNegociosUser("user");
    }, []);

    const editPersonaMoral = (personaMoral) => {
        setPersonaMoral(personaMoral);
        setShowModal(true);
    };

    const getPersonaMoral = (negocio) =>
        negocio?.persona_moral !== null && negocio?.persona_moral !== undefined
            ? negocio?.persona_moral
            : null;

    const personaMoralButton = (negocio) =>
        negocio?.persona_moral !== null &&
        negocio?.persona_moral !== undefined ? (
            <>
                <Button
                    key={Math.random()}
                    icon={
                        <EditOutlined
                            onClick={() => {
                                editPersonaMoral(getPersonaMoral(negocio));
                            }}
                        />
                    }
                />
            </>
        ) : (
            <></>
        );
    return (
        <>
            <h1>Actualización de dato para Negocios</h1>
            {(negociosUser !== null || negociosAdmin !== null) && (
                <Table
                    columns={getNegocioColumns(personaMoralButton)}
                    dataSource={
                        negociosUser !== null && negociosUser.length > 0
                            ? negociosUser
                            : negociosAdmin
                    }
                />
            )}
            <ModalCruds
                key={personaMoral?.id ?? Math.random()}
                showModal={showModal}
                setShowModal={setShowModal}
                personaMoral={personaMoral}
            ></ModalCruds>
        </>
    );
}
