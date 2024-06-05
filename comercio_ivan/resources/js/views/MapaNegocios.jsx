import React, { useEffect, useState } from "react";
import GoogleMapReact from "google-map-react";
import { Spin, Tooltip } from "antd";
import axios from "axios";
import RolesRouter from "./RolesRouter";

const defaultProps = {
    center: {
        lat: 24.1223922,
        lng: -110.3153547,
    },
    zoom: 13,
};

export default function MapaNegocios() {
    const [negocios, setNegocios] = useState();
    const [loading, setLoading] = useState(true);
    const [mapObject, setMapObject] = useState();

    const getNegociosJoinDenue = () => {
        axios
            .get("/sare_join")
            .then((response) => {
                response.data.map((negocio) => {
                    if (
                        negocio.ENCONTRADOS === "1" &&
                        (negocio.LICENCIA_2022 === null ||
                            negocio.LICENCIA_2022 === "")
                    ) {
                        negocio.status = "EN REVISION";
                    } else {
                        if (
                            negocio.ENCONTRADOS === "1" &&
                            negocio.LICENCIA_2022 === "1"
                        ) {
                            negocio.status = "APROBADO";
                        }
                    }
                });
                setNegocios(response.data);
                setLoading(false);
            })
            .catch((error) => console.log(error));
    };

    useEffect(() => {
        getNegociosJoinDenue();
    }, []);

    const createMarkers = () => {
        negocios.forEach((negocio) => {
            const infowindow = new google.maps.InfoWindow({
                content: `<div>
                <div>
                    <strong>Folio: </strong>
                    ${negocio.FOLIO}
                </div>
                <div>
                    <strong>Establecimiento: </strong>
                    ${negocio.ESTABLECIMIENTO}
                </div>
                <div>
                    <strong>Dueño: </strong>
                    ${negocio.NOMBRE} ${negocio.APELLIDO1} ${negocio.APELLIDO2}
                </div>
            </div>`,
            });
            if (negocio.LATITUDE === null && negocio.LONGITUDE === null) {
                console.log("TODO: get lat lng with google api");
            }
            const marker = new google.maps.Marker({
                position: {
                    lat: parseFloat(negocio.LATITUDE),
                    lng: parseFloat(negocio.LONGITUDE),
                },
                icon: {
                    url: getIconState(negocio.status),
                    scaledSize: new google.maps.Size(20, 29),
                },
                title: "Negocio folio: " + negocio.FOLIO,
                map: mapObject,
                draggable: false,
            });
            marker.addListener("click", () => {
                infowindow.open({
                    anchor: marker,
                    mapObject,
                    shouldFocus: false,
                });
            });
        });
    };

    useEffect(() => {
        if (negocios !== undefined && negocios !== null) {
            createMarkers();
        }
    }, [negocios]);

    const getIconState = (estado) => {
        switch (estado) {
            case "APROBADO":
                return "/imagenes/negocio_en_regla_.png";
            case "EN REVISION":
                return "/imagenes/negocio_pendientes_.png";
            case "NO REGISTRADO":
                return "/imagenes/negocio_no_registrado_.png";
            default:
                return "/imagenes/negocio_no_registrado_.png";
        }
    };
    return (
        <div style={{ height: "100vh", width: "100%", position: "relative" }}>
            <RolesRouter/>
            {loading && (
                <div
                    style={{
                        height: "100vh",
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "absolute",
                        top: 0,
                        left: 0,
                        zIndex: 2,
                    }}
                >
                    <Spin size="large" />
                </div>
            )}
            <GoogleMapReact
                bootstrapURLKeys={{
                    key: "AIzaSyAp2zsijKSTOl9BLx6CDcyNIN9KhINXTzM",
                }}
                defaultCenter={defaultProps.center}
                defaultZoom={defaultProps.zoom}
                yesIWantToUseGoogleMapApiInternals
                onGoogleApiLoaded={({ map, maps }) => {
                    console.log(map, maps);
                    setMapObject(map);
                }}
            >
                {/* {negocios?.map((negocio) => (
                    // <CustomMarker
                    //     key={Math.random()}
                    //     lat={negocio?.direccion?.latitud}
                    //     lng={negocio?.direccion?.longitude}
                    //     estado={negocio?.status}
                    // />
                    <CustomMarker
                        key={Math.random()}
                        lat={+negocio?.LATITUDE}
                        lng={+negocio?.LONGITUDE}
                        estado={negocio?.status}
                        negocio={negocio}
                    />
                ))} */}
            </GoogleMapReact>
        </div>
    );
}
