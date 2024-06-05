import React from "react";
import { Image } from "antd";
import RegisterDisclaimer from "@/components/Auth/RegisterDisclaimer.jsx";
export default function RegisterHeader({ mode }) {
    return (
        <>
            <img className="w-52 mx-auto" src="/imagenes/ESCUDO_color.png" />
            {mode === "register" && <RegisterDisclaimer />}
            <h1 className="text-center mb-12 text-4xl text-gray-800">Portal de trámites y <br/>servicios en línea</h1>
        </>
    );
}
