import React, { useEffect, useState, useRef } from "react";
import GoogleMapReact from "google-map-react";

import { Spin, Tooltip, Modal, Tag, Popover, Button, Select, Collapse, Card, Row, Col, Input } from "antd";
const { Panel } = Collapse;
const { Search } = Input;
import { Link } from "react-router-dom";
import status from "../../utils/statuses";
import { range } from 'lodash';

import axios from "axios";
import RolesRouter from "../RolesRouter";
import DetalleHorario from "../components/ComponentesModalDetallesNegocio/DetalleHorario";
import DetalleRecoleccionBasura from "../components/ComponentesModalDetallesNegocio/DetalleRecoleccionBasura";
import DetallePropietario from "../components/ComponentesModalDetallesNegocio/DetallePropietario";
import DetallePropietarioMap from "../components/ComponentesModalDetallesNegocio/DetallePropietarioMap";
import DetalleHorarioMap from "../components/ComponentesModalDetallesNegocio/DetalleHorarioMap";
import DetalleRecoleccionBasuraMap from "../components/ComponentesModalDetallesNegocio/DetalleRecoleccionBasuraMap";

const defaultProps = {
    center: {
        lat: 24.1223922,
        lng: -110.3153547,
    },
    zoom: 13,
};

export default function MapaEntidadRevisora() {
    const currentYear = (new Date).getFullYear();
    const [refreshKey, setRefreshKey] = useState(0);
    

    const [negocios, setNegocios] = useState();
    const [negocio, setNegocio] = useState({
        nombre_del_negocio: "",
        descripcion_actividad: "",
        impacto_giro_comercial: "",
        nombre: "",
        apellido_pat: "",
        apellido_mot: "",
        venta_alcohol: "",
        foto_frontal_fachada: "",
    });
    const [isRequestingNegocio, setIsRequestingNegocio] = useState(false)
    const [loading, setLoading] = useState(true);
    const [mapObject, setMapObject] = useState();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const mapRef = useRef(null);
    const [markers, setMarkers] = useState([]);
    const [selectedYear, setSelectedYear] = useState(currentYear);

    const [filters, setFilters] = useState({
        alcohol: null,
        impacto_giro_comercial: null,
        nivel_recoleccion_basura: null,
        nombre_del_negocio: null,
        estado_aviso_entero: null,
        year: selectedYear
    })

    const aniosFiscalesDisponibles = range(2023, (currentYear + 1))

    const refresh = () => setRefreshKey(prevKey => prevKey + 1);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleApiLoaded = (map, maps) => {
        // use map and maps objects
      };

    // Función para limpiar el mapa
    const clearMarkers = () => {
        debugger
        markers.forEach((marker) => {
            marker.setMap(null); // Eliminar el marcador del mapa
        });
        refresh()
        setMarkers([])
    };

    const onSearch = (value) => {
        setLoading(true)
        let filtros = { ...filters }
        if (value =="") {
            filtros.nombre_del_negocio = null;
        } else {
            filtros.nombre_del_negocio = value;
        }
        setFilters(filtros);
        getAllNegocios(filtros)
    };

    const handleChangeImpacto = (value) => {
        setLoading(true);
        let filtros = { ...filters }
        filtros.impacto_giro_comercial = value;
        setFilters(filtros);
        getAllNegocios(filtros)
    };

    const handleChangeAlcohol = (value) => {
        setLoading(true);
        let filtros = { ...filters }
        filtros.alcohol = value;
        setFilters(filtros);
        getAllNegocios(filtros)
    };

    const handleChangeCuentaPrivada = (value) => {
        setLoading(true);
        let filtros = { ...filters }
        filtros.nivel_recoleccion_basura = value;
        setFilters(filtros);
        getAllNegocios(filtros)
    };

    const handleAvisoPagado = (value) => {
        setLoading(true);
        let filtros = { ...filters }
        filtros.estado_aviso_entero = value;
        setFilters(filtros);
        getAllNegocios(filtros)
    };

    const handleYear = (value) => {
        setLoading(true);
        let filtros = { ...filters }
        filtros.year = value;
        setFilters(filtros);
        getAllNegocios(filtros)
    };

    const getAllNegociosForMarkersId = (negocio_id, filtros) => {
        axios.post('/app/get-all-negocios-por-filtro-id/'+negocio_id, filtros)
            .then(res => {
                //clearMarkers();
                // console.log("RES DATA: ", res.data)
                setNegocio(res.data[0])
                setLoading(false);
                setIsRequestingNegocio(true)
            })
            .catch(err => {
                console.error(err);
            })
    }

    const getAllNegociosComecioAdminForMarkersId = (negocio_id, filtros) => {
        debugger
        axios.post('/app/get-all-negocios-por-filtro-id-comercio-admin/'+negocio_id, filtros)
            .then(res => {
                //clearMarkers();
                setNegocio(res.data[0])
                setLoading(false);
                setIsRequestingNegocio(true)
            })
            .catch(err => {
                console.error(err);
            })
    }

    const getAllNegociosForMarkers = (filtros) => {
        axios.post('/app/get-all-negocios-por-filtro-opt', filtros)
            .then(res => {
                //clearMarkers();
                setNegocios(res.data)
                setLoading(false);
                console.log(res.data)
            })
            .catch(err => {
                console.error(err);
            })
    }

    const getAllNegociosComecioAdminForMarkers = (filtros) => {
        debugger
        axios.post('/app/get-all-negocios-por-filtro-comercio-admin', filtros)
            .then(res => {
                //clearMarkers();
                setNegocios(res.data)
                setLoading(false);
                console.log(res.data)
            })
            .catch(err => {
                console.error(err);
            })
    }

    const getAllNegocios = (filters) => {
        if (window.user.entidad_revision == 5) {
            debugger
            getAllNegociosComecioAdminForMarkers(filters);
        }
        else {
            debugger
            getAllNegociosForMarkers(filters);
        }
    }

    const getAllNegociosById = (negocio_id, filters) => {
        console.log("getAllNegociosById: ", negocio_id, filters)
        if (window.user.entidad_revision == 5) {
            debugger
            getAllNegociosComecioAdminForMarkersId(negocio_id, filters);
        }
        else {
            debugger
            getAllNegociosForMarkersId(negocio_id, filters);
        }
    }

    useEffect(() => {
        getAllNegocios(filters)
    }, []);

    useEffect(() => {
        if (isRequestingNegocio == true) {
            console.log("isRequestingNegocio: ", isRequestingNegocio)
            showModal()
        }
    }, [negocio, isRequestingNegocio]);

    const getNegocioInfo = (negocio_id) => {
        //console.log(id)
        getAllNegociosById(negocio_id, filters)
    }
    const createMarkers = () => {
        let markersArray = [];
        
        negocios.forEach((negocio) => {

            if (negocio.direccion.latitud === null && negocio.direccion.longitude === null) {
                //console.log("TODO: get lat lng with google api");
            }
            const marker = new google.maps.Marker({
                position: {
                    lat: parseFloat(negocio.direccion.latitud),
                    lng: parseFloat(negocio.direccion.longitude),
                },
                icon: {
                    url: getIconResolutivo(negocio),
                    scaledSize: new google.maps.Size(15, 15),
                },
                title: "Nombre del negocio: " + negocio.nombre_del_negocio,
                map: mapObject,
                draggable: false,
                data: negocio,
            });
            marker.addListener("click", (negocio) => {
                console.log(marker.data)
                setNegocio(marker.data);
                // Cambio para mostrar el modal con la info que se recolecta con todo y filtros
                //showModal()

                getNegocioInfo(marker.data.id)
            });
            markersArray.push(marker);
            setMarkers(markersArray);
        });
    };

    useEffect(() => {
        if (negocios !== undefined && negocios !== null) {
            clearMarkers()
            createMarkers();
        }
    }, [negocios]);

    const getIconResolutivo = (negocio) => {
        if (negocio.venta_alcohol == true) {
            if (negocio.resolutivos.length <= 0) {
                return "/imagenes/map-icons/purple-dot.png";
            } else if (negocio.resolutivos.folio !== "") {
                return "/imagenes/map-icons/red-dot.png";
            }
        } else {
            if (negocio.resolutivos.length <= 0) {
                return "/imagenes/map-icons/orange-dot.png";
            } else if (negocio.resolutivos.folio !== "") {
                return "/imagenes/map-icons/green-dot.png";
            }
        }

    };
    return (
        <>
        <div className="w-full flex justify-end items-center p-3">

            <span className="mr-2">Año Fiscal: </span>
            <Select
            defaultValue="2024"
            className="w-24"
            onChange={(value) => {
                setSelectedYear(value);
                handleYear(value);
            }}>
                {aniosFiscalesDisponibles.map(year =>
                    <option key={year} value={year}>{year}</option>
                )}
            </Select>
            {/* <Select
                defaultValue="2024"
                className="w-24"
                onChange={(value) => {
                    setSelectedYear(value);
                    handleYear(value);
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
                /> */}
        </div>
        <div className="map-filters-entidad-revisora bg-white p-3">
            
                <div className="grid grid-cols-4 gap-5">
                    <div className="flex flex-col">
                        <label className="select-label">Nombre del Negocio</label>
                        <Search disabled={loading} allowClear enterButton="Buscar" onSearch={onSearch}/>
                    </div>
                    <div className="flex flex-col">
                        <label className="select-label">Nivel de Impacto</label>
                        <Select
                            disabled={loading}
                            className="select-map-filter"
                            title="IMPACTO"
                            defaultValue="todos"
                            onChange={handleChangeImpacto}
                            options={[
                                { value: null, label: 'Todos' },
                                { value: 'mediano_alto_impacto', label: 'Alto' },
                                { value: 'bajo_impacto', label: 'Bajo' },
                            ]}
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="select-label">Venta de Alcohol</label>
                        <Select
                            disabled={loading}
                            className="select-map-filter"
                            title="ALCOHOL"
                            defaultValue="todos"
                            onChange={handleChangeAlcohol}
                            options={[
                                { value: null, label: 'Todos' },
                                { value: true, label: 'Si' },
                                { value: false, label: 'No' },
                            ]}
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="select-label">Recolección de Basura</label>
                        <Select
                            disabled={loading}
                            className="select-map-filter"
                            title="RECOLECCIÓN DE BASURA"
                            defaultValue="todos"
                            onChange={handleChangeCuentaPrivada}
                            options={[
                                { label: "TODOS", value: null },
                                { label: "DIARIO", value: "diario" },
                                { label: "CUENTA PROPIA", value: "cuenta_propia" },
                                { label: "SERVICIO PRIVADO", value: "servicio_privado" },
                                { label: "2 VECES POR SEMANA", value: "2_veces_por_semana" },
                                { label: "3 VECES POR SEMANA", value: "3_veces_por_semana" },
                            ]}
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="select-label">Aviso Pagado</label>
                        <Select
                            disabled={loading}
                            className="select-map-filter"
                            title="AVISO PAGADO"
                            defaultValue="todos"
                            onChange={handleAvisoPagado}
                            options={[
                                { label: "TODOS", value: null},
                                { label: "NO APLICA", value: "N/A" },
                                { label: "PENDIENTE", value: "PENDIENTE" },
                                { label: "VIGENTE", value: "VIGENTE" },
                                { label: "PAGADO", value: "PAGADO" },
                                { label: "EXPIRADO", value: "EXPIRADO" }
                            ]}
                        />
                    </div>
                </div>
        </div>

        <div className="h-full w-full relative">
            <RolesRouter />

            {loading && (
                <div className="h-full flex items-center justify-center">
                    <Spin size="large" />
                </div>
            )}

            <GoogleMapReact
                bootstrapURLKeys={{
                    key: "AIzaSyAp2zsijKSTOl9BLx6CDcyNIN9KhINXTzM",
                }}
                defaultCenter={defaultProps.center}
                defaultZoom={defaultProps.zoom}
                yesIWantToUseGoogleMapApiInternals
                onGoogleApiLoaded={({ map, maps }) => {
                    setMapObject(map);
                }}
            >

            </GoogleMapReact>


            <Modal title={`Negocio: "${negocio?.nombre_del_negocio}"`} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <div>
                    {!!negocio?.giro_comercial?.length && (
                        <div style={{ marginTop: 20 }}>
                            <Collapse bordered={false}>
                                <Panel header="Giros comerciales">

                                    {/* <Divider orientation="left" plain>
                                    Giros comerciales
                                </Divider> */}
                                    {negocio?.giro_comercial?.map((gc, id) => (
                                        <Tooltip placement="top" title={gc.nombre}>
                                            <Popover
                                                key={"gc" + id}
                                                placement="top"
                                                title={gc.tipo.replace(/_/g, " ")}
                                                content={gc.descripcion}
                                                trigger="click"
                                            >
                                                <Tag className="word-break">
                                                    <b>{gc.nombre}</b>
                                                </Tag>
                                            </Popover>
                                        </Tooltip>
                                    ))}
                                </Panel>
                            </Collapse>
                        </div>
                    )}
                </div>

                <Collapse bordered={false} defaultActiveKey={['1']} style={{ marginTop: 20 }}>
                    <Panel header="Información General del negocio" key="1">
                        <p>
                            <b className="label-info">ID del negocio: </b>
                            {negocio?.tramite_padre?.[0].tramitable_id  || "N/D"}
                        </p>
                        <p>
                            <b className="label-info">ID del Trámite: </b>
                            {negocio?.tramite_padre?.[0].id || "N/D"}
                        </p>
                        <p>
                            <b className="label-info">Descripción: </b>
                            {negocio?.descripcion_actividad || "N/D"}
                        </p>
                        <p>
                            <b className="label-info">Teléfono: </b>
                            {
                                negocio?.telefono != null ? (
                                    <span>{negocio?.telefono}</span>

                                ) : (
                                    <span>N/D</span>
                                )
                            }
                        </p>
                        <p>
                            <b className="label-info">Impacto: </b>
                            {
                                negocio?.impacto_giro_comercial != null ? (
                                    negocio?.impacto_giro_comercial == "mediano_alto_impacto" ? (
                                        <Tag color="blue">Alto Impacto</Tag>
                                    ) : (
                                        <Tag color="red">Bajo Impacto</Tag>
                                    )
                                ) : (
                                    <Tag>N/D</Tag>
                                )
                            }
                        </p>
                        <p>
                            <b className="label-info">Venta del Alcohol: </b>
                            {
                                negocio?.venta_alcohol != null ? (
                                    negocio?.venta_alcohol == true ? (
                                        <Tag color="blue">Sí</Tag>
                                    ) : (
                                        <Tag color="red">No</Tag>
                                    )
                                ) : (
                                    <Tag>N/D</Tag>
                                )
                            }
                        </p>
                        {
                            negocio?.foto_frontal_fachada ? (
                                <p><a href={'/' + negocio?.foto_frontal_fachada.replace('public', 'storage')} target="_blank"><b>Foto de fachada ↗</b></a></p>
                            ) : (
                                <p><b>Foto de la fachada no disponible</b></p>
                            )
                        }
                        {
                            negocio?.direccion ? (
                                <p>
                            <b className="label-info">
                                Direccion del negocio:
                            </b><br/>
                                <span><b className="label-info">Calle Principal:</b> {negocio?.direccion.calle_principal}</span><br/>
                                <span><b className="label-info">Entre: </b>{negocio?.direccion.calles}</span><br/>
                                <span><b className="label-info">Código Postal:</b> {negocio?.direccion.codigo_postal}</span><br/>
                                <span><b className="label-info">Localidad: </b>{negocio?.direccion.colonia.nombre_localidad}</span><br/>
                            </p>
                            ):
                            (
                                null
                            )
                         }
                        {
                            window.user.entidad_revision == 5 ? (
                                <Link
                                    to={`/app/comercio-admin/negocio/` + negocio?.id + '/' + (new Date().getFullYear())}
                                    target="_blank"
                                >
                                    <Button type="primary" className="details-button-map">DETALLES</Button>
                                </Link>
                            ) : (
                                <Link
                                    to={`/app/detalles-negocios-entidad/` + negocio?.id + '/' + (new Date().getFullYear())}
                                    target="_blank"
                                >
                                    <Button type="primary" className="details-button-map">DETALLES</Button>
                                </Link>
                            )
                        }


                    </Panel>
                </Collapse>
                <div className="detalles-propietario-container">
                    <DetallePropietarioMap negocio={negocio} />
                </div>
                <div className="detalles-horario-container">
                    <DetalleHorarioMap negocio={negocio} />
                </div>
                <div className="detalles-basura-container">
                    <DetalleRecoleccionBasuraMap
                        tarifa_recoleccion_id={
                            negocio?.tarifa_recoleccion_id ?? -1
                        }
                        negocio={negocio}
                    />
                </div>

            </Modal>
        </div>

        <div className="map-filters-entidad-revisora">
            <Card  title="Código de colores">
                <Row className="row-map-filter" gutter={{
                    xs: 8,
                    sm: 24,
                    md: 24,
                    lg: 48,
                }}>
                    <Col style={{width: '100%'}} className="gutter-row" xs={24} sm={24} lg={12} xl={12}>
                        <div className="color-code-container">
                            <img src="/imagenes/map-icons/orange-dot.png"></img>
                            <Tag style={{width: '100%'}} color="orange">Negocio en trámite </Tag>
                        </div>
                    </Col>
                    <Col style={{width: '100%'}} className="gutter-row" xs={24} sm={24} lg={12} xl={12}>
                        <div className="color-code-container">
                            <img src="/imagenes/map-icons/green-dot.png"></img>
                            <Tag style={{width: '100%'}} color="green">Licencia de funcionamiento funcionando</Tag>
                        </div>

                    </Col>
                    <Col style={{width: '100%'}} className="gutter-row" xs={24} sm={24} lg={12} xl={12}>
                        <div className="color-code-container">
                            <img src="/imagenes/map-icons/red-dot.png"></img>
                            <Tag style={{width: '100%'}} color="red">Venden alcohol y están en trámite </Tag>
                        </div>
                    </Col>
                    <Col style={{width: '100%'}} className="gutter-row" xs={24} sm={24} lg={12} xl={12}>
                        <div className="color-code-container">
                            <img src="/imagenes/map-icons/purple-dot.png"></img>
                            <Tag style={{width: '100%'}} color="purple">Venden alcohol con licencia de funcionamiento  </Tag>
                        </div>
                    </Col>
                </Row>
            </Card>
        </div>
        </>
    );
}
