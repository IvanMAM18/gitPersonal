import React, { useEffect, useState } from 'react'
import LogoImage from '../../../asstes/ayuntamiento-logo-full-color.png';


export default function BannerHeader() {
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
                    status: "this.status",
                    statusText: xhr.statusText,
                });
            };
            xhr.open("GET", url);
            xhr.responseType = "blob";
            xhr.send();
        });
    };
    const setImageAsUrlBase64 = async () => {
        const qrSRC = `../`;
        let urlBase64 = await toDataUrl(qrSRC);
        console.log({ urlBase64 });
        setUrlBase64(urlBase64);
    }
    useEffect(() => {
        setImageAsUrlBase64();
    }, []);
    return (
        <div
            className={`banner_container `}
        >
            <div className="logo">
                <a className="navbar-brand" href="https://lapaz.gob.mx">
                    {LogoImage && <img src={LogoImage} alt="Ayuntamiento" />}
                    <span><span>H.XVII Ayuntamiento de La Paz</span><span>Baja California Sur</span></span>
                </a>
            </div>
        </div>
    )
}
