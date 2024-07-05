import React, { useState, useEffect } from 'react'
import RefrendoModalContainer from './RefrendoModalContainer';
import { Spin } from 'antd';

export default function RefrendoDesdeTramites({ setRefrendoDesdeTramites, refrendoDesdeTramites }) {
    const [negocios, setNegocios] = useState(null);
    const refreshNegocios = () => {
        axios.get('/app/negocios')
            .then(result => {
                setNegocios(result.data)
            })
    }

    useEffect(() => {
        refreshNegocios();
    }, []);

    return (
        <>
            {negocios === null && (<Spin style={{ marginLeft: 15 }} />)}
            {
                negocios?.length > 0 && (<RefrendoModalContainer setRefrendoDesdeTramites={setRefrendoDesdeTramites} refrendoDesdeTramites={refrendoDesdeTramites} negocios={negocios} />)
            }
            {
                negocios?.length === 0 && <span>No hay negocio para refrendar</span>
            }
        </>
    );
}
