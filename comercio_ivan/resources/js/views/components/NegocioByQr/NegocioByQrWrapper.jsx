import axios from 'axios';
import React, { useEffect, useState, useRef,useCallback  } from 'react'
import NegocioByQrBanner from './NegocioByQrBanner.jsx';
import LoadingIndicator from "@/components/LoadingIndicator.jsx";
import "./NegocioByQr.scss";
import BannerHeader from './BannerHeader.jsx';
import { toJpeg } from 'html-to-image';

export default function NegocioByQrWrapper() {
    const ref = useRef(null)
    const negocioId = window.negocio_id;
    const [negocioByQrWrapperState, setNegocioByQrWrapperState] = useState({ negocio: null, loading: true, bgColor: (Math.floor(Math.random() * 5) + 1) });

    useEffect(() => {
        axios.get(`/app/get_informacion_negocio_for_banner/${negocioId}`)
            .then(response => setNegocioByQrWrapperState({ ...negocioByQrWrapperState, negocio: response?.data ?? null }))
            .catch(error => console.log({ error }));

    }, []);

    useEffect(() => {
        if (negocioByQrWrapperState?.negocio !== null) {
            setNegocioByQrWrapperState({ ...negocioByQrWrapperState, loading: false, })
        }
    }, [negocioByQrWrapperState?.negocio]);

    const downloadBanner = useCallback((nombre_del_negocio) => {
        if (ref.current === null) {
            return
        }
        const sectionElement = document.getElementById('negocio_by_qr');

        // Get width and height using clientWidth and clientHeight
        const width = sectionElement.clientWidth;
        const height = sectionElement.clientHeight;
        toJpeg(ref.current, {
            cacheBust: true,
            backgroundColor: "#fff",
            canvasWidth: width,
            canvasHeight: height * 1.2,
            width,
            height: height * 1.2,
            skipAutoScale: true,
        })
            .then((dataUrl) => {
                const link = document.createElement('a')
                link.download = `${nombre_del_negocio}.jpg`
                link.href = dataUrl;
                link.click();
                link.remove();
            })
            .catch((err) => {
                console.log(err)
            })
    }, [ref])


    return (

        <div ref={ref} id="negocio_by_qr" className={`negocio_by_qr bg_${negocioByQrWrapperState?.bgColor}`}>
            <BannerHeader />
            {
                negocioByQrWrapperState?.loading === false
                    ? <>
                        {
                            negocioByQrWrapperState?.negocio !== null
                                && Object.keys(negocioByQrWrapperState?.negocio)?.length > 0
                                ? <NegocioByQrBanner negocio={negocioByQrWrapperState?.negocio} downloadBanner={downloadBanner} />
                                : <h1 >Negocio no encontrado</h1>
                        }
                    </>
                    : <>
                        <h1>Cargando información del negocio</h1>
                        <LoadingIndicator size={'large'} />
                    </>
            }
        </div>
    )
}
