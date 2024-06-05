import React, { useEffect, useState } from "react";
import useGetPeronasMorales from "./hooks/useGetPersonasMorales";
import { Table, Button } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { getPersonaMoralColumns } from "./Utils/Constants";
import catalogoRegimenFiscal from "../../utils/regimenFiscalList";
import { regimenes_capital } from "../../utils/ListaRegimenesCapital";
import "./styles/CrudPersonaMoralStyles.scss";
import ModalCruds from "./components/ModalCruds";
import RegistroPersonaMoral from "../../views/PersonaMoral/RegistroPersonaMoral";

export default function CrudPersonaMoralContainer() {
    const [showModal, setShowModal] = useState(false);
    const [_personaMoral, setPersonaMoral] = useState(null);
    const [personasMorales, getPersonasMorales] = useGetPeronasMorales();
    const [regimenFiscalList] = useState(
        catalogoRegimenFiscal.filter(
            (regimenFiscal) => regimenFiscal?.persona_moral === true
        )
    );
    const [regimenCapitalList] = useState(regimenes_capital);
    const [register, setRegister] = useState(false);

    useEffect(() => {
        getPersonasMorales();
    }, []);

    useEffect(() => {
        if (register === false)
            getPersonasMorales();
    }, [register]);


    const editPersonaMoral = (personaMoral) => {
        setPersonaMoral({
            data: personaMoral,
            key: "persona_moral",
            title: "Actualizar Persona Moral",
        });
        setShowModal(true);
    };

    const personaMoralButton = (personaMoral) =>
        personaMoral !== null && personaMoral !== undefined ? (
            <Button
                key={Math.random()}
                onClick={() => {
                    editPersonaMoral(personaMoral);
                }}
                icon={<EditOutlined />}
            >
                Editar Persona Moral
            </Button>
        ) : (
            <></>
        );

    return (
        <div className="persona-moral-crud">
            <div className="header_with_floating_button">
                <h1>Actualización de datos para Negocios</h1>
                <span><Button type="primary" onClick={() => { setRegister(!register) }}>{register ? "Ver Personas Morales" : "Agregar persona moral"}</Button></span>
            </div>

            {register ? <RegistroPersonaMoral setRegister={setRegister}/> : <>
                <Table
                    columns={getPersonaMoralColumns(
                        personaMoralButton,
                        regimenFiscalList,
                        regimenCapitalList
                    )}
                    dataSource={personasMorales ?? []}
                />
                <ModalCruds
                    key={_personaMoral?.data?.id ?? Math.random()}
                    showModal={showModal}
                    setShowModal={setShowModal}
                    modeloActualizar={_personaMoral}
                ></ModalCruds></>}
        </div>
    );
}
