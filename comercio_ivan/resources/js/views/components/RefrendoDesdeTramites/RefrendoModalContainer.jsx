import React, { useState, useEffect } from 'react';
import { filterNegociosByYear, validateClaveCatastralDeNegocios } from '../MisNegocios/Utils';
import RefrendarNegocios from './RefrendarNegocios';
import { Spin } from 'antd';

export default function RefrendoModalContainer({ setRefrendoDesdeTramites, refrendoDesdeTramites, negocios = null, añoParaBuscar = new Date().getFullYear(), refreshNegocios }) {
    const [modalProps, setModalPros] = useState({
        open: refrendoDesdeTramites,
        title: `Refrendar negocios del año ${añoParaBuscar}`,
        onCancel: () => { setModalPros({ ...modalProps, open: false }) },
        footer: [],
        width: 750,
        refresh: false
    });
    //para guardar los negocios para refrendar y los negocios que tienen algun problema y no pueden refrendar
    const [negociosLista, setNegociosLista] = useState({
        negociosValidos: null,
        negociosNoValidos: null
    });
    const resetModal = () => {
        setNegociosLista(null);
        setRefrendoDesdeTramites(false);
    }
    useEffect(() => {
        if (negociosLista === null) {
            setModalPros({ ...modalProps, open: false, refresh: true });
        }
    }, [negociosLista]);

    useEffect(() => {
        if (modalProps.refresh === true) {
            refreshNegocios();
        }
    }, [modalProps.refresh])

    useEffect(() => {
        if (modalProps.open === false) {
            setRefrendoDesdeTramites(false);
        }
    }, [modalProps.open])
    useEffect(() => {
        if (negocios !== null && negocios?.length > 0) {
            const negociosValidos = filterNegociosByYear(negocios, añoParaBuscar);
            if (negociosValidos?.length > 0) {

                axios
                    .get("/app/get_comercio_token")
                    .then((respuesta) => {
                        const token = respuesta?.data?.token;
                        validateClaveCatastralDeNegocios(negociosValidos, token, setNegociosLista, negociosLista);
                    })
                    .catch((error) => {
                        console.log({ error });
                    });
            } else {
                setNegociosLista({ ...negociosLista, negociosValidos: [] });
            }
        }
    }, [negocios]);

    return (
        <>
            {negocios.length !== 0 ?
                negociosLista?.negociosValidos !== null
                    ? <>
                        {negociosLista?.negociosValidos?.length === 0
                            ? <div >
                                <div style={{ fontSize: 10, whiteSpace: "nowrap" }}>NO HAY NEGOCIOS PARA REFRENDAR,</div>
                        
                            </div> :
                            <RefrendarNegocios
                                negocios={negociosLista?.negociosValidos ?? null}
                                modalProps={modalProps}
                                setModalPros={setModalPros}
                                refreshNegocios={refreshNegocios}
                                resetModal={resetModal}
                            />}

                    </>
                    : <div style={{ display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center", fontSize: 10 }}>
                        <span>Validando predio/s</span>
                        <Spin />
                    </div>
                :
                <div >
                    <div style={{ fontSize: 10, whiteSpace: "nowrap" }}>NO HAY NEGOCIOS PARA REFRENDAR,</div>
                </div>
            }
        </>
    )
}
