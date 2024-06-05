import React, {useState, useEffect} from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import {  CloseOutlined, CheckOutlined,CheckSquareOutlined, WarningOutlined  } from '@ant-design/icons';
import { Select, Statistic, Card } from 'antd';

function HomeNegocio() {

    const [vistoBuenoTotal, setVistoBuenoTotal] = useState([])
    const [rechazadosTotal, setRechazadosTotal] = useState([])
    const [pendientesTotal, setPendientesTotal] = useState([])
    const [tramitesAltoBajoImpacto, setTramitesAltoBajoImpacto] = useState([])
    const [avisosDeEnteroNoGenerados, setAvisosDeEnteroNoGenerados] = useState([])
    const [resolutivosImpresos, setResolutivosImpresos] = useState([])
    const [resolutivosSinImprimir, setResolutivosSinImprimir] = useState([])
    const [urlReportePadron, setUrlReportePadron] = useState("")
    const [totalValidados, setTotalValidados] = useState([])
    const [selectedYear, setSelectedYear] = useState(2024);    

    const getTotalValidados = () => {
        axios.get("/app/entidad-revisora-get-total-validados/" + window.user.entidad_revision).then((result) => {
            setTotalValidados(result?.data ?? []);
        });
    }

    const getVistoBuenoTotal = () => {
        axios.get("/app/entidad-revisora-get-total-aprobados/" + window.user.entidad_revision).then((result) => {
            setVistoBuenoTotal(result?.data ?? []);
        });
    }

    const getRechazadosTotal = () => {
        axios.get("/app/entidad-revisora-get-total-rechazados/" + window.user.entidad_revision).then((result) => {
            setRechazadosTotal(result?.data ?? []);
        });
    }

    const getPendientesTotal = () => {
        axios.get("/app/entidad-revisora-get-pendientes-por-revisar/" + window.user.entidad_revision).then((result) => {
            setPendientesTotal(result?.data ?? []);
        });
    }

    const getPendientesAvisoDeEntero = () => {
        axios.get("/app/entidad-revisora-avisos-entero-no-generados/" + window.user.entidad_revision).then((result) => {
            setAvisosDeEnteroNoGenerados(result?.data ?? []);
        });
    }

    const getAltoBajoImpacto = () => {
        axios.get("/app/entidad-revisora-alto-bajo-impacto/" + window.user.entidad_revision).then((result) => {
            setTramitesAltoBajoImpacto(result?.data ?? []);
        });
    }
    const getResolutivosImpresos = () => {
        axios.get("/app/entidad-revisora-get-resolutivos-impresos/" + window.user.entidad_revision).then((result) => {
            setResolutivosImpresos(result?.data ?? []);
        });
    }

    const getResolutivosSinImprimir = () => {
        axios.get("/app/entidad-revisora-get-resolutivos-no-impresos/" + window.user.entidad_revision).then((result) => {
            setResolutivosSinImprimir(result?.data ?? []);
        });
    }
    const getReporteUrl = () => {
        axios.get("/app/generar-firma-reporte-padron/"+selectedYear).then((result) => {
            setUrlReportePadron(result?.data ?? urlReportePadron);
            
        }); 
    }

    useEffect(() => {
        getReporteUrl()
        getVistoBuenoTotal()
        getRechazadosTotal()
        getPendientesTotal()
        getAltoBajoImpacto()
        getPendientesAvisoDeEntero()
        getResolutivosImpresos()
        getResolutivosSinImprimir()
        getTotalValidados()
    }, [])
    useEffect(() => {
        getReporteUrl()    
    }, [selectedYear])
    return(
        <div className="sare--container site-statistic-demo-card">
            <h2>Estadísticas</h2>
            {
                 (
                <>  
                <Card style={(window.user.role_id==5 ) ? {marginBottom:'1%', width:"100%"} : { visibility: 'hidden'}} 
                title="Reportes"> 
                    <span style={{marginRight: '10px'}}>Año Fiscal de Reporte: </span>
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
                    <a href={urlReportePadron} 
                    className="text-button ant-btn ant-btn-primary">Descargar Padrón Comercio</a>
                </Card>
                    </>
                 ) 
            }
            <div className="card-container">
                    <div>
                        <Card className="home-card-container">
                                <Statistic title="TOTAL DE TRÁMITES" valueStyle={{color: '#03A9F4',}} value={vistoBuenoTotal}  prefix={<CheckSquareOutlined twoToneColor="#52c41a"/>} />
                                
                        </Card>
                    </div>
                    <div>
                        <Card>
                            <Statistic title="TOTAL DE TRÁMITES VALIDADOS" valueStyle={{color: '#41c300',}} value={totalValidados} prefix={<CheckOutlined />} />
                        </Card>
                    </div>
                    <div>
                        <Card>
                            <Statistic title="TOTAL DE TRÁMITES RECHAZADOS" valueStyle={{color: '#F50057',}} value={rechazadosTotal} prefix={<CloseOutlined />} />
                        </Card>
                    </div>
                    <div>
                        <Card>
                            <Statistic title="TOTAL DE TRÁMITES PENDIENTES DE REVISIÓN" valueStyle={{color: '#FBC02D',}} value={pendientesTotal} prefix={<WarningOutlined />} />
                        </Card>
                    </div>
                    {/* <div>
                        <Card>
                            <Statistic title="TOTAL DE TRAMITES PAGADOS" valueStyle={{color: '#41c300',}} value={tramitesPagados} prefix={<CheckOutlined />} />
                        </Card>
                    </div> */}
                    {/* <div>
                        <Card>
                            <Statistic title="TOTAL DE TRAMITES NO PAGADOS" valueStyle={{color: '#F50057',}} value={tramitesNoPagados} prefix={<CheckSquareOutlined />} />
                        </Card>
                    </div> */}
                    <div>
                        <Card>
                            <Statistic title="TOTAL DE AVISOS DE ENTERO NO GENERADOS" valueStyle={{color: '#F50057',}} value={avisosDeEnteroNoGenerados} prefix={<CheckSquareOutlined />} />
                        </Card>
                    </div>
                    {/* <div>
                        <Card>
                            <Statistic title="TOTAL DE TRAMITES REVISADOS" valueStyle={{color: '#F50057',}} value={totalRevisados} prefix={<CheckSquareOutlined />} />
                        </Card>
                    </div> */}
                    <div>
                        <Card>
                            <Statistic title="TOTAL DE TRÁMITES ALTO IMPACTO" valueStyle={{color: '#03A9F4',}} value={tramitesAltoBajoImpacto?.alto_impacto} prefix={<CheckSquareOutlined />} />
                        </Card>
                    </div>
                    <div>
                        <Card>
                            <Statistic title="TOTAL DE TRÁMITES BAJO IMPACTO" valueStyle={{color: '#03A9F4',}} value={tramitesAltoBajoImpacto?.bajo_impacto} prefix={<CheckSquareOutlined />} />
                        </Card>
                    </div>
                    <div>
                        <Card>
                            <Statistic title="TOTAL DE RESOLUTIVOS IMPRESOS" valueStyle={{color: '#41c300',}} value={resolutivosImpresos} prefix={<CheckOutlined />} />
                        </Card>
                    </div>
                    <div>
                        <Card>
                            <Statistic title="TOTAL DE RESOLUTIVOS SIN IMPRIMIR" valueStyle={{color: '#F50057',}} value={resolutivosSinImprimir} prefix={<CloseOutlined />} />
                        </Card>
                    </div>
            </div>
        </div>
        
    )
}

export default HomeNegocio;

if (document.getElementById("home-negocios-content")) {
    ReactDOM.render(<HomeNegocio />, document.getElementById("home-negocios-content"));
}
