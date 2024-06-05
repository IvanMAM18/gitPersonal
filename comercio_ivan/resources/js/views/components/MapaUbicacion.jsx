import React, { useEffect } from "react";
import { PushpinOutlined } from "@ant-design/icons";
import GoogleMapReact from "google-map-react";
const Marker = () => (
    <PushpinOutlined
        style={{
            transform: "translate(-7%, -100%)",
            fontSize: 30,
            color: "red",
        }}
    />
);
const geojson = {
    type: "FeatureCollection",
    features: [
        {
            type: "Feature",
            geometry: {
                type: "Polygon",
                coordinates: [
                    [
                        [-122.795117119976, 27.7195728086301],
                        [-122.795381326658, 27.7192184039876],
                        [-122.795508599062, 27.7193167499766],
                        [-122.795247739697, 27.7196702903683],
                        [-122.795117119976, 27.7195728086301],
                    ],
                ],
            },
            properties: {
                id: 407341,
                clave: "101001003013",
                folio: 28194,
                ambito: "URBANO",
            },
        },
    ],
};
export default function MapaUbicacion({ position }) {
    const handleApiLoaded = (map, maps) => {
        const drawLayer = new window.google.maps.Data({ map: map });
        drawLayer.addGeoJson(geojson.features[0]);
        drawLayer.setStyle((feature) => {
            return {
                fillOpacity: 0.2,
                fillColor: "#994545",
                strokeWeight: 2,
                strokeColor: "#1a1a1a",
                strokeOpacity: 1,
            };
        });
    };

    return (
        <div
            style={{
                height: "40vh",
                width: "100%",
                padding: 30,
            }}
        >
            <GoogleMapReact
                bootstrapURLKeys={{
                    key: "AIzaSyAp2zsijKSTOl9BLx6CDcyNIN9KhINXTzM",
                }}
                defaultCenter={position}
                center={position}
                defaultZoom={16}
                onGoogleApiLoaded={({ map, maps }) =>
                    handleApiLoaded(map, maps)
                }
            >
                {!!position && <Marker lat={position.lat} lng={position.lng} text="MARKER" />}
            </GoogleMapReact>
        </div>
    )
}