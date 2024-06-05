import { EditOutlined, SearchOutlined, FilterFilled } from "@ant-design/icons";
import {
    Button,
    Divider,
    Input,
    message,
    Modal,
    Popconfirm,
    Popover,
    Space,
    Table,
    Tag,
    Radio,
    Select
} from "antd";
import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import impactos from "../../utils/impactoGiroComercial";
import status from "../../utils/statuses";
import NegocioDetallesModal from "../components/NegocioDetallesModal";
import RolesRouter from "../RolesRouter";
import EditorGirosModal from "./EditorGirosNegocioModal";
import EntidadRevision from "./EntidadRevision";
import routes from "../../utils/react-routes";

//import { defaultPagination, defaultTableFilters, getCreatedAtFormattedUtcToLaPazTimezone, } from "./Utils";
import { getCreatedAtFormattedUtcToLaPazTimezone } from "../ComercioSarePro/Utils";
function statusDeUsoDeSueloDeNegocio(negocio) {
    const revisionUsoDeSuelo = negocio.revisiones.find(
        (revision) => revision.entidad.nombre === "Uso de suelo"
    );

    if (!revisionUsoDeSuelo) {
        return false;
    }

    return (
        revisionUsoDeSuelo.status === status.VISTO_BUENO ||
        revisionUsoDeSuelo.status === status.APROBADO || revisionUsoDeSuelo.status === status.VISOR
    );
}


