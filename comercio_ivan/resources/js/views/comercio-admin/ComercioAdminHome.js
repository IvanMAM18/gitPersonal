import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import { Select,Card } from 'antd';

function ComercioAdminHomeNegocio() {

    const [totales, setTotales] = useState([])
    const [tramitesRecibidos, setTramitesRecibidos] = useState([])
    const [tramitesConObservacion, setTramitesConObservacion] = useState([])
    const [tramitesValidados, setTramitesValidados] = useState([])
    const [tramitesRechazados, setTramitesRechazados] = useState([])
    const [tramitesPendientesRevision, setTramitesPendientesRevision] = useState([])
    const [tramitesPendientesAvisoDeEntero, setTramitesPendientesAvisoDeEntero] = useState([])
    const [tramitesPendientesPago, setTramitesPendientesPago] = useState([])
    const [tramitesPagados, setTramitesPagados] = useState([])
    const [tramitesResolutivoImpreso, setTramitesResolutivoImpreso] = useState([])
    const [tramitesResolutivoNoImpreso, setTramitesResolutivoNoImpreso] = useState([])
    const [tramitesConAlcohol, setTramitesConAlcohol] = useState([])
    const [urlReporteTiempos, setUrlReporteTiempos] = useState("")
    const [urlReportePadron, setUrlReportePadron] = useState("")
    const [selectedYear, setSelectedYear] = useState(2024);
    const [titulo, setTitulo] = useState("Reportes: Cargando...");
    const [loading, setLoading] = useState(true);
    function getEstadoGuardado() {
        try {
            const _tramitesRecibidos = JSON.parse(localStorage.getItem('TRAMITES_RECIBIDOS')) ?? [];
            setTramitesRecibidos(_tramitesRecibidos);
            const _tramitesConObservacion = JSON.parse(localStorage.getItem('TRAMITES_CON_OBSERVACION')) ?? [];
            setTramitesConObservacion(_tramitesConObservacion);
            const _tramitesValidados = JSON.parse(localStorage.getItem('TRAMITES_VALIDADOS')) ?? [];
            setTramitesValidados(_tramitesValidados);
            const _tramitesRechazados = JSON.parse(localStorage.getItem('TRAMITES_RECHAZADOS')) ?? [];
            setTramitesRechazados(_tramitesRechazados);
            const _tramitesPendientesRevision = JSON.parse(localStorage.getItem('TRAMITES_PENDIENTES_REVISION')) ?? [];
            setTramitesPendientesRevision(_tramitesPendientesRevision);
            const _tramitesPendientesAvisoDeEntero = JSON.parse(localStorage.getItem('TRAMITES_PENDIENTES_AVISO_ENTERO')) ?? [];
            setTramitesPendientesAvisoDeEntero(_tramitesPendientesAvisoDeEntero);
            const _tramitesPendientesPago = JSON.parse(localStorage.getItem('TRAMITES_PENDIENTES_PAGO')) ?? [];
            setTramitesPendientesPago(_tramitesPendientesPago);
            const _tramitesPagados = JSON.parse(localStorage.getItem('TRAMITES_PAGADOS')) ?? [];
            setTramitesPagados(_tramitesPagados);
            const _tramitesResolutivoImpreso = JSON.parse(localStorage.getItem('TRAMITES_RESOLUTIVO_IMPRESO')) ?? [];
            setTramitesResolutivoImpreso(_tramitesResolutivoImpreso);
            const _tramitesResolutivoNoImpreso = JSON.parse(localStorage.getItem('TRAMITES_RESOLUTIVO_NO_IMPRESO')) ?? [];
            setTramitesResolutivoNoImpreso(_tramitesResolutivoNoImpreso);
            const _tramitesConAlcohol = JSON.parse(localStorage.getItem('TRAMITES_CON_ALCOHOL')) ?? [];
            setTramitesConAlcohol(_tramitesConAlcohol);
        } catch (error) {
            console.error(error);
        }
    }


    const getTotales = () => {
        axios.get("/app/comercio-admin-totales").then((result) => {
            setTotales(result?.data ?? []);
        }); 
    }

    const getTramitesRecibidos = () => {
        axios.get("/app/comercio-admin-tramites-recibidos").then((result) => {
            setTramitesRecibidos(result?.data ?? []);
            localStorage.setItem('TRAMITES_RECIBIDOS', JSON.stringify(result?.data ?? []));
        }); 
    }

    const getTramitesConObservacion = () => {
        axios.get("/app/comercio-admin-tramites-con-observacion").then((result) => {
            setTramitesConObservacion(result?.data ?? []);
            localStorage.setItem('TRAMITES_CON_OBSERVACION', JSON.stringify(result?.data ?? []));
        }); 
    }

    const getTramitesValidados = () => {
        axios.get("/app/comercio-admin-tramites-validados").then((result) => {
            setTramitesValidados(result?.data ?? []);
            localStorage.setItem('TRAMITES_VALIDADOS', JSON.stringify(result?.data ?? []));
        }); 
    }

    const getTramitesRechazados = () => {
        axios.get("/app/comercio-admin-tramites-rechazados").then((result) => {
            setTramitesRechazados(result?.data ?? []);
            localStorage.setItem('TRAMITES_RECHAZADOS', JSON.stringify(result?.data ?? []));
        }); 
    }

    const getTramitesPendientesRevision = () => {
        axios.get("/app/comercio-admin-tramites-pendientes-revision").then((result) => {
            setTramitesPendientesRevision(result?.data ?? []);
            localStorage.setItem('TRAMITES_PENDIENTES_REVISION', JSON.stringify(result?.data ?? []));
        }); 
    }

    const getTramitesPendientesAvisoDeEntero = () => {
        axios.get("/app/comercio-admin-tramites-pendientes-aviso-entero").then((result) => {
            setTramitesPendientesAvisoDeEntero(result?.data ?? []);
            localStorage.setItem('TRAMITES_PENDIENTES_AVISO_ENTERO', JSON.stringify(result?.data ?? []));
        }); 
    }

    const getTramitesPendientesPago = () => {
        axios.get("/app/comercio-admin-tramites-pendientes-pago").then((result) => {
            setTramitesPendientesPago(result?.data ?? []);
            localStorage.setItem('TRAMITES_PENDIENTES_PAGO', JSON.stringify(result?.data ?? []));
        }); 
    }

    const getTramitesPagados = () => {
        axios.get("/app/comercio-admin-tramites-pagados").then((result) => {
            setTramitesPagados(result?.data ?? []);
            localStorage.setItem('TRAMITES_PAGADOS', JSON.stringify(result?.data ?? []));
        }); 
    }

    const getTramitesResolutivoImpreso = () => {
        axios.get("/app/comercio-admin-tramites-resolutivo-impreso").then((result) => {
            setTramitesResolutivoImpreso(result?.data ?? []);
            localStorage.setItem('TRAMITES_RESOLUTIVO_IMPRESO', JSON.stringify(result?.data ?? []));
        }); 
    }

    const getTramitesResolutivoNoImpreso = () => {
        axios.get("/app/comercio-admin-tramites-resolutivo-no-impreso").then((result) => {
            setTramitesResolutivoNoImpreso(result?.data ?? []);
            setLoading(false)
            setTitulo('Reportes')
            localStorage.setItem('TRAMITES_RESOLUTIVO_NO_IMPRESO', JSON.stringify(result?.data ?? []));
        }); 
    }

    const getTramitesConAlcohol = () => {
        axios.get("/app/comercio-admin-tramites-con-alcohol").then((result) => {
            setTramitesConAlcohol(result?.data ?? []);
         
            localStorage.setItem('TRAMITES_CON_ALCOHOL', JSON.stringify(result?.data ?? []));
        }); 
    }
    const getReporteUrl = () => {
        axios.get("/app/generar-firma-reporte-tiempos/"+selectedYear).then((result) => {
            setUrlReporteTiempos(result?.data ?? urlReporteTiempos);
            
        }); 
        axios.get("/app/generar-firma-reporte-padron/"+selectedYear).then((result) => {
            setUrlReportePadron(result?.data ?? urlReportePadron);
            
        }); 
    }

    useEffect(() => {
        getReporteUrl()
        getEstadoGuardado()
        getTotales()
        getTramitesRecibidos()
        getTramitesConObservacion()
        getTramitesValidados()
        getTramitesRechazados()
        getTramitesPendientesRevision()
        getTramitesPendientesAvisoDeEntero()
        getTramitesPendientesPago()
        getTramitesPagados()
        getTramitesResolutivoImpreso()
        getTramitesResolutivoNoImpreso()
        getTramitesConAlcohol()
        
    }, [])
    useEffect(() => {
        getReporteUrl()    
    }, [selectedYear])
    return (

        <div className="sare--container site-statistic-demo-card">
            <h2>Estadísticas</h2>
            {
                 (
                    <>
                     <Card style={{ width: "100%"  }} loading={loading}   title={titulo}> 
                    <span style={{marginRight: '10px'}}>Año Fiscal de Reporte Tiempos: </span>
                    <Select
                        defaultValue="2024"
                        style={{
                            width: 120,
                        }}
                        onChange={(value) => {
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
                    <a href={urlReporteTiempos}       
                    style={{marginLeft:'10%', marginBottom:'1%'}}
                    className="text-button ant-btn ant-btn-primary">Descargar Reporte de Tiempos</a>
                    
                    <a href={urlReportePadron} 
                    style={(window.user.role_id==6 ||  window.user.role_id==7) ? {marginLeft:'7%', marginBottom:'1%'} : { visibility: 'hidden'}}
                    className="text-button ant-btn ant-btn-primary">Descargar Padrón Comercio</a>
                      </Card>
                    </>
                    
                 ) 
            }
            
            <table id="comercioAdminTable"  className="default">
                <tr>
                    <th scope="row"></th>
                    <th colSpan={2}>Comercio</th>
                    <th colSpan={4}>Uso de suelo</th>
                    <th >Medio Ambiente</th>
                    <th colSpan={3}>Servicios Públicos</th>
                    <th colSpan={2}>Protección Civil</th>
                </tr>
                <tr>
                    <th scope="row">Totales</th>
                    <th colSpan={2}>{totales?.comercio}</th>
                    <th colSpan={4}>{totales?.uso_de_suelo}</th>
                    <th >{totales?.medio_ambiente}</th>
                    <th colSpan={3}>{totales?.servicios_publicos}</th>
                    <th colSpan={2}>{totales?.proteccion_civil}</th>
                </tr>
                <tr>
                    <th scope="row"></th>
                    <th>BAJO</th>
                    <th>ALTO</th>
                    <th>APE BAJO</th>
                    <th>APE ALTO</th>
                    <th>REFERENDO BAJO</th>
                    <th>REFERENDO ALTO</th>
                    <th>ALTO</th>
                    <th>PÚBLICO</th>
                    <th>PRIVADO</th>
                    <th>PROPIO</th>
                    <th>BAJO</th>
                    <th>ALTO</th>
                </tr>
                <tr>
                    <th>RECIBIDO</th>
                    <td>{tramitesRecibidos?.COMERCIO_BAJO}</td>
                    <td>{tramitesRecibidos?.COMERCIO_ALTO}</td>
                    <td>{tramitesRecibidos?.USO_DE_SUELO_APERTURA_BAJO}</td>
                    <td>{tramitesRecibidos?.USO_DE_SUELO_APERTURA_ALTO}</td>
                    <td>{tramitesRecibidos?.USO_DE_SUELO_REFRENDO_BAJO}</td>
                    <td>{tramitesRecibidos?.USO_DE_SUELO_REFRENDO_ALTO}</td>
                    <td>{tramitesRecibidos?.MEDIO_AMBIENTE_ALTO}</td>
                    <td>{tramitesRecibidos?.SERVICIOS_PUBLICOS_RELLENO}</td>
                    <td>{tramitesRecibidos?.SERVICIOS_PUBLICOS_PRIVADO}</td>
                    <td>{tramitesRecibidos?.SERVICIOS_PUBLICOS_PROPIO}</td>
                    <td>{tramitesRecibidos?.PROTECCION_CIVIL_BAJO}</td>
                    <td>{tramitesRecibidos?.PROTECCION_CIVIL_ALTO}</td>
                </tr>
                <tr>
                    <th>CON OBSERVACION</th>
                    <td>{tramitesConObservacion?.COMERCIO_BAJO}</td>
                    <td>{tramitesConObservacion?.COMERCIO_ALTO}</td>
                    <td>{tramitesConObservacion?.USO_DE_SUELO_APERTURA_BAJO}</td>
                    <td>{tramitesConObservacion?.USO_DE_SUELO_APERTURA_ALTO}</td>
                    <td>{tramitesConObservacion?.USO_DE_SUELO_REFRENDO_BAJO}</td>
                    <td>{tramitesConObservacion?.USO_DE_SUELO_REFRENDO_ALTO}</td>
                    <td>{tramitesConObservacion?.MEDIO_AMBIENTE_ALTO}</td>
                    <td>{tramitesConObservacion?.SERVICIOS_PUBLICOS_RELLENO}</td>
                    <td>{tramitesConObservacion?.SERVICIOS_PUBLICOS_PRIVADO}</td>
                    <td>{tramitesConObservacion?.SERVICIOS_PUBLICOS_PROPIO}</td>
                    <td>{tramitesConObservacion?.PROTECCION_CIVIL_BAJO}</td>
                    <td>{tramitesConObservacion?.PROTECCION_CIVIL_ALTO}</td>
                </tr>
                <tr>
                    <th>VALIDADO (visto bueno)</th>
                    <td>{tramitesValidados?.COMERCIO_BAJO}</td>
                    <td>{tramitesValidados?.COMERCIO_ALTO}</td>
                    <td>{tramitesValidados?.USO_DE_SUELO_APERTURA_BAJO}</td>
                    <td>{tramitesValidados?.USO_DE_SUELO_APERTURA_ALTO}</td>
                    <td>{tramitesValidados?.USO_DE_SUELO_REFRENDO_BAJO}</td>
                    <td>{tramitesValidados?.USO_DE_SUELO_REFRENDO_ALTO}</td>
                    <td>{tramitesValidados?.MEDIO_AMBIENTE_ALTO}</td>
                    <td>{tramitesValidados?.SERVICIOS_PUBLICOS_RELLENO}</td>
                    <td>{tramitesValidados?.SERVICIOS_PUBLICOS_PRIVADO}</td>
                    <td>{tramitesValidados?.SERVICIOS_PUBLICOS_PROPIO}</td>
                    <td>{tramitesValidados?.PROTECCION_CIVIL_BAJO}</td>
                    <td>{tramitesValidados?.PROTECCION_CIVIL_ALTO}</td>
                </tr>
                <tr>
                    <th>RECHAZADO</th>
                    <td>{tramitesRechazados?.COMERCIO_BAJO}</td>
                    <td>{tramitesRechazados?.COMERCIO_ALTO}</td>
                    <td>{tramitesRechazados?.USO_DE_SUELO_APERTURA_BAJO}</td>
                    <td>{tramitesRechazados?.USO_DE_SUELO_APERTURA_ALTO}</td>
                    <td>{tramitesRechazados?.USO_DE_SUELO_REFRENDO_BAJO}</td>
                    <td>{tramitesRechazados?.USO_DE_SUELO_REFRENDO_ALTO}</td>
                    <td>{tramitesRechazados?.MEDIO_AMBIENTE_ALTO}</td>
                    <td>{tramitesRechazados?.SERVICIOS_PUBLICOS_RELLENO}</td>
                    <td>{tramitesRechazados?.SERVICIOS_PUBLICOS_PRIVADO}</td>
                    <td>{tramitesRechazados?.SERVICIOS_PUBLICOS_PROPIO}</td>
                    <td>{tramitesRechazados?.PROTECCION_CIVIL_BAJO}</td>
                    <td>{tramitesRechazados?.PROTECCION_CIVIL_ALTO}</td>
                </tr>
                <tr>
                    <th>PEND. REV.</th>
                    <td>{tramitesPendientesRevision?.COMERCIO_BAJO}</td>
                    <td>{tramitesPendientesRevision?.COMERCIO_ALTO}</td>
                    <td>{tramitesPendientesRevision?.USO_DE_SUELO_APERTURA_BAJO}</td>
                    <td>{tramitesPendientesRevision?.USO_DE_SUELO_APERTURA_ALTO}</td>
                    <td>{tramitesPendientesRevision?.USO_DE_SUELO_REFRENDO_BAJO}</td>
                    <td>{tramitesPendientesRevision?.USO_DE_SUELO_REFRENDO_ALTO}</td>
                    <td>{tramitesPendientesRevision?.MEDIO_AMBIENTE_ALTO}</td>
                    <td>{tramitesPendientesRevision?.SERVICIOS_PUBLICOS_RELLENO}</td>
                    <td>{tramitesPendientesRevision?.SERVICIOS_PUBLICOS_PRIVADO}</td>
                    <td>{tramitesPendientesRevision?.SERVICIOS_PUBLICOS_PROPIO}</td>
                    <td>{tramitesPendientesRevision?.PROTECCION_CIVIL_BAJO}</td>
                    <td>{tramitesPendientesRevision?.PROTECCION_CIVIL_ALTO}</td>
                </tr>
                <tr>
                    <th>PEND. AVISO ENTERO</th>
                    <td>{tramitesPendientesAvisoDeEntero?.COMERCIO_BAJO}</td>
                    <td>{tramitesPendientesAvisoDeEntero?.COMERCIO_ALTO}</td>
                    <td>{tramitesPendientesAvisoDeEntero?.USO_DE_SUELO_APERTURA_BAJO}</td>
                    <td>{tramitesPendientesAvisoDeEntero?.USO_DE_SUELO_APERTURA_ALTO}</td>
                    <td>{tramitesPendientesAvisoDeEntero?.USO_DE_SUELO_REFRENDO_BAJO}</td>
                    <td>{tramitesPendientesAvisoDeEntero?.USO_DE_SUELO_REFRENDO_ALTO}</td>
                    <td>{tramitesPendientesAvisoDeEntero?.MEDIO_AMBIENTE_ALTO}</td>
                    <td>{tramitesPendientesAvisoDeEntero?.SERVICIOS_PUBLICOS_RELLENO}</td>
                    <td>{tramitesPendientesAvisoDeEntero?.SERVICIOS_PUBLICOS_PRIVADO}</td>
                    <td>{tramitesPendientesAvisoDeEntero?.SERVICIOS_PUBLICOS_PROPIO}</td>
                    <td>{tramitesPendientesAvisoDeEntero?.PROTECCION_CIVIL_BAJO}</td>
                    <td>{tramitesPendientesAvisoDeEntero?.PROTECCION_CIVIL_ALTO}</td>
                </tr>
                <tr>
                    <th>PEND. PAGO</th>
                    <td>{tramitesPendientesPago?.COMERCIO_BAJO}</td>
                    <td>{tramitesPendientesPago?.COMERCIO_ALTO}</td>
                    <td>{tramitesPendientesPago?.USO_DE_SUELO_APERTURA_BAJO}</td>
                    <td>{tramitesPendientesPago?.USO_DE_SUELO_APERTURA_ALTO}</td>
                    <td>{tramitesPendientesPago?.USO_DE_SUELO_REFRENDO_BAJO}</td>
                    <td>{tramitesPendientesPago?.USO_DE_SUELO_REFRENDO_ALTO}</td>
                    <td>{tramitesPendientesPago?.MEDIO_AMBIENTE_ALTO}</td>
                    <td>{tramitesPendientesPago?.SERVICIOS_PUBLICOS_RELLENO}</td>
                    <td>{tramitesPendientesPago?.SERVICIOS_PUBLICOS_PRIVADO}</td>
                    <td>{tramitesPendientesPago?.SERVICIOS_PUBLICOS_PROPIO}</td>
                    <td>{tramitesPendientesPago?.PROTECCION_CIVIL_BAJO}</td>
                    <td>{tramitesPendientesPago?.PROTECCION_CIVIL_ALTO}</td>
                </tr>
                <tr>
                    <th>PAGADO</th>
                    <td>{tramitesPagados?.COMERCIO_BAJO}</td>
                    <td>{tramitesPagados?.COMERCIO_ALTO}</td>
                    <td>{tramitesPagados?.USO_DE_SUELO_APERTURA_BAJO}</td>
                    <td>{tramitesPagados?.USO_DE_SUELO_APERTURA_ALTO}</td>
                    <td>{tramitesPagados?.USO_DE_SUELO_REFRENDO_BAJO}</td>
                    <td>{tramitesPagados?.USO_DE_SUELO_REFRENDO_ALTO}</td>
                    <td>{tramitesPagados?.MEDIO_AMBIENTE_ALTO}</td>
                    <td>{tramitesPagados?.SERVICIOS_PUBLICOS_RELLENO}</td>
                    <td>{tramitesPagados?.SERVICIOS_PUBLICOS_PRIVADO}</td>
                    <td>{tramitesPagados?.SERVICIOS_PUBLICOS_PROPIO}</td>
                    <td>{tramitesPagados?.PROTECCION_CIVIL_BAJO}</td>
                    <td>{tramitesPagados?.PROTECCION_CIVIL_ALTO}</td>
                </tr>
                <tr>
                    <th>RESOLUTIVO IMPRESO</th>
                    <td>{tramitesResolutivoImpreso?.COMERCIO_BAJO}</td>
                    <td>{tramitesResolutivoImpreso?.COMERCIO_ALTO}</td>
                    <td>{tramitesResolutivoImpreso?.USO_DE_SUELO_APERTURA_BAJO}</td>
                    <td>{tramitesResolutivoImpreso?.USO_DE_SUELO_APERTURA_ALTO}</td>
                    <td>{tramitesResolutivoImpreso?.USO_DE_SUELO_REFRENDO_BAJO}</td>
                    <td>{tramitesResolutivoImpreso?.USO_DE_SUELO_REFRENDO_ALTO}</td>
                    <td>{tramitesResolutivoImpreso?.MEDIO_AMBIENTE_ALTO}</td>
                    <td>{tramitesResolutivoImpreso?.SERVICIOS_PUBLICOS_RELLENO}</td>
                    <td>{tramitesResolutivoImpreso?.SERVICIOS_PUBLICOS_PRIVADO}</td>
                    <td>{tramitesResolutivoImpreso?.SERVICIOS_PUBLICOS_PROPIO}</td>
                    <td>{tramitesResolutivoImpreso?.PROTECCION_CIVIL_BAJO}</td>
                    <td>{tramitesResolutivoImpreso?.PROTECCION_CIVIL_ALTO}</td>
                </tr>
                <tr>
                    <th>RESOLUTIVO SIN IMPRESION</th>
                    <td>{tramitesResolutivoNoImpreso?.COMERCIO_BAJO}</td>
                    <td>{tramitesResolutivoNoImpreso?.COMERCIO_ALTO}</td>
                    <td>{tramitesResolutivoNoImpreso?.USO_DE_SUELO_APERTURA_BAJO}</td>
                    <td>{tramitesResolutivoNoImpreso?.USO_DE_SUELO_APERTURA_ALTO}</td>
                    <td>{tramitesResolutivoNoImpreso?.USO_DE_SUELO_REFRENDO_BAJO}</td>
                    <td>{tramitesResolutivoNoImpreso?.USO_DE_SUELO_REFRENDO_ALTO}</td>
                    <td>{tramitesResolutivoNoImpreso?.MEDIO_AMBIENTE_ALTO}</td>
                    <td>{tramitesResolutivoNoImpreso?.SERVICIOS_PUBLICOS_RELLENO}</td>
                    <td>{tramitesResolutivoNoImpreso?.SERVICIOS_PUBLICOS_PRIVADO}</td>
                    <td>{tramitesResolutivoNoImpreso?.SERVICIOS_PUBLICOS_PROPIO}</td>
                    <td>{tramitesResolutivoNoImpreso?.PROTECCION_CIVIL_BAJO}</td>
                    <td>{tramitesResolutivoNoImpreso?.PROTECCION_CIVIL_ALTO}</td>
                </tr>
                
                <tr>
                    <th>CON ALCOHOL</th>
                    <td>{tramitesConAlcohol?.COMERCIO_BAJO}</td>
                    <td>{tramitesConAlcohol?.COMERCIO_ALTO}</td>
                    <td>{tramitesConAlcohol?.USO_DE_SUELO_APERTURA_BAJO}</td>
                    <td>{tramitesConAlcohol?.USO_DE_SUELO_APERTURA_ALTO}</td>
                    <td>{tramitesConAlcohol?.USO_DE_SUELO_REFRENDO_BAJO}</td>
                    <td>{tramitesConAlcohol?.USO_DE_SUELO_REFRENDO_ALTO}</td>
                    <td>{tramitesConAlcohol?.MEDIO_AMBIENTE_ALTO}</td>
                    <td>{tramitesConAlcohol?.SERVICIOS_PUBLICOS_RELLENO}</td>
                    <td>{tramitesConAlcohol?.SERVICIOS_PUBLICOS_PRIVADO}</td>
                    <td>{tramitesConAlcohol?.SERVICIOS_PUBLICOS_PROPIO}</td>
                    <td>{tramitesConAlcohol?.PROTECCION_CIVIL_BAJO}</td>
                    <td>{tramitesConAlcohol?.PROTECCION_CIVIL_ALTO}</td>
                </tr>
               
            </table>
          
        </div>

    )
}

export default ComercioAdminHomeNegocio;

if (document.getElementById("comercio-admin-home-negocios-content")) {
    ReactDOM.render(<ComercioAdminHomeNegocio />, document.getElementById("comercio-admin-home-negocios-content"));
}
