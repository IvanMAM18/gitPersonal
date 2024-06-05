import React, { useState, useEffect } from "react";
import { Alert, Divider } from 'antd'
function Ayuda() {



    return (
        <div className="sare--container">
            <h1>Centro de Ayuda y Archivos</h1>

            <Divider orientation="left">Aquí encontrarás documentos de Ayuda e información importante sobre el Portal de Trámites y Servicios</Divider>

            <Alert
                showIcon
                type="success"
                message="EMPRESAS REGISTRADAS QUE CUENTAN CON VISTO BUENO ANTE LA DIRECCIÓN DE MEDIO AMBIENTE"
                action={
                    <a target="_blank" href="/formatos/acreditados_ma.pdf">Descargar Archivo</a>
                }
            />
            <br/>
            <Alert
                showIcon
                type="success"
                message="LISTADO DE TERCEROS ACREDITADOS EN MATERIA DE PROTECCIÓN CIVIL"
                action={
                    <a   target="_blank"href="/formatos/terceros_acreditados_pc.pdf">Descargar Archivo</a>
                }
            />
        </div>
    );
}

export default Ayuda;
