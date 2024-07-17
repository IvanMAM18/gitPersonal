import React from "react";
import { Layout,Space } from "antd";
import { preguntasFrecuentes } from "../utils/preguntas";



export default function PreguntasFrecuentes() {
    const toggleSidenav = () => {
        // Agrega la lógica para alternar el sidenav
        console.log('Sidenav toggled'); // Ejemplo: Imprime un mensaje en la consola al hacer clic en el botón
        // Aquí puedes agregar la lógica para mostrar u ocultar el sidenav según sea necesario
      };
    
      return (
        <div>
            <nav className="navbar bg-pink-300 ">
                <Space>
                    <img src="/imagenes/logo.png" alt="" id="logo" className="w-10" />
                    <a className="navbar-brand text-white" href="index.html">Centro de ayuda</a>
                </Space>
            </nav>
        </div>
      );
}
