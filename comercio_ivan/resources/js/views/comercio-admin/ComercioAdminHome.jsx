import React, { useState, useEffect } from "react";
import axios from "axios";
import { LikeOutlined, CloseOutlined, CheckOutlined, ExclamationOutlined, CheckSquareOutlined, WarningOutlined } from '@ant-design/icons';
import { Col, Row, Statistic } from 'antd';
import { Select,Card } from 'antd';

export default  function ComercioAdminHomeNegocio() {
    const [urlReporteTiempos, setUrlReporteTiempos] = useState("")
    const [urlReportePadron, setUrlReportePadron] = useState("")
    const [selectedYear, setSelectedYear] = useState(2024);

    const getReporteUrl = () => {
        axios.get(`/app/generar-firma-reporte-tiempos/${selectedYear}`)
            .then((result) => {
                setUrlReporteTiempos(result?.data ?? urlReporteTiempos)
            });

        axios.get(`/app/generar-firma-reporte-padron/${selectedYear}`)
        .then((result) => {
            setUrlReportePadron(result?.data ?? urlReportePadron)
        });
    }
    useEffect(() => {
        getReporteUrl()
    }, [selectedYear])

    return (

        <div className="p-3 w-100 bg-white h-full">
            <h2>Estadísticas</h2>
            <>
                <div className="mb-5">
                    <span>Año Fiscal:</span>
                    <Select
                        defaultValue="2024"
                        onChange={(value) => { setSelectedYear(value)}}
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

                <a href={urlReporteTiempos}
                   className="text-button ant-btn ant-btn-primary ml-auto">
                    Descargar Reporte de Tiempos
                </a>

                <a href={urlReportePadron}
                   style={(window.user.role_id==6 || window.user.role_id==7) ? {marginLeft:'7%', marginBottom:'1%'} : { visibility: 'hidden'}}
                   className="text-button ant-btn ant-btn-primary">
                    Descargar Padrón Comercio
                </a>

            </>
        </div>
    )
}


