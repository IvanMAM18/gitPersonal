import React, { useEffect, useState } from 'react';
import RefrendarNegocios from './RefrendarNegocios';
import { Button } from 'antd';
import { filterNegociosByYear, validateClaveCatastralDeNegocios } from './Utils';

export default function BotonRefrendar({ negocios = null, añoParaBuscar = new Date().getFullYear(), refreshNegocios }) {
    const [modalProps, setModalPros] = useState({
        open: false,
        title: `Refrendar negocios del año ${añoParaBuscar}`,
        onCancel: () => { setModalPros({ ...modalProps, open: false }) },
        footer: [],
        width: 750,
        refresh: false
    });
    //para guardar los negocios para refrendar y los negocios que tienen algun problema y no pueden refrendar
    const [negociosLista, setNegociosLista] = useState({
        negociosValidos: null,
        negociosNoValidos: null,
        negociosValidadosTramiteUsoSuelo: false
    });
    const resetModal = () => {
        setNegociosLista(null);
        setModalPros({ ...modalProps, open: false });
    }
    useEffect(() => {
        if (negociosLista === null) {
            setModalPros({ ...modalProps, open: false, refresh: true });
        }
    }, [negociosLista]);

    useEffect(() => {
        if (negociosLista?.negociosValidos?.length > 0 && negociosLista?.negociosValidadosTramiteUsoSuelo === false) {
            const checkValidoUsoSueloAnnioPasado = (tramites) => {
                if ((tramites?.length ?? 0) === 0)
                    return false;
                const tramitesAnnioPasadoUsoSuelo = tramites?.filter(tramite =>
                    new Date(tramite?.created_at).getFullYear() === new Date().getFullYear() - 1
                    && [5, 6].includes(tramite?.catalogo_tramites_id)
                    && ["APROBADO", "VISTO BUENO", "VISOR"].includes(tramite?.ultima_revision?.status)
                    && ((
                        tramite?.catalogo_tramites_id === 6
                        && tramite?.aviso_entero !== null
                        && tramite?.aviso_entero?.pagado === true
                    ) || tramite?.catalogo_tramites_id === 5))
                console.log({ tramitesAnnioPasadoUsoSuelo })
                if (tramitesAnnioPasadoUsoSuelo?.length === 0) return false;
                return true;

            }

            setNegociosLista({
                ...negociosLista,
                negociosValidos: negociosLista?.negociosValidos.filter(negocio => checkValidoUsoSueloAnnioPasado(negocio?.tramites)),
                negociosValidadosTramiteUsoSuelo: true
            });
        }
    }, [negociosLista?.negociosValidos]);

    useEffect(() => {
        if (modalProps.refresh === true) {
            refreshNegocios();
        }
    }, [modalProps.refresh])

    useEffect(() => {
        if (negocios !== null && negocios?.length > 0) {
            const negociosValidos = filterNegociosByYear(negocios, añoParaBuscar);
            if (negociosValidos.length > 0) {

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
            {negociosLista?.negociosValidos !== null && <>
                <Button
                    className="button-container"
                    type={"primary"}
                    onClick={() => setModalPros({ ...modalProps, open: true })}
                    disabled={negociosLista?.negociosValidos?.length === 0}
                >
                    {negociosLista?.negociosValidos?.length === 0 ? "No hay negocios para refrendar" : "Refrendar Negocios (sin cambios)"}
                </Button>
                <RefrendarNegocios
                    negocios={negociosLista?.negociosValidos ?? null}
                    modalProps={modalProps}
                    setModalPros={setModalPros}
                    refreshNegocios={refreshNegocios}
                    resetModal={resetModal}
                />
            </>}
        </>
    )
}
