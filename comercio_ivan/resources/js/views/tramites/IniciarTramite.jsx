import React, { useState, useEffect } from "react";
import { Spin, Table, Space, Tabs, Tag, Button, Divider } from "antd";
import { Link, useNavigate } from "react-router-dom";
import status from "../../utils/statuses";
import routes from '../../utils/react-routes'
import IniciarTramitePersona from './IniciarTramitePersona';

function IniciarTramite() {
    const navigate = useNavigate();
    const [catalogoTramiteId, setCatalogoTramiteId] = useState(0);
    const [catalogoTramite, setCatalogoTramite] = useState(null);

    useEffect(() => {
        const role = window?.user?.role ?? 'Persona';
        if(role != 'Persona') {
            navigate(routes.allowedByRole[role][0]);
            return;
        }
        if(!location.pathname.includes('/app/iniciar-tramite/')) {
            console.error('Ruta cambiada, tramite id no disponible');
            return;
        }
        const _catalogoTramiteId = location.pathname.split('/')[3];
        setCatalogoTramiteId(_catalogoTramiteId);
        loadTramite(_catalogoTramiteId);
    }, []);

    const loadTramite = (catalogoTramiteId) => {
        axios.get('/app/catalogo-tramites/' + catalogoTramiteId)
            .then((response) => {
                setCatalogoTramite(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    const esTramitePersona = catalogoTramite && catalogoTramite.tipo_tramite == 'PERSONA';

    return (
        <div className="sare--container">
            <h1>Tramite: {catalogoTramite ? catalogoTramite.nombre : ''}</h1>
            <Divider/>
            {
                esTramitePersona && <IniciarTramitePersona catalogoTramite={catalogoTramite}/>
            }
        </div>
    );
}

export default IniciarTramite;
