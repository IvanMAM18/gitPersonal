import { SearchOutlined, FilterFilled } from "@ant-design/icons";
import {
    Button,
    Divider,
    Input,
    Modal,
    Popover,
    Space,
    Table,
    Tag,
    Radio,
} from "antd";
import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import status from "../../utils/statuses";
import NegocioDetallesModal from "../components/NegocioDetallesModal";
import RolesRouter from "../RolesRouter";
import EditorGirosModal from "./EditorGirosNegocioModal";
import EntidadRevision from "./EntidadRevision";

function statusDeUsoDeSueloDeNegocio(negocio) {
    const ultimoStatusDeRevision = negocio.revisiones.find(
        (revision) => revision.entidad.nombre === "Uso de suelo"
    ).status;
    return (
        ultimoStatusDeRevision === status.VISTO_BUENO ||
        ultimoStatusDeRevision === status.APROBADO
    );
}

function ComercioAdminBusquedaNegocio(props) {
    const [cargando,setCargando] = useState(false);
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
    const [modalNegocioDetallesAbierto, setModalNegocioDetallesAbierto] =
        useState(false);
    const [negocioSeleccionado, setNegocioSeleccionado] = useState(null);
    const [negocioModalGiros, setNegocioModalGiros] = useState(null);

    const [dataTableFilters, setDataTableFilters] = useState({
        id: '',
        alcohol: null,
        negocio: '',
        impacto: null,
        validado_por: 0,
        progreso: [],
        rfc: '',
        clave_catastral: '',
    });

    // search menu


    const navigate = useNavigate()

    const searchInput = useRef(null);

    useEffect(()=>{
        if(pagination.pageSize != pageSize) {
            getRevisionesActivas(1, pageSize);
        }
        if(pagination.current != currentPage) {
            getRevisionesActivas(currentPage, pageSize);
        }

    }, [currentPage,pageSize]);

    useEffect(() => {
        if(dataTableFilters && pagination) {
            getRevisionesActivas()
        }
    }, [dataTableFilters])

    function getRevisionesActivas(currentPage = null, pageSize = null)
    {
        currentPage = currentPage || pagination.current;
        pageSize = pageSize || pagination.pageSize;
        setCargando(true);
        axios
            .get("/app/comercio-admin/busqueda-negocios-en-revision", { params: {
                page: currentPage,
                validado_por: 0,
                per_page: pageSize,
                ...dataTableFilters,
            }})
            .then(response => {
                console.log('paginatedData', response)
                const paginatedData = response.data
                const { data, total, current_page } = paginatedData;
                setPagination({...pagination, total, pageSize, current: current_page});
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

    const getColumnSearchRfcProps = (dataIndex) => ({
        filterDropdown: ({
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
        }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={searchInput}
                    placeholder="RFC"
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
                                rfc: selectedKeys.length ? selectedKeys[0] : ''
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
                                    rfc: selectedKeys.length ? selectedKeys[0] : ''
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
                                rfc: selectedKeys.length ? selectedKeys[0] : ''
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

    const getColumnSearchClaveCatastralProps = (dataIndex) => ({
        filterDropdown: ({
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
        }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={searchInput}
                    placeholder="Clave catastral"
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
                                clave_catastral: selectedKeys.length ? selectedKeys[0] : ''
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
                                    clave_catastral: selectedKeys.length ? selectedKeys[0] : ''
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
                                clave_catastral: selectedKeys.length ? selectedKeys[0] : ''
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

    const openModal = (revision) => {
        if (!revision) {
            return setModalVisible(false);
        }
        setCargando(true);

        axios
            .get("/app/comercio-admin/negocios/" + revision.negocio_id)
            .then(({data: negocio}) => {
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
            .then(({data: negocio}) => {
                setNegocioSeleccionado(negocio);
                setModalNegocioDetallesAbierto(true);
            })
            .finally(() => {
                setCargando(false);
            });
    };

    return (
        <div style={{ backgroundColor: "white", padding: "15px" }}>
            <RolesRouter />
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}>
                <h2>Búsqueda de Negocios en trámite</h2>
            </div>
            <Table
                loading={cargando}
                bordered
                rowKey={'id'}
                onChange={({current, pageSize}) => {
                    setCurrentPage(current);
                    setPageSize(pageSize);
                }}
                onShowSizeChange={(current, size) => {}}
                pagination={pagination}
                columns={[
                    {
                        title: "TRÁMITE ID ACTUAL",
                        dataIndex: "tramite_padre_id",
                        key: "tramite_padre_id",
                        sorter: (a, b) => {
                            const tramite_a = a.tramite_comercio_padre?.tramite?.id || 0;
                            const tramite_b = b.tramite_comercio_padre?.tramite?.id || 0;
                            return tramite_a < tramite_b ? 1 : 0;
                        },
                        sortDirections: ["descend", "ascend"],
                        ...getColumnSearchIDProps("revisiones"),
                        render(_, negocio) {
                            return (
                                <b>{negocio.tramite_comercio_padre?.tramite?.id || 0}</b>
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
                            return (
                                <>
                                    <a onClick={() => openNegocioDetallesModal(negocio)}>{nombre_del_negocio}</a>
                                </>
                            );
                        },
                        width: 250,
                        fixed: 'left'
                    },
                    {
                        title: "RFC",
                        dataIndex: "rfc",
                        key: "rfc",
                        ...getColumnSearchRfcProps(),
                        render(rfc) {
                            return <p>{rfc}</p>;
                        },
                        width: 120,
                    },
                    {
                        title: "Clave Catastral",
                        dataIndex: "clave_catastral",
                        key: "clave_catastral",
                        ...getColumnSearchClaveCatastralProps(),
                        render(clave_catastral) {
                            return <p>{clave_catastral}</p>;
                        },
                        width: 120,
                    },
                    {
                        title: "Giros",
                        dataIndex: "giro_comercial",
                        key: "giro_comercial",
                        render(giros, negocio) {
                            return (
                                <>
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
                                                <Tag style={{whiteSpace: "break-spaces"}}>{giro.nombre}</Tag>
                                            </Popover>
                                        );
                                    })}
                                </>
                            );
                        },
                        width: 600,
                    },
                    {
                        title: "Acciones",
                        dataIndex: "actions",
                        key: "actions",
                        ...getColumnSearchValidadoProps(),
                        render: (_, negocio) => {
                            return (
                                <>
                                    <Button
                                        type="primary"
                                        target="_blank"
                                        href={'/app/comercio-admin/negocio/' + negocio.id+'/2024'}>
                                        VER DETALLES
                                    </Button>
                                </>
                            );
                        },
                        width: 120,
                    },
                ]}
                dataSource={revisionesActivas}
                // scroll={{x:2800}}
            ></Table>

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
        </div>
    );
}

export default ComercioAdminBusquedaNegocio;
