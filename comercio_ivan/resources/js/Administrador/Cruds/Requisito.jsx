import { useEffect, useState, useRef } from "react";
import { Space, Tag, Input, Button  } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import useGetListaEntidadesRevisoras from "../../utils/hooks/useGetListaEntidadesRevisoras";
import CrudView from "./CrudView";

export default function Requisito() {
    const [entidadesRevisoras, getEntidadesRevisoras] =
        useGetListaEntidadesRevisoras();
    const [renderCrudView, setRenderCrudView] = useState(false);
    const searchInput = useRef(null);
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");

    useEffect(() => {
        getEntidadesRevisoras();
    }, []);

    useEffect(() => {
        if (entidadesRevisoras.length > 0) {
            setRenderCrudView(true);
        }
    }, [entidadesRevisoras]);

    
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText("");
    };

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
    const getColumnSearchPropsER = (dataIndex) => ({
        filterDropdown: ({
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
            close,
        }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <Input
                    ref={searchInput}
                    placeholder={`Buscar ${dataIndex}`}
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
                        onClick={() =>
                            clearFilters && handleReset(clearFilters)
                        }
                        size="small"
                        style={{
                            width: 110,
                        }}
                    >
                        Restablecer
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
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        Cerrar
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
        onFilter: (value, record) => {
           
            console.log(value, record)
            if (record[dataIndex] && typeof record[dataIndex] !== 'undefined') {
                const entidad_revisora = entidadesRevisoras.filter((entidadRevisora) => entidadRevisora?.nombre.toLowerCase().includes(value.toLowerCase()));
                return   entidad_revisora[0]?.id === record?.entidades_revisoras[0]?.id;
            } else {
                if(value.toLowerCase()==="no asignada")
                return record[dataIndex] ===null
              return false;
            }
          },
            
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (record) => {
            const entidad_revisora = entidadesRevisoras.filter(
                (entidadRevisora) => entidadRevisora?.id === record
            );
            return (
                <span>{entidad_revisora[0]?.nombre ?? "No asignada"}</span>
            );
        },
    });
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
            ...getColumnSearchProps("nombre"),
        },
        {
            title: "Descripción",
            dataIndex: "descripcion",
            key: "descripcion",
        },
        {
            title: "Tipo",
            dataIndex: "tipo",
            key: "tipo",
        },
        {
            title: "Entidades revisoras",
            dataIndex: "entidades_revisoras",
            key: "entidades_revisoras",
               ...getColumnSearchPropsER("entidades_revisoras"),
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
            name: "tipo",
            label: "Tipo",
            value: "ARCHIVO",
            type: "select",
            disabled: false,
            options: [
                { id: "ARCHIVO", nombre: "Archivo" },
                { id: "TEXTO", nombre: "Texto" },
            ],
            rules: [
                {
                    required: true,
                    message: "Este campo es requerido!",
                },
            ],
        },
        {
            name: "expediente",
            label: "¿Forma parte del expediente digital?",
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
            name: "expediente_requerido",
            label: "¿Es requerido en el expediente digital?",
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
                pageTitle="Requisitos"
                modelo="requisitos"
                columns={sEntidadesRevisorasColumns}
                formFields={sEntidadesRevisorasFormFields}
                key="requisito"
            />
        )
    );
}
