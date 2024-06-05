
import React, { useEffect, useState } from 'react';


export default function NegocioByQrBanner({ negocio, downloadBanner }) {
    const [urlBase64, setUrlBase64] = useState(null);

    const toDataUrl = async function (url, callback) {
        //Convert to base64
        return new Promise((resolve, reject) => {
            var xhr = new XMLHttpRequest();
            xhr.onload = function () {
                var reader = new FileReader();
                reader.onloadend = function () {
                    resolve(reader.result);
                };
                reader.readAsDataURL(xhr.response);
            };
            xhr.onerror = () => {
                reject({
                    status: this.status,
                    statusText: xhr.statusText,
                });
            };
            xhr.open("GET", url);
            xhr.responseType = "blob";
            xhr.send();
        });
    };
    const setImageAsUrlBase64 = async () => {
        const qrSRC = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&margin=50&data=https://comercio.lapaz.gob.mx/informacion_negocio_detalles/${negocio?.id ?? -1}`;
        let urlBase64 = await toDataUrl(qrSRC);
        setUrlBase64(urlBase64);
    }

    useEffect(() => {
        setImageAsUrlBase64();
    }, []);
    useEffect(() => {
        if (urlBase64 !== null) {
            setTimeout(() => { downloadBanner(negocio?.nombre_del_negocio); }, 1000);

        }
    }, [urlBase64]);

    const getDireccionFromNegocio = (tramite) => {
        return `${tramite?.direccion?.calle_principal ?? ""} No.Ext.${tramite?.direccion?.numero_externo ?? " NA"
            } No.Int.${tramite?.direccion?.numero_interno || " NA"} ${tramite?.direccion?.calles !== null ? "e/ " + tramite?.direccion?.calles : ""
            } C.P. ${tramite?.direccion?.codigo_postal || " NA"}${tramite?.direccion?.colonia
                ? ` Col. ${tramite?.direccion?.colonia?.nombre_localidad || "NA"}`
                : ""
            }`;
    };
    const qrSRC = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&margin=50&data=https://comercio.lapaz.gob.mx/informacion_negocio_detalles/${negocio?.id ?? -1}`;
    return (
        <div className={negocio?.venta_alcohol ? "qr_container-alcohol" : "qr_container"}>
            <div className={"qr_ribbon"}>
                <span className={"ribbon_left_content"}>COMERCIO FIJO</span>
                <span className={"qr_image"}>
                    {urlBase64 && <img src={urlBase64} alt="Código QR" />}
                </span>
                <span className={"ribbon_right_content"}>
                    <span>{negocio?.venta_alcohol ? "CON" : "SIN"} VENTA DE</span>
                    <span>ALCOHOL</span>
                </span>
            </div>
            <div className={"qr_footer"}>
                <div className={"main_title"}>
                    {negocio?.nombre_del_negocio ?? "-"}
                </div>
                <div className={"address"}>{getDireccionFromNegocio(negocio)}</div>
            </div>
        </div>
    )
}
