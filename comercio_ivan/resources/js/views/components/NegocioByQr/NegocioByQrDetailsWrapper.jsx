import axios from 'axios';
import React, { useEffect, useState } from 'react'
import LoadingIndicator from '../../../components/LoadingIndicator';
import ResolutivoNegocioDetalles from '../../resolutivos/ResolutivoNegocioDetalles'

export default function NegocioByQrDetailsWrapper() {

    const negocioId = window.negocio_id;
    const [negocioByQrWrapperState, setNegocioByQrWrapperState] = useState({ negocio: null, loading: true, bgColor: (Math.floor(Math.random() * 5) + 1) });

    useEffect(() => {
        axios.get(`/app/get_informacion_negocio_for_banner/${negocioId}`)
            .then(response => setNegocioByQrWrapperState({ ...negocioByQrWrapperState, negocio: response?.data ?? null }))
            .catch(error => console.log({ error }));

    }, []);

    useEffect(() => {
        if (negocioByQrWrapperState?.negocio !== null) {
            setNegocioByQrWrapperState({ ...negocioByQrWrapperState, loading: false })
        }
    }, [negocioByQrWrapperState?.negocio]);

    return (
        <>

            {
                negocioByQrWrapperState?.loading === false
                    ? <div style={{ padding: 30 }}>
                        {
                            negocioByQrWrapperState?.negocio !== null
                                && Object.keys(negocioByQrWrapperState?.negocio)?.length > 0
                                ? <ResolutivoNegocioDetalles
                                    negocio={negocioByQrWrapperState?.negocio ?? null}
                                />
                                : <h1 >Negocio no encontrado</h1>
                        }
                    </div>
                    : <>
                        <h1>Cargando información del negocio</h1>
                        <LoadingIndicator size={'large'} />
                    </>
            }


        </>

    )
}
