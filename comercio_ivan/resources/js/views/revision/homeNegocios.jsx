import React, {useState, useEffect} from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import { CloseOutlined, CheckOutlined, CheckSquareOutlined, WarningOutlined  } from '@ant-design/icons';
import { Statistic,Card, Select, Spin, message} from 'antd';
import moment from 'moment';
import { range } from 'lodash';

const currentYear = moment().year();
const aniosFiscalesDisponibles = range(2023, (currentYear + 1))

export default  function HomeNegocio() {
    const [selectedYear, setSelectedYear] = useState(moment().year());
    const [vistoBuenoTotal, setVistoBuenoTotal] = useState(null)
    const [rechazadosTotal, setRechazadosTotal] = useState(null)
    const [pendientesTotal, setPendientesTotal] = useState(null)
    const [tramitesAltoBajoImpacto, setTramitesAltoBajoImpacto] = useState(null)
    const [avisosDeEnteroNoGenerados, setAvisosDeEnteroNoGenerados] = useState(null)
    const [resolutivosImpresos, setResolutivosImpresos] = useState(null)
    const [resolutivosSinImprimir, setResolutivosSinImprimir] = useState(null)
    const [totalValidados, setTotalValidados] = useState(null)
    const [urlReportePadron, setUrlReportePadron] = useState("")
    const [resolutivosPagados, setResolutivosPagados] = useState("")

    const getTotalValidados = () => {
        return axios.get(`/app/estadisticas-entidad-revisora/total-validados`, {
            params: {'year' : selectedYear}
        }).then((result) => setTotalValidados(result?.data ?? []))
            .catch(error => {
                console.error(error);
                message.error('Error al cargar total validados');
            });
    }

    const getVistoBuenoTotal = () => {
        return axios.get(`/app/estadisticas-entidad-revisora/total-aprobados`, {
            params: { 'year' : selectedYear }

        }).then((result) => setVistoBuenoTotal(result?.data ?? [])).catch(error => {
            console.error(error);
            message.error('Error al cargar visto bueno');
        });
    }

    const getRechazadosTotal = () => {
        return axios.get(`/app/estadisticas-entidad-revisora/total-rechazados`, {
            params: { 'year' : selectedYear }
        }).then((result) => setRechazadosTotal(result?.data ?? [])).catch(error => {
            console.error(error);
            message.error('Error al cargar rechazados');
        });
    }

    const getPendientesTotal = () => {
        return axios.get(`/app/estadisticas-entidad-revisora/pendientes-por-revisar`, {
            params: { 'year' : selectedYear }
        }).then((result) => setPendientesTotal(result?.data ?? [])).catch(error => {
            console.error(error);
            message.error('Error al cargar pendientes');
        });
    }

    const getPendientesAvisoDeEntero = () => {
        return axios.get(`/app/estadisticas-entidad-revisora/avisos-entero-no-generados`, {
            params: { 'year' : selectedYear }
        }).then((result) => setAvisosDeEnteroNoGenerados(result?.data ?? [])).catch(error => {
            console.error(error);
            message.error('Error al cargar pendientes de avisos');
        });
    }

    const getAltoBajoImpacto = () => {
        return axios.get(`/app/estadisticas-entidad-revisora/alto-bajo-impacto`, {
            params: { 'year' : selectedYear }
        }).then((result) => setTramitesAltoBajoImpacto(result?.data ?? [])).catch(error => {
            console.error(error);
            message.error('Error al cargar alto bajo impacto');
        });
    }

    const getResolutivosPagados = () => {
        return axios.get(`/app/estadisticas-entidad-revisora/resolutivos-pagados`, {
            params: { 'year' : selectedYear }
        }).then((result) => setResolutivosPagados(result?.data ?? [])).catch(error => {
            console.error(error);
            message.error('Error al cargar resolutivos pagados');
        });
    }

    const getResolutivosImpresos = () => {
        return axios.get(`/app/estadisticas-entidad-revisora/resolutivos-impresos`, {
            params: { 'year' : selectedYear }
        }).then((result) => setResolutivosImpresos(result?.data ?? [])).catch(error => {
            console.error(error);
            message.error('Error al cargar resolutivos impresos');
        });
    }

    const getResolutivosSinImprimir = () => {
        return axios.get(`/app/estadisticas-entidad-revisora/resolutivos-no-impresos`, {
            params: { 'year' : selectedYear }
        }).then((result) => setResolutivosSinImprimir(result?.data ?? [])).catch(error => {
            console.error(error);
            message.error('Error al cargar resolutivos sin imprimir');
        });
    }

    const getReporteUrl = () => {
        return axios.get("/app/generar-firma-reporte-padron/"+selectedYear).then((result) => {
            setUrlReportePadron(result?.data ?? urlReportePadron);
        }).catch(error => {
            console.error(error);
            message.error('Error al cargar reporte firma padron');
        });
    }

    const resetValores = () => {
        setVistoBuenoTotal(null);
        setRechazadosTotal(null);
        setPendientesTotal(null);
        setTramitesAltoBajoImpacto(null);
        setAvisosDeEnteroNoGenerados(null);
        setResolutivosImpresos(null);
        setResolutivosSinImprimir(null);
        setTotalValidados(null);
        setResolutivosPagados("");
    }

    const cargarEstadisticas = async() => {

        if (window.user.role_id == 5) {
            await getReporteUrl();
        }

        resetValores();
        await getVistoBuenoTotal()
        await getRechazadosTotal()
        await getPendientesTotal()
        await getAltoBajoImpacto()
        await getPendientesAvisoDeEntero()
        await getResolutivosImpresos()
        await getResolutivosSinImprimir()
        await getResolutivosPagados()
        await getTotalValidados()
    }

    useEffect(() => {
        cargarEstadisticas();
    }, [selectedYear])

    const stats = [
        { title: "Total de Trámites", color: '#03A9F4', value: vistoBuenoTotal, icon : <CheckSquareOutlined twoToneColor="#52c41a"/> },
        { title: "Total de Trámites Validados", color: '#41c300', value: totalValidados, icon : <CheckOutlined /> },
        { title: "Total de Trámites Rechazados", color: '#F50057', value: rechazadosTotal, icon : <CloseOutlined /> },
        { title: "Total de Trámites Pendientes de Revisión", color: '#FBC02D', value: pendientesTotal, icon : <WarningOutlined /> },
        { title: "Total de Avisos de Entero No Generados", color: '#F50057', value: avisosDeEnteroNoGenerados, icon : <CheckSquareOutlined /> },
        { title: "Total de Trámites de Alto Impacto", color: '#03A9F4', value: tramitesAltoBajoImpacto?.alto_impacto, icon : <CheckSquareOutlined /> },
        { title: "Total de Trámites de Bajo Impacto", color: '#03A9F4', value: tramitesAltoBajoImpacto?.bajo_impacto, icon : <CheckSquareOutlined /> },
        { title: "Total de Resolutivos Impresos de Bajo Impacto", color: '#03A9F4', value: resolutivosImpresos, icon : <CheckOutlined /> },
        { title: "Total de Resolutivos Sin Imprimir", color: '#03A9F4', value: resolutivosSinImprimir, icon : <CloseOutlined /> },
    ]

    return(
        <>
            <div className="sare--container site-statistic-demo-card">
                <h2>Estadísticas</h2>

                {
                    window.user.role_id != 5 && <div className="w-full flex justify-end items-center px-4 py-3">
                        <label htmlFor="" className="mb-0 gap-1 flex items-center">
                            Año Fiscal:
                            <select defaultValue={selectedYear} onChange={event => setSelectedYear(event.target.value)} className="border border-gray-200 rounded-sm py-1 pl-3 w-28">

                                {aniosFiscalesDisponibles.map(year =>
                                    <option key={year} value={year}>{year}</option>
                                )}
                            </select>
                        </label>
                    </div>
                }
                {
                    window.user.role_id == 5 && <Card style={{marginBottom:'1%', width:"100%"}}
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
                        className="text-button ant-btn ant-btn-primary ml-2">Descargar Padrón Comercio</a>
                    </Card>
                }
                    <div className="grid grid-cols-3 gap-3 justify-center ">
                        { stats.map((item, index) =>
                            <Spin key={index} spinning={item.value == null}>
                                <Statistic key={index} className="border p-3 text-center "
                                        title={item.title}
                                        valueStyle={{color: item.color,}}
                                        value={item.value ?? 0}
                                        prefix={item.icon} />
                            </Spin>
                        )}
                    </div>
            </div>
        </>

    )
}
