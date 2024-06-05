import { useEffect, useState, useRef } from "react";
import { Space, Tag, Input, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import useGetListaEntidadesRevisoras from "../../utils/hooks/useGetListaEntidadesRevisoras";
import CrudView from "./CrudView";

export default function CatalogoTramites() {
    const [entidadesRevisoras, getEntidadesRevisoras] =
        useGetListaEntidadesRevisoras();
    const [renderCrudView, setRenderCrudView] = useState(false);
    const searchInput = useRef(null);
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText("");
    };

    useEffect(() => {
        getEntidadesRevisoras();
    }, []);

    useEffect(() => {
        if (entidadesRevisoras.length > 0) {
            setRenderCrudView(true);
        }
    }, [entidadesRevisoras]);

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
        }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={searchInput}
                    placeholder="NOMBRE DEL TRÁMITE"
                    value={selectedKeys[0]}
                    onChange={(e) =>
                        setSelectedKeys(e.target.value ? [e.target.value] : [])
                    }
                    onPressEnter={() =>
                        handleSearch(selectedKeys, confirm, dataIndex)
                    }
                    style={{
                        marginBottom: 8,
                        display: "block",
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() =>
                            handleSearch(selectedKeys, confirm, dataIndex)
                        }
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Buscar
                    </Button>
                    <Button
                        onClick={() => handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Reiniciar
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({
                                closeDropdown: false,
                            });
                            setSearchText(selectedKeys[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filtrar
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? "#1890ff" : undefined,
                }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                .toString()
                .toLowerCase()
                .includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) => text,
    });

    const tramitesColumns = [
        {
            title: "Nombre",
            dataIndex: "nombre",
            key: "nombre",
            ...getColumnSearchProps("nombre"),
        },
        {
            title: "Descripción",
            dataIndex: "descripcion",
            key: "descripcion",
        },
        {
            title: "Enlace",
            dataIndex: "link",
            key: "link",
        },
        {
            title: "Pago",
            dataIndex: "pago",
            key: "pago",
            render: (text, record) => <Tag>{record?.pago ? "Sí" : "No"}</Tag>,
        },
        {
            title: "Resolutivo",
            dataIndex: "resolutivo",
            key: "resolutivo",
            render: (text, record) => (
                <Tag>{record?.resolutivo ? "Sí" : "No"}</Tag>
            ),
        },
        {
            title: "Tipo de Acceso",
            dataIndex: "tipo",
            key: "tipo",
            render: (text, record) => <Tag>{record?.tipo?.toUpperCase()}</Tag>,
        },
        {
            title: "Tipo de Tramite",
            dataIndex: "tipo_tramite",
            key: "tipo_tramite",
            render: (text, record) => <Tag>{record?.tipo_tramite?.toUpperCase()}</Tag>,
        },
        {
            title: "En línea",
            dataIndex: "en_linea",
            key: "en_linea",
            render: (text, record) => (
                <Tag>{record?.en_linea ? "Sí" : "No"}</Tag>
            ),
        },
        {
            title: "Entidade revisora",
            dataIndex: "departamento_id",
            key: "departamento_id",
            render: (text, record) => (
                <Space>
                    {entidadesRevisoras.filter(
                        (entidadRevisora) =>
                            entidadRevisora.id === record.departamento_id
                    )[0]?.nombre ?? ""}
                </Space>
            ),
        },
    ];
    const tramitesFormFields = [
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
                    message: "Campo requerido",
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
                    message: "Campo requerido",
                },
            ],
        },
        {
            name: "link",
            label: "Enlace",
            value: "",
            type: "input",
            disabled: false,
            rules: [
                {
                    required: true,
                    message: "Campo requerido!",
                },
            ],
        },
        {
            name: "pago",
            label: "Tiene pagos?",
            value: false,
            type: "checkbox",
            disabled: false,
            rules: [
                {
                    required: true,
                    message: "Campo requerido!",
                },
            ],
        },
        {
            name: "resolutivo",
            label: "Genera resolutivos?",
            value: false,
            type: "checkbox",
            disabled: false,
            rules: [
                {
                    required: true,
                    message: "Campo requerido!",
                },
            ],
        },
        {
            name: "tipo",
            label: "Tipo de acceso",
            value: "",
            type: "select",
            disabled: false,
            options: [
                { id: "publico", nombre: "Público" },
                { id: "interno", nombre: "Interno" },
            ],
            rules: [
                {
                    required: true,
                    message: "Campo requerido!",
                },
            ],
        },
        {
            name: "tipo_tramite",
            label: "Tipo de tramite",
            value: "",
            type: "select",
            disabled: false,
            options: [
                { id: "PERSONA", nombre: "Persona" },
                { id: "NEGOCIO", nombre: "Negocio" },
            ],
            rules: [
                {
                    required: true,
                    message: "Campo requerido!",
                },
            ],
        },
        {
            name: "en_linea",
            label: "Tramite disponible en línea",
            value: false,
            type: "checkbox",
            disabled: false,
            rules: [
                {
                    required: true,
                    message: "Campo requerido!",
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
    ];

    return (
        renderCrudView && (
            <CrudView
                pageTitle="Catálogo de Trámites"
                modelo="tramites"
                columns={tramitesColumns}
                formFields={tramitesFormFields}
                key="tramite"
            />
        )
    );
}
