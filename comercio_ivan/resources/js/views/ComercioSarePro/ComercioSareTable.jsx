import { EditOutlined, SearchOutlined, FilterFilled } from "@ant-design/icons";
import {
    Button,
    Divider,
    Input,
    message,
    Modal,
    Space,
    Table,
    Radio,
    Popconfirm,
    Tag,
    Select
} from "antd";
import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import status from "../../utils/statuses";
import NegocioDetallesModal from "../components/NegocioDetallesModal";
import EditorGirosModal from "../comercio-admin/EditorGirosNegocioModal";
import EntidadRevision from "../comercio-admin/EntidadRevision";
import ProgresoRevisionesColumn from "./ProgresoRevisionesColumn";
import GirosColumn from "./GirosColumn";
import { defaultPagination, defaultTableFilters, getCreatedAtFormattedUtcToLaPazTimezone, } from "./Utils";
import routes from "../../utils/react-routes";

function statusDeUsoDeSueloDeNegocio(negocio) {
    const ultimoStatusDeRevision = negocio?.revisiones?.find(
        (revision) => revision?.entidad?.nombre === "Uso de suelo"
    )?.status;
    return (
        ultimoStatusDeRevision === status?.VISTO_BUENO ||
        ultimoStatusDeRevision === status?.APROBADO || ultimoStatusDeRevision === status?.VISOR
    );
}

function ComercioSareTable() {
    const [cargando, setCargando] = useState([false]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(50);
    const [revisionesActivas, setRevisionesActivas] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedRevision, setSelectedRevision] = useState(null);
    const [pagination, setPagination] = useState(defaultPagination);
    const [modalNegocioDetallesAbierto, setModalNegocioDetallesAbierto] =
        useState(false);
    const [negocioSeleccionado, setNegocioSeleccionado] = useState(null);
    const [negocioModalGiros, setNegocioModalGiros] = useState(null);

    const [dataTableFilters, setDataTableFilters] = useState(defaultTableFilters);

    const [searchID, setSearchID] = useState("");
    const [searchedIDColumn, setSearchedIDColumn] = useState("");

    const searchInput = useRef(null);

    const [selectedYear, setSelectedYear] = useState(2024);

    const getColorByNombre = (nombre) => {
        switch (nombre) {
            case "Licencia de funcionamiento Sare":
                return "green";
            case "Refrendo Licencia de funcionamiento Sare":
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
        const _dataTableFilters = { ...dataTableFilters, year: selectedYear };
        axios
            .get("/app/comercio-admin/negocios_en_revision_sare_pro", {
                params: {
                    page: currentPage,
                    validado_por: 0,
                    per_page: pageSize,
                    ..._dataTableFilters,
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
                console.log('error', error)
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
            console.log("response.data ERROR", response.data);
        }
    }

    async function validarNegocio(negocio) {
        console.log(negocio)

        const response = await axios.post(
            "/app/comercio-admin/validar-negocio/" + negocio.id
        );
        if (response.data.ok) {
            if ((negocio.tramites.length >= 2)) {
                message.success("Negocio validado");
            }
            else {
                createSubtramitesOrdenUno(negocio)
            }

        } else {
            message.error("Algo salió mal");
            console.log("response.data ERROR", response.data);
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
                                    console.log('setting', selectedKeys)
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

    const columns = [
        {
            title: "ID",
            dataIndex: "tramite_padre_id",
            key: "tramite_padre_id",
            defaultSortOrder: 'descend',
            sorter: (a, b) => a?.tramite_comercio_padre?.id - b?.tramite_comercio_padre?.id,
            sortDirections: ["descend", "ascend"],
            ...getColumnSearchIDProps("revisiones"),
            render: (_, negocio) => (<b>{negocio.tramite_comercio_padre?.id || 0}</b>),
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
                    <GirosColumn
                        giros={giros}
                        negocio={negocio}
                        statusDeUsoDeSueloDeNegocio={statusDeUsoDeSueloDeNegocio}
                        abrirEditorDeGirosNegocioModal={abrirEditorDeGirosNegocioModal} />
                );
            },
            width: 500,
        },
        {
            title: "Progreso",
            dataIndex: "revisiones",
            key: "revisiones",
            ...getColumnSearchProgresoProps(),
            render: (_, negocio) => negocio.revisiones.map((revision) =>
                (<ProgresoRevisionesColumn key={revision?.id} revision={revision} negocio={negocio} openModal={openModal} abrirAvisoEntero={abrirAvisoEntero} />)
            )
            ,
            width: 600
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
                                <>
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
                                </>
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
    ]

    return (
        <>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'end', alignItems: 'center', padding: '10px' }}>
                <span style={{ marginRight: '10px' }}>Año Fiscal: </span>
                <Select
                    defaultValue="2024"
                    style={{
                        width: 120,
                    }}
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
                rowKey={(record) => { return record.id }}
                onChange={({ current, pageSize }) => {
                    setCurrentPage(current);
                    setPageSize(pageSize);
                }}
                pagination={pagination}
                columns={columns}
                dataSource={revisionesActivas}
                scroll={{ x: 2800 }} />

            <Modal
                destroyOnClose
                onCancel={() => openModal()}
                open={modalVisible}
                footer={null}
            >
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
        </>
    );
}

export default ComercioSareTable;