function ComercioAdmin(props) {
    const [cargando, setCargando] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(50);
    const [revisionesActivas, setRevisionesActivas] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedRevision, setSelectedRevision] = useState(null);
    const [pagination, setPagination] = useState({
        current: 0,
        pageSize: 50,
        pageSizeOptions: ["5", "10", "20", "50", "100", "200", "500", "1000"],
        total: 0,
    });
    const [modalNegocioDetallesAbierto, setModalNegocioDetallesAbierto] = useState(false);
    const [negocioSeleccionado, setNegocioSeleccionado] = useState(null);
    const [negocioModalGiros, setNegocioModalGiros] = useState(null);

    const [dataTableFilters, setDataTableFilters] = useState({
        id: '',
        alcohol: null,
        negocio: '',
        impacto: null,
        validado_por: 0,
        tamano_empresa: '',
        progreso: [],
        year: 2024
    });

    // search menu
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");

    const [searchID, setSearchID] = useState("");
    const [searchedIDColumn, setSearchedIDColumn] = useState("");

    const [selectedYear, setSelectedYear] = useState(2024);

    const navigate = useNavigate()

    const searchInput = useRef(null);

    const getColorByNombre = (nombre) => {
        switch (nombre) {
            case "Licencia de funcionamiento":
                return "green";
            case "Refrendo Licencia de funcionamiento":
                return "purple";
            default:
                return "blue";
        }
    };

    useEffect(() => {
        if (pagination.pageSize != pageSize) {
            getRevisionesActivas(1, pageSize);
        }
        if (pagination.current != currentPage) {
            getRevisionesActivas(currentPage, pageSize);
        }
    }, [currentPage, pageSize]);

    useEffect(() => {
        if (dataTableFilters && pagination) {
            getRevisionesActivas()
        }
    }, [dataTableFilters])

    function getRevisionesActivas(currentPage = null, pageSize = null) {
        currentPage = currentPage || pagination.current;
        pageSize = pageSize || pagination.pageSize;
        setCargando(true);
        axios.get("/app/comercio-admin/negocios-en-revision", {
            params: {
                page: currentPage,
                validado_por: 0,
                per_page: pageSize,
                ...dataTableFilters,
            }
        })
            .then(response => {
                const paginatedData = response.data
                const { data, total, current_page } = paginatedData;
                setPagination({ ...pagination, total, pageSize, current: current_page });
                setCurrentPage(current_page);
                setRevisionesActivas(data);
            })
            .catch((error) => {
                // console.log('error', error)
            })
            .finally(() => {
                setCargando(false);
            });
    }

    async function createSubtramitesOrdenUno(negocio) {
        const response = await axios.post(
            "/app/create-subtramites-orden-uno", {
            catalogo_tramite_id: negocio.tramites_padres[0]?.catalogo_tramite.id,
            tramite_id: negocio.tramites_padres[0]?.id,
            negocio_id: negocio.id
        }
        );
        if (response.data.ok) {
            message.success("Negocio validado");
        } else {
            message.error("Algo salió mal");
        }
    }

    async function validarNegocio(negocio) {
        const response = await axios.post(
            "/app/comercio-admin/validar-negocio/" + negocio.id
        );
        if (response.data.ok) {
            console.log(negocio.tramites.length)
            if ((negocio.tramites.length >= 2)) {
                message.success("Negocio validado");
            }
            else {
                createSubtramitesOrdenUno(negocio)
            }

        } else {
            message.error("Algo salió mal");
        }
        getRevisionesActivas();
    }

    const getColumnSearchIDProps = (dataIndex) => ({
        filterDropdown: ({
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
        }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={searchInput}
                    placeholder="ID del Tramite"
                    value={selectedKeys[0]}
                    onChange={
                        (e) => {
                            setSelectedKeys(e.target.value ? [e.target.value] : [])
                        }
                    }
                    onPressEnter={
                        () => {
                            setDataTableFilters({
                                ...dataTableFilters,
                                id: selectedKeys.length ? selectedKeys[0] : ''
                            })
                            // handleIDSearch(selectedKeys, confirm, dataIndex)
                        }
                    }
                    style={{
                        marginBottom: 8,
                        display: "block",
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={
                            () => {
                                setDataTableFilters({
                                    ...dataTableFilters,
                                    id: selectedKeys.length ? selectedKeys[0] : ''
                                })
                                confirm();
                            }
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
                        onClick={
                            () => {
                                clearFilters()
                            }
                        }
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
                            setSearchID(selectedKeys[0]);
                            setSearchedIDColumn(dataIndex);

                            setDataTableFilters({
                                ...dataTableFilters,
                                id: selectedKeys.length ? selectedKeys[0] : ''
                            })
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
        onFilter: (value, record) => {
            return true;
        },
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) => text,
    });

    const getColumnSearchAlcoholProps = () => ({
        filterDropdown: ({
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
        }) => (
            <div>
                <div style={{ padding: 8 }}>
                    <Radio.Group
                        onChange={(e) => {
                            setSelectedKeys([e.target.value])
                        }}>
                        <Space direction="vertical">
                            <Radio value={null}>Sin especificar</Radio>
                            <Radio value={true}>Sí</Radio>
                            <Radio value={false}>No</Radio>
                        </Space>
                    </Radio.Group>
                </div>
                <Divider style={{ marginTop: 0, marginBottom: 0 }} />
                <div style={{ padding: 8 }}>
                    <Space>
                        <Button
                            type="primary"
                            onClick={
                                () => {
                                    setDataTableFilters({
                                        ...dataTableFilters,
                                        alcohol: selectedKeys.length ? selectedKeys[0] : null
                                    });
                                    if (selectedKeys.length && selectedKeys[0] == null) {
                                        clearFilters();
                                    }
                                    confirm();
                                }
                            }
                            icon={<SearchOutlined />}
                            size="small"
                            style={{
                                width: 90,
                            }}
                        >
                            Buscar
                        </Button>
                    </Space>
                </div>
            </div>
        ),
        filterIcon: (filtered) => (
            <FilterFilled
                style={{
                    color: filtered ? "#1890ff" : undefined,
                }}
            />
        ),
        onFilter: (value, record) => {
            return true;
        },
        render: (text) => text,
    });

    const getColumnSearchValidadoProps = () => ({
        filterDropdown: ({
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
        }) => (
            <div>
                <div style={{ padding: 8 }}>
                    <Radio.Group
                        onChange={(e) => {
                            setSelectedKeys(e.target.value)
                        }}>
                        <Space direction="vertical">
                            <Radio value={3}>Todo</Radio>
                            <Radio value={0}>Sin validar</Radio>
                            <Radio value={1}>Validado</Radio>
                        </Space>
                    </Radio.Group>
                </div>
                <Divider style={{ marginTop: 0, marginBottom: 0 }} />
                <div style={{ padding: 8 }}>
                    <Space>
                        <Button
                            type="primary"
                            onClick={
                                () => {
                                    setDataTableFilters({
                                        ...dataTableFilters,
                                        validado_por: selectedKeys
                                    });
                                    confirm();
                                }
                            }
                            icon={<SearchOutlined />}
                            size="small"
                            style={{
                                width: 90,
                            }}
                        >
                            Buscar
                        </Button>
                    </Space>
                </div>
            </div>
        ),
        filterIcon: (filtered) => (
            <FilterFilled
                style={{
                    color: filtered ? "#1890ff" : undefined,
                }}
            />
        ),
        onFilter: (value, record) => {
            return true;
        },
        render: (text) => text,
    });

    const getColumnSearchNameProps = () => ({
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
                    onChange={
                        (e) => {
                            setSelectedKeys(e.target.value ? [e.target.value] : [])
                        }
                    }
                    onPressEnter={
                        () => {
                            setDataTableFilters({
                                ...dataTableFilters,
                                negocio: selectedKeys.length ? selectedKeys[0] : ''
                            })
                            confirm();
                        }
                    }
                    style={{
                        marginBottom: 8,
                        display: "block",
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={
                            () => {
                                setDataTableFilters({
                                    ...dataTableFilters,
                                    negocio: selectedKeys.length ? selectedKeys[0] : ''
                                })
                                confirm();
                            }
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
                            clearFilters()
                        }
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
                            setDataTableFilters({
                                ...dataTableFilters,
                                negocio: selectedKeys.length ? selectedKeys[0] : ''
                            })
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
        onFilter: (value, record) => {
            return true;
        },
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) => text,
    });

    const getColumnSearchImpactoProps = () => ({
        filterDropdown: ({
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
        }) => (
            <div>
                <div style={{ padding: 8 }}>
                    <Radio.Group
                        onChange={(e) => {
                            setSelectedKeys([e.target.value])
                        }}>
                        <Space direction="vertical">
                            <Radio value={null}>Sin especificar</Radio>
                            <Radio value={'bajo_impacto'}>Bajo</Radio>
                            <Radio value={'mediano_alto_impacto'}>Mediano/Alto Impacto</Radio>
                        </Space>
                    </Radio.Group>
                </div>
                <Divider style={{ marginTop: 0, marginBottom: 0 }} />
                <div style={{ padding: 8 }}>
                    <Space>
                        <Button
                            type="primary"
                            onClick={
                                () => {
                                    setDataTableFilters({
                                        ...dataTableFilters,
                                        impacto: selectedKeys.length ? selectedKeys[0] : null
                                    });
                                    if (selectedKeys.length && selectedKeys[0] == null) {
                                        clearFilters();
                                    }
                                    confirm();
                                }
                            }
                            icon={<SearchOutlined />}
                            size="small"
                            style={{
                                width: 90,
                            }}
                        >
                            Buscar
                        </Button>
                    </Space>
                </div>
            </div>
        ),
        filterIcon: (filtered) => (
            <FilterFilled
                style={{
                    color: filtered ? "#1890ff" : undefined,
                }}
            />
        ),
        onFilter: (value, record) => {
            return true;
        },
    });

    const getColumnSearchProgresoProps = () => ({
        filterDropdown: ({
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
        }) => (
            <div>
                <div style={{ padding: 8 }}>
                    <Radio.Group
                        onChange={(e) => {
                            setSelectedKeys([e.target.value])
                        }}>
                        <Space direction="vertical">
                            <Radio value={null}>Sin especificar</Radio>
                            <Radio value={'VISTOS_BUENOS_1'}>VISTOS BUENOS: 1</Radio>
                            <Radio value={'VISTOS_BUENOS_2'}>VISTOS BUENOS: 2</Radio>
                            <Radio value={'VISTOS_BUENOS_3'}>VISTOS BUENOS: 3</Radio>
                            <Radio value={'VISTOS_BUENOS_4'}>VISTOS BUENOS: 4</Radio>
                            <Radio value={'PENDIENTE_PROTECCION_CIVIL'}>PENDIENTE V.B.: PROTECCIÓN CIVIL</Radio>
                            <Radio value={'PENDIENTE_MEDIO_AMBIENTE'}>PENDIENTE V.B.: MEDIO AMBIENTE</Radio>
                            <Radio value={'PENDIENTE_SERVICIOS_PUBLICOS'}>PENDIENTE V.B.: SERVICIOS PÚBLICOS</Radio>
                        </Space>
                    </Radio.Group>
                </div>
                <Divider style={{ marginTop: 0, marginBottom: 0 }} />
                <div style={{ padding: 8 }}>
                    <Space>
                        <Button
                            type="primary"
                            onClick={
                                () => {
                                    setDataTableFilters({
                                        ...dataTableFilters,
                                        progreso: selectedKeys.length ? selectedKeys[0] : null
                                    });
                                    if (selectedKeys.length && selectedKeys[0] == null) {
                                        clearFilters();
                                    }
                                    confirm();
                                }
                            }
                            icon={<SearchOutlined />}
                            size="small"
                            style={{
                                width: 90,
                            }}
                        >
                            Buscar
                        </Button>
                    </Space>
                </div>
            </div>
        ),
        filterIcon: (filtered) => (
            <FilterFilled
                style={{
                    color: filtered ? "#1890ff" : undefined,
                }}
            />
        ),
        onFilter: (value, record) => {
            return true;
        },
    });

    const abrirEditorDeGirosNegocioModal = (negocio_id) => {
        setNegocioModalGiros(negocio_id);
    };

    const openModal = (revision) => {
        if (!revision) {
            return setModalVisible(false);
        }
        setCargando(true);

        axios
            .get("/app/comercio-admin/negocios/" + revision.negocio_id)
            .then(({ data: negocio }) => {
                const _revision = negocio.revisiones.find(r => r.id == revision.id);
                setSelectedRevision(_revision);
                setModalVisible(true);
            })
            .finally(() => { setCargando(false); })
    };

    const expedirLicencia = () => {
        message.info(
            "No se puede expedir la licencia hasta que las entidades revisoras aprueben y los trámites sean pagados"
        );
    };

    const openNegocioDetallesModal = (negocio) => {
        setCargando(true);
        axios
            .get("/app/comercio-admin/negocios/" + negocio.id)
            .then(({ data: negocio }) => {
                setNegocioSeleccionado(negocio);
                setModalNegocioDetallesAbierto(true);
            })
            .finally(() => {
                setCargando(false);
            });
    };

    const abrirAvisoEntero = (avisoEntero) => {
        if (!avisoEntero) {
            message.error("Aviso de entero no encontrado.");
            return;
        }
        window.open(`/entidad-revision/avisos-enteros/${avisoEntero.id}/pdf`, '_blank', 'fullscreen=yes');
    };

    // Filtro tipo select/dropdown para la tabla de antd.
    const filtroSelect = (property, options, defaultValue = '') => ({
        filterDropdown: () => (
            <div className="p-2 flex flex-col">

                {/*Input del filtro*/}
                <Select options={options}
                        value={dataTableFilters[property]}
                        name={property}
                        className="w-full mb-2"
                        onChange={value => {
                            setDataTableFilters(prevFilters => {
                                return {
                                    ...prevFilters,
                                    [property]: value
                                };
                            })
                        }} />

                <div className="inline-flex gap-2">

                    {/*Boton para lanzar la busqueda*/}
                    <Button
                        type="primary"
                        onClick={() => getRevisionesActivas()}
                        icon={<SearchOutlined/>}
                        size="small">
                        Buscar
                    </Button>

                    {/*Boton para borrar input*/}
                    <Button
                        onClick={() => {
                            setDataTableFilters(prevFilters => {
                                return {
                                    ...prevFilters,
                                    [property]: defaultValue
                                };
                            })
                        }}
                        size="small">
                        Reiniciar
                    </Button>
                </div>

            </div>
        ),
        filterIcon: () => (
            <SearchOutlined style={{color: dataTableFilters[property] != defaultValue ? '#1890ff' : ''}}/>
        ),
        render: (text) => text,
    });

    const tableColumns = [
        {
            title: "ID",
            dataIndex: "tramite_padre_id",
            key: "tramite_padre_id",
            sorter: (a, b) => {
                const tramite_a = a.tramite_comercio_padre?.id || 0;
                const tramite_b = b.tramite_comercio_padre?.id || 0;
                return tramite_a < tramite_b ? 1 : 0;
            },
            sortDirections: ["descend", "ascend"],
            ...getColumnSearchIDProps("revisiones"),
            render(_, negocio) {
                return (
                    <b>{negocio.tramite_comercio_padre?.id || 0}</b>
                );
            },
            width: 80,
            fixed: 'left',
        },
        {
            title: "Negocio",
            dataIndex: "nombre_del_negocio",
            key: "nombre_del_negocio",
            ...getColumnSearchNameProps(),
            render(nombre_del_negocio, negocio) {
                const color = getColorByNombre(negocio?.catalogo_tramite?.nombre);
                return (
                    <>
                        {
                            (window.user.role_id == 6) ? (
                                <Button
                                    size="small"
                                    icon={<EditOutlined />}
                                    type="primary"
                                    onClick={() => {
                                        window.open(`/app/comercio-admin/negocio/` + negocio.id + `/editar/`, '_blank');
                                    }}
                                />) : null
                        }
                        <a onClick={() => openNegocioDetallesModal(negocio)}>{nombre_del_negocio}</a>
                        <br/>
                        <Tag
                            color={color}
                        >
                            {negocio?.catalogo_tramite?.nombre}
                        </Tag>
                        {/* <p><a style={{color:'blue'}} onClick={() => navigate('/app/comercio-admin/negocio/' + negocio.id)}>DETALLES ⌃</a></p> */}
                    </>
                );
            },
            width: 250,
            fixed: 'left'
        },
        {
            title: "Tamano",
            dataIndex: "tamano_empresa",
            key: "tamano_empresa",
            ...filtroSelect('tamano_empresa', [
                { label: "--", value: -1 },
                { label: "Autoempleo", value: "autoempleo" },
                { label: "Micro", value: "micro" },
                { label: "Pequeña", value: "pequeña" },
                { label: "Mediana", value: "mediana" },
                { label: "Grande", value: "grande" }
            ]),
            render(_, negocio) {
                return negocio.tamano_empresa ? (
                    <Tag color="blue">{negocio.tamano_empresa}</Tag>
                ) : (
                    <span>--</span>
                );
            },
            width: 140,
            fixed: 'left'
        },
        {
            title: "Fecha y hora de registro",
            dataIndex: "created_at",
            key: "created_at",

            render: (_, record) => {
                return getCreatedAtFormattedUtcToLaPazTimezone(record.revisiones[0] == null ? record.created_at : record.revisiones[0].created_at);
            },
            width: 200
        },
        {
            title: "Giros",
            dataIndex: "giro_comercial",
            key: "giro_comercial",
            render(giros, negocio) {
                return (
                    <>
                        {
                            window.user.role != "ComercioAdminVisor" ? (
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

                        {giros.map((giro, id) => {
                            return (
                                <Popover
                                    key={"gc" + id}
                                    placement="top"
                                    title={giro.tipo.replace(
                                        /_/g,
                                        " "
                                    )}
                                    content={giro.descripcion}
                                    trigger="click"
                                >
                                    <Tag style={{ whiteSpace: "break-spaces" }}>{giro.nombre}</Tag>
                                </Popover>
                            );
                        })}
                    </>
                );
            },
            width: 600,
        },
        {
            title: "Alcohol",
            dataIndex: "venta_alcohol",
            key: "venta_alcohol",
            ...getColumnSearchAlcoholProps(),
            render(venta_alcohol) {
                if (venta_alcohol === null) {
                    return <Tag>N/A</Tag>;
                }
                return venta_alcohol ? (
                    <Tag color="blue">Sí</Tag>
                ) : (
                    <Tag>No</Tag>
                );
            },
            width: 130,
        },
        {
            title: "Progreso",
            dataIndex: "revisiones",
            key: "revisiones",
            ...getColumnSearchProgresoProps(),
            render: (_, negocio) => {
                return negocio.revisiones.map((revision) => {
                    const tramite = negocio.tramites.find(
                        (_tramite) => {
                            const entidadRevisoraId = _tramite.catalogo_tramite?.entidad_revisora_id || 0;
                            return entidadRevisoraId === revision.entidad_revision_id;
                        }
                    );

                    if (!tramite) {
                        return (
                            <span key={"erid" + revision.id}>
                                            <span className="comercio-admin-progreso-row">
                                                <a
                                                    onClick={() =>
                                                        openModal(revision)
                                                    }
                                                >
                                                    {revision.entidad.nombre}
                                                </a>
                                                <Tag
                                                    color={status.color(
                                                        revision.status
                                                    )}
                                                >
                                                    {revision.status}
                                                </Tag>

                                                {/* <Tag color="cyan">
                                                    INF. PAGO PENDIENTE
                                                </Tag> */}
                                            </span>
                                            <Divider type="vertical" />
                                        </span>
                        );
                    }

                    const catalogoTramite =
                        tramite.catalogo_tramite;

                    const avisoEntero = tramite.aviso_entero;

                    const estadoAvisoEntero =
                        avisoEntero?.estado ?? "PENDIENTE";

                    const avisoVigentePagado = ["VIGENTE", "PAGADO"].includes(estadoAvisoEntero)

                    return (
                        <span key={"erid" + revision.id}>
                                        <span className="comercio-admin-progreso-row">
                                            <a
                                                onClick={() =>
                                                    openModal(revision)
                                                }
                                            >
                                                {revision.entidad.nombre}
                                            </a>
                                            <Tag
                                                color={status.color(
                                                    revision.status
                                                )}
                                            >
                                                {revision.status}
                                            </Tag>

                                            {catalogoTramite.pago ? (
                                                <Tag color="gold">
                                                    Requiere pago
                                                </Tag>
                                            ) : (
                                                <Tag>No requiere pago</Tag>
                                            )}

                                            {catalogoTramite.pago ? (
                                                <Tag>
                                                    AVISO {estadoAvisoEntero}
                                                </Tag>
                                            ) : null}

                                            {avisoVigentePagado ?
                                                <Button
                                                    onClick={() => abrirAvisoEntero(tramite.aviso_entero)}
                                                    size={"small"}
                                                    type="primary"
                                                >
                                                    VER AVISO
                                                </Button> : null
                                            }
                                        </span>
                                        <Divider type="vertical" />
                                    </span>
                    );
                });
            },
        },
        {
            title: "Acciones",
            dataIndex: "actions",
            key: "actions",
            ...getColumnSearchValidadoProps(),
            render: (_, negocio) => {
                return (
                    <Space direction={"vertical"}>
                        {negocio.validado_por ? (
                            <Tag
                                style={{ width: "100%" }}
                                color="green"
                            >
                                Validado por{" "}
                                {negocio.validador.nombre}
                            </Tag>
                        ) : (
                            window.user.role != "ComercioAdminVisor" ? (
                                <Popconfirm
                                    okText="Validar"
                                    cancelText="Cancelar"
                                    title="Esta acción no se puede deshacer"
                                    onConfirm={() =>
                                        validarNegocio(negocio)
                                    }
                                    onCancel={() => { }}
                                >
                                    <Button>Validar negocio</Button>
                                </Popconfirm>

                            ) : null

                        )}

                        <Button
                            type="primary"
                            target="_blank"
                            href={'/app/comercio-admin/negocio/' + negocio.id + `/` + selectedYear}>
                            VER DETALLES
                        </Button>
                    </Space>
                );
            },
            width: 220,
        },
    ];

    return (
        <div className="bg-white p-3">
            <RolesRouter />
            <div className="flex space-between items-center">
                <h2>Negocios en trámite</h2>
            </div>

            <div className="w-full flex justify-end items-center p-3 gap-2">
                <span>Año Fiscal:</span>
                <Select
                    defaultValue="2024"
                    className="w-fit"
                    onChange={(value) => {
                        setDataTableFilters({ ...dataTableFilters, year: value });
                        setSelectedYear(value);
                    }
                    }
                    options={[
                        {
                            value: '2024',
                            label: '2024',
                        },
                        {
                            value: '2023',
                            label: '2023',
                        },
                    ]}
                />
            </div>

            <Table
                loading={cargando}
                bordered
                rowKey={'id'}
                onChange={({ current, pageSize }) => {
                    setCurrentPage(current);
                    setPageSize(pageSize);
                }}
                onShowSizeChange={(current, size) => { }}
                pagination={pagination}
                columns={tableColumns}
                dataSource={revisionesActivas}
                scroll={{ x: 2800 }}>
            </Table>

            <Modal
                destroyOnClose
                onCancel={() => openModal()}
                open={modalVisible}
                footer={null}>
                <EntidadRevision revision={selectedRevision} />
            </Modal>
            {!!negocioSeleccionado && (
                <NegocioDetallesModal
                    visible={modalNegocioDetallesAbierto}
                    onOk={() => {
                        setModalNegocioDetallesAbierto(false);
                        setNegocioSeleccionado(null);
                    }}
                    onCancel={() => {
                        setModalNegocioDetallesAbierto(false);
                        setNegocioSeleccionado(null);
                    }}
                    negocio={negocioSeleccionado}
                />
            )}
            {!!negocioModalGiros && (
                <EditorGirosModal
                    negocioId={negocioModalGiros}
                    visible={!!negocioModalGiros}
                    onCancel={() => setNegocioModalGiros(null)}
                />
            )}
        </div>
    );
}

export default ComercioAdmin;
