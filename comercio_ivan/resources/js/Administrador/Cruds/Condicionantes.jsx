import { Space, Tag } from "antd";
import { useEffect, useState } from "react";
import useGetListaEntidadesRevisoras from "../../utils/hooks/useGetListaEntidadesRevisoras";
import CrudView from "./CrudView";

export default function Condicionantes() {
    const [entidadesRevisoras, getEntidadesRevisoras] =
        useGetListaEntidadesRevisoras();
    const [renderCrudView, setRenderCrudView] = useState(false);

    useEffect(() => {
        getEntidadesRevisoras();
    }, []);

    useEffect(() => {
        if (entidadesRevisoras.length > 0) {
            setRenderCrudView(true);
        }
    }, [entidadesRevisoras]);
    const sEntidadesRevisorasColumns = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "Nombre",
            dataIndex: "nombre",
            key: "nombre",
        },
        {
            title: "Descripción",
            dataIndex: "descripcion",
            key: "descripcion",
        },
        {
            title: "Entidades revisoras",
            dataIndex: "entidades_revisoras",
            key: "entidades_revisoras",
            render: (text, record) => (
                <Space>
                    {record?.entidades_revisoras.map((entidadRevisora) => (
                        <Tag key={entidadRevisora.id}>
                            {entidadRevisora.nombre}
                        </Tag>
                    ))}
                </Space>
            ),
        },
    ];

    const sEntidadesRevisorasFormFields = [
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
            name: "descripcion",
            label: "Descripción",
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
            name: "entidades_revisoras",
            label: "Entidad revisora",
            value: [],
            type: "multiselect",
            disabled: false,
            options: [...entidadesRevisoras],
            rules: [
                {
                    required: true,
                    message: "Este campo es requerido!",
                },
            ],
        },
    ];

    return (
        renderCrudView === true && (
            <CrudView
                pageTitle="Condicionantes"
                modelo="condicionantes"
                columns={sEntidadesRevisorasColumns}
                formFields={sEntidadesRevisorasFormFields}
                key="condicionante"
            />
        )
    );
}
