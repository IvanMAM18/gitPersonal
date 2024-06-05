import { Space, Tag } from "antd";
import { useEffect, useState } from "react";
import useGetListaEntidadesRevisoras from "../../utils/hooks/useGetListaEntidadesRevisoras";
import useGetListaTramites from "../../utils/hooks/useGetListaTramites";
import CrudView from "./CrudView";

export default function Conceptos() {
    const [entidadesRevisoras, getEntidadesRevisoras] =
        useGetListaEntidadesRevisoras();
    const [tramites, getTramites] =
        useGetListaTramites();

    useEffect(() => {
        getEntidadesRevisoras();
        getTramites();
    }, []);

    const conceptosColumns = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "nombre",
            dataIndex: "nombre",
            key: "nombre"
        },
        {
            title: "Entidad revisora",
            dataIndex: "entidad_revisora",
            key: "entidad_revisora",
            render: (text, record) => {
                const entidadRevisora = entidadesRevisoras.find(
                    entidadRevisora => 
                        entidadRevisora.id == record.entidad_revisora_id
                );
                return entidadRevisora ? entidadRevisora.name : 'N/A';
            },
        },
        {
            title: "Tramite",
            dataIndex: "tramite",
            key: "tramite",
            render: (text, record) => {
                const tramite = tramites.find(
                    tramite => 
                        tramite.id == record.catalogo_tramites_id
                );
                return tramite ? tramite.nombre : 'N/A';
            },
        },
    ];

    const conceptosFormFields = [
        {
            name: "id",
            label: "ID",
            value: "",
            type: "input",
            disabled: true,
            hidden: true,
            rules: [
                {
                    required: false,
                    message: "",
                },
            ],
        },
        {
            name: "nombre",
            label: "Nombre",
            value: "",
            type: "input",
            disabled: false,
            rules: [
                {
                    required: true,
                    message: "Este campo es requerido!",
                },
            ],
        },
        {
            name: "entidad_revisora_id",
            label: "Entidad revisora",
            value: null,
            type: "select",
            disabled: false,
            options: [...entidadesRevisoras],
            rules: [
                {
                    required: false,
                    message: "Este campo es requerido!",
                },
            ],
        },
        {
            name: "catalogo_tramites_id",
            label: "Tramite",
            value: null,
            type: "select",
            disabled: false,
            options: [...tramites],
            rules: [
                {
                    required: false,
                    message: "Este campo es requerido!",
                },
            ],
        },
    ];

    return (
        <CrudView
            pageTitle="Conceptos"
            modelo="conceptos"
            columns={conceptosColumns}
            formFields={conceptosFormFields}
            key="concepto"
        />
    );
}
