import React, { useEffect, useState } from "react";
import GoogleMapReact from "google-map-react";
import { PushpinTwoTone } from "@ant-design/icons";

export default function Map({ setCoordenadasMapa, direccion }) {
    const [coordenadas, setCoordenadas] = useState({
        latitud: +direccion?.latitud ?? 24.1481589,
        longitude: +direccion?.longitude ?? -110.3181937,
    });
    useEffect(() => {
        setCoordenadasMapa(coordenadas);
    }, [coordenadas]);
    const Marker = () => (
        <PushpinTwoTone
            twoToneColor="#eb2f96"
            style={{
                transform: "translate(-7%, -100%)",
                fontSize: 30,
            }}
        />
    );
    return (
        <div className="map-container">
            <GoogleMapReact
                onClick={({ lat, lng }) => {
                    setCoordenadas({
                        latitud: lat,
                        longitude: lng,
                    });
                }}
                bootstrapURLKeys={{
                    key: "AIzaSyAp2zsijKSTOl9BLx6CDcyNIN9KhINXTzM",
                }}
                defaultCenter={{
                    lat: +coordenadas?.latitud ?? 24.1481589,
                    lng: +coordenadas?.longitude ?? -110.3181937,
                }}
                defaultZoom={13}
            >
                <Marker
                    lat={+coordenadas?.latitud}
                    lng={+coordenadas?.longitude}
                    text="MARKER"
                />
            </GoogleMapReact>
        </div>
    );
}
