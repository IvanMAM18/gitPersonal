import React from "react";
import GoogleMapReact from "google-map-react";
import { PushpinOutlined } from "@ant-design/icons";
const MapMemoized = React.memo(({ direccion, setDireccion }) => {
    const Marker = () => (
        <PushpinOutlined
            style={{
                transform: "translate(-7%, -100%)",
                fontSize: 30,
                color: "#d50000",
            }}
        />
    );
    return (
        <div style={{ height: 280 }}>
            <GoogleMapReact
                onClick={({ lat, lng }) => {
                    setDireccion({
                        ...direccion,
                        latitud: lat,
                        longitude: lng,
                    });
                }}
                bootstrapURLKeys={{
                    key: "AIzaSyAp2zsijKSTOl9BLx6CDcyNIN9KhINXTzM",
                }}
                defaultCenter={{
                    lat: +direccion?.latitud ?? 24.142392,
                    lng: +direccion?.longitude ?? -110.312505,
                }}
                defaultZoom={13}
            >
                <Marker
                    lat={+direccion?.latitud}
                    lng={+direccion?.longitude}
                    text="MARKER"
                />
            </GoogleMapReact>
        </div>
    );
});

export default MapMemoized;
