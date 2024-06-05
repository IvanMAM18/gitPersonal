import { useEffect, useState, useRef } from "react";
import { Button, Input, Select, Space, Table, Tag, Tabs, Typography } from "antd";
import { Link } from "react-router-dom";
import useGetSimpleListaNegocios from "../../utils/hooks/useGetSimpleListaNegocios";
import RolesRouter from "../RolesRouter";
import useGetEntidadRevisoraComercioDirectorRolId from "../../utils/hooks/useGetEntidadRevisoraComercioDirectorRolId";
import LoadingIndicator from "../../components/LoadingIndicator";
import { QrcodeOutlined, SearchOutlined } from "@ant-design/icons";
import impactos from "../../utils/impactoGiroComercial";
import ResolutivosContraloria from "./componentes/ResolutivosContraloria";
import ResolutivosPersonaAlcoholes from "./componentes/ResolutivosPersonaAlcoholes";
const { Title } = Typography;

function NegociosResolutivos() {
    const loggedUserRolId = parseInt(window?.user?.role_id ?? 0);
    const loggedEntidadRevisoraId = parseInt(
        window?.user?.entidad_revision ?? 0
    );

    const [entidadRevisoraComercioRolId, getEntidadRevisoraComercioRolId] =
        useGetEntidadRevisoraComercioDirectorRolId();
    const [negocios, getNegocios] = useGetSimpleListaNegocios();
    const [_negocios, setNegocios] = useState([]);
    const [negociosFiltradosPorAño, setNegociosFiltradosPorAño] = useState([]);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
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
                    placeholder="Nombre del negocio"
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
                        style={{ width: 90 }}
                    >
                        Reiniciar
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({ closeDropdown: false });
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

    const getColumnSearchTramiteIDProps = (dataIndex) => ({
        filterDropdown: ({
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
        }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={searchInput}
                    placeholder="Nombre del Giro Comercial"
                    value={selectedKeys[0]}
                    onChange={(e) =>
                        setSelectedKeys(e.target.value ? [e.target.value] : [])
                    }
                    onPressEnter={() => confirm()}
                    style={{
                        marginBottom: 8,
                        display: "block",
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => confirm()}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Buscar
                    </Button>
                    <Button
                        onClick={() => clearFilters()}
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
            record?.tramite_padre_id
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

    const columns = [
        {
            title: "Trámite ID",
            key: "id",
            ...getColumnSearchTramiteIDProps("id"),
            render: (text, record) => (
                <Space size="middle">{record?.tramite_padre_id}</Space>
            ),
        },
        {
            title: "Trámite",
            key: "tramite",
            filters: [
                {
                    text: "Licencia de funcionamiento",
                    value: "Licencia de funcionamiento",
                },
                {
                    text: "Refrendo Licencia de funcionamiento",
                    value: "Refrendo Licencia de funcionamiento",
                },
            ],
            onFilter: (value, record) => {
                return (
                    record?.nombre_tramite_padre?.toLowerCase() === value?.toLowerCase()
                );
            },
            render: (text, record) => (
                <Space size="middle">
                    {
                        record?.nombre_tramite_padre
                    }
                </Space>
            ),
        },
        {
            title: "Tipo Trámite",
            key: "tipo_tramite",
            render: (text, record) => (
                <Space size="middle" direction="vertical">
                    {record?.tipo_tramite}
                </Space>
            ),
        },
        {
            title: "Nombre del negocio",
            key: "nombre_del_negocio",
            ...getColumnSearchProps("nombre_del_negocio"),
            render: (text, record) => (
                <Space size="middle">{record?.nombre_del_negocio ?? ""}</Space>
            ),
        },
        {
            title: "Impacto",
            key: "impacto_giro_comercial",
            render: (text, record) => (
                <Tag style={{ marginRight: 5 }} key={Math.random()}>
                    {impactos.tag(record?.impacto_giro_comercial)}
                </Tag>
            ),
        },
        {
            title: "Estatus",
            key: "status",
            render: (text, record) => (
                <Space size="middle" direction="horizontal">
                    <Tag style={{ marginRight: 5 }} key={Math.random()}>
                        {record?.ultimo_estado ?? "NA"}
                    </Tag>
                </Space>
            ),
        },
        {
            title: "Venta alcohol",
            key: "venta_alcohol",
            filters: [
                { text: "NO", value: false },
                { text: "SÍ", value: true },
            ],
            onFilter: (value, record) => {
                return record?.venta_alcohol === value;
            },
            render: (text, record) => {
                return (
                    <Space size="middle" direction="horizontal">
                        <Tag
                            key={Math.random()}
                            color={
                                !!record?.venta_alcohol ? "green" : "volcano"
                            }
                        >
                            {!!record?.venta_alcohol ? "Sí" : "No"}
                        </Tag>
                    </Space>
                );
            },
        },
        {
            title: "N. Licencia Alcohol",
            key: "licencia_alcohol",
            render: (text, record) => {
                return (
                    <Space size="middle" direction="horizontal">
                        {!!record?.venta_alcohol
                            ? `${record?.licencia_alcohol?.licencia?.clave ??
                            "Sin asignar"
                            }`
                            : "N/A"}
                    </Space>
                );
            },
        },
        {
            title: "Resolutivo",
            key: "resolutivos",
            filters: [
                { 
                    text: "Resolutivo por revisar", 
                    value:"Resolutivo por revisar"},
                { 
                    text: "Resolutivo guardado y firmado",
                    value:  "Resolutivo guardado y firmado" ,
                },
            ],
            onFilter: (value, record) => {
                if(value === "Resolutivo por revisar"){
                    return record?.resolutivos?.length === 0;
                }   
                if(value === "Resolutivo guardado y firmado"){
                    return record?.resolutivos?.length > 0;
                }
            },
            render: (text, record) => {
                return (
                    <Space size="middle" direction="horizontal">
                        {getResolutivoStatus(record?.resolutivos)}
                    </Space>
                );
            },
        },
        {
            title: "– –",
            dataIndex: "actions",
            key: "actions",
            render: (text, record) => {
                return (
                    <Space size="middle" key={record?.id ?? Math.random()}>
                        <Link target="_blank" to={`/app/resolutivos/${record.id}`}>
                            DETALLES →
                        </Link>
                    </Space>
                );
            },
        },

        {
            width: 140,
            title: "",
            dataIndex: "id",
            key: "id",
            render: (id, record) => {
                return (
                    (window.user.entidad_revision == 5) &&
                    <Space size="middle" direction={"horizontal"}>

                        <Link onClick={() => {
                           window.open(`/negocio/${record?.id}/qr`, '_blank')
                        }}><QrcodeOutlined style={{ fontSize: '20px' }} /></Link>
                    </Space>
                );
            },
        },
    ];

    const getResolutivoStatus = (_resolutivo) => {
        switch (_resolutivo.length) {
            case 0:
                return (
                    <Tag
                        style={{ marginRight: 5 }}
                        key={Math.random()}
                        color={"volcano"}
                    >
                        Resolutivo por revisar
                    </Tag>
                );
            case 1:
                if (
                    _resolutivo?.[0]?.folio === null ||
                    _resolutivo?.[0]?.folio === ""
                ) {
                    return (
                        <Tag
                            style={{ marginRight: 5 }}
                            key={Math.random()}
                            color={"gold"}
                        >
                            Resolutivo guardado
                        </Tag>
                    );
                } else {
                    return (
                        <Tag
                            style={{ marginRight: 5 }}
                            key={Math.random()}
                            color={"green"}
                        >
                            Resolutivo guardado y firmado
                        </Tag>
                    );
                }

            default:
                return (
                    <Tag
                        style={{ marginRight: 5 }}
                        key={Math.random()}
                        color={"geekblue"}
                    >
                        Estado desconocido
                    </Tag>
                );
        }
    };

    const getRevisiones = (revisiones) => {
        return (
            revisiones?.filter(
                (revisiones) =>
                    ["ENVIADO", "EN REVISION", "RECHAZADO"].includes(
                        revisiones.status
                    ) && revisiones.entidad_revision_id != 6
            ) ?? []
        );
    };

    const getNegociosOrdenadosPorEstadoDelResolutivo = (negocios) => {
        const negociosSinResolutivo = negocios.filter(
            (negocio) => negocio?.resolutivos?.length === 0
        );
        const negociosConResolutivo = negocios.filter(
            (negocio) =>
                negocio?.resolutivos?.length > 0 &&
                (negocio?.resolutivos?.[0]?.folio === null ||
                    negocio?.resolutivos?.[0]?.folio === "")
        );
        const negociosConResolutivoFirmado = negocios.filter(
            (negocio) =>
                negocio?.resolutivos?.length > 0 &&
                negocio?.resolutivos?.[0]?.folio !== null &&
                negocio?.resolutivos?.[0]?.folio !== ""
        );
        return [
            ...negociosSinResolutivo,
            ...negociosConResolutivo,
            ...negociosConResolutivoFirmado,
        ];
    };

    useEffect(() => {
        if (negocios?.length > 0) {
            const negociosOrdenados =
                getNegociosOrdenadosPorEstadoDelResolutivo(negocios);

            if (
                loggedUserRolId === entidadRevisoraComercioRolId ||
                loggedEntidadRevisoraId === 5
            ) {
                const negociosAllApproved = negociosOrdenados.filter(
                    (negocio) => {
                        const revisiones = getRevisiones(negocio?.revisiones);
                        return revisiones.length === 0;
                    }
                );
                setNegocios(negociosAllApproved);
            } else {
                setNegocios(negociosOrdenados);
            }
        }
        else
        setNegocios([])
    }, [negocios]);

    useEffect(() => {

            setNegociosFiltradosPorAño(_negocios);

    }, [_negocios]);

    useEffect(() => {
        if (!!selectedYear) {
            getNegocios(window.user.entidad_revision, selectedYear);
            localStorage.currentYearFilter = selectedYear;
        }
    }, [selectedYear]);

    useEffect(() => {
        getEntidadRevisoraComercioRolId();
        if (loggedEntidadRevisoraId !== 6 && loggedEntidadRevisoraId !== 7)
            getNegocios(window.user.entidad_revision, selectedYear);
    }, []);

    const tabResolutivosContraloria =
        loggedEntidadRevisoraId === 7
            ? [
                {
                    key: "2",
                    label: `Personas`,
                    children: <ResolutivosContraloria />,
                },
            ]
            : [];
    const tabResolutivosAlcoholes =
        loggedEntidadRevisoraId === 6
            ? [
                {
                    key: "3",
                    label: `Personas`,
                    children: <ResolutivosPersonaAlcoholes />,
                },
            ]
            : [];
    const tableResolutivosNegocios =
        loggedEntidadRevisoraId !== 7 && loggedEntidadRevisoraId !== 6
            ? [
                {
                    key: "1",
                    label: `Negocios`,
                    children:
                        <>
                            <Space className="flex items-center">
                                <span className="font-medium uppercase">Año Fiscal</span>
                                <Select options={[2023, 2024].map(option => ({ value: option, label: `${option}` }))}
                                    onChange={setSelectedYear}
                                    defaultValue={new Date().getFullYear()}
                                    size={"middle"}
                                />
                            </Space>
                            {_negocios !== null ? (
                                <Table
                                    className="border-t border-gray-200 mt-4"
                                    dataSource={negociosFiltradosPorAño}
                                    columns={columns}
                                    pagination={{
                                        defaultPageSize: 50,
                                        showSizeChanger: true,
                                        pageSizeOptions: [
                                            "10",
                                            "50",
                                            "100",
                                            "500",
                                            "1000",
                                        ],
                                    }}
                                />
                            ) : (
                                <LoadingIndicator />
                            )}</>,
                },
            ]
            : [];

    const tabItems = [
        ...tableResolutivosNegocios,
        ...tabResolutivosContraloria,
        ...tabResolutivosAlcoholes
    ];

    return (
        <div className="resolutivos-tabs p-8">
            <RolesRouter />
            <Tabs defaultActiveKey="1" items={tabItems} className="bg-white px-3 shadow-md" />
        </div>
    );
}

export default NegociosResolutivos;
