import React from "react";
import { Layout,Space } from "antd";
import { preguntasFrecuentes } from "../utils/preguntas";
import SideMenu from "../components/SideMenu";
import useWindowWidth from "../../utils/hooks/useWindowWith.jsx";



export default function PreguntasFrecuentes() {
    const windowWidth = useWindowWidth();
    const toggleSidenav = () => {
        // Agrega la lógica para alternar el sidenav
         // Ejemplo: Imprime un mensaje en la consola al hacer clic en el botón
        // Aquí puedes agregar la lógica para mostrar u ocultar el sidenav según sea necesario
      };
      return (
        <SideMenu />
      );
}
