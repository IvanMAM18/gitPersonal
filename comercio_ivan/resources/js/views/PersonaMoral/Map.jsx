import React, { useEffect, useState } from "react";
import GoogleMapReact from "google-map-react";
import { PushpinTwoTone } from "@ant-design/icons";

function MapWrapper({ value = {}, onChange }) {
    const [coordenadas, setCoordenadas] = useState({
        latitud: value?.latitud ?? 24.1481589,
        longitude: value?.longitude ?? -110.3181937,
    });

    useEffect(() => {
        triggerChange({
            latitud: value?.latitud ?? 24.1481589,
            longitude: value?.longitude ?? -110.3181937,
        });
    }, []);

    const triggerChange = (changedValue) => {
        onChange?.({
            ...coordenadas,
            ...value,
            ...changedValue,
        });
    };

    const Marker = () => (
        <PushpinTwoTone
            twoToneColor="#eb2f96"
            style={{
                transform: "translate(-7%, -100%)",
                fontSize: 30,
            }}
        />
    );
    const onUserSetPin = ({ lat, lng }) => {
        setCoordenadas({
            latitud: lat,
            longitude: lng,
        });
        triggerChange({
            latitud: lat,
            longitude: lng,
        });
    };

    return (
        <div className="map-container">
            <GoogleMapReact
                onClick={({ lat, lng }) => onUserSetPin({ lat, lng })}
                bootstrapURLKeys={{
                    key: "AIzaSyAp2zsijKSTOl9BLx6CDcyNIN9KhINXTzM",
                }}
                defaultCenter={{
                    lat: value?.latitud ?? coordenadas?.latitud,
                    lng: value?.longitude ?? coordenadas?.longitude,
                }}
                defaultZoom={13}
            >
                <Marker
                    lat={value?.latitud ?? coordenadas?.latitud}
                    lng={value?.longitude ?? coordenadas?.longitude}
                    text="MARKER"
                />
            </GoogleMapReact>
        </div>
    );
}
const Map = React.memo(MapWrapper);
export default Map;
