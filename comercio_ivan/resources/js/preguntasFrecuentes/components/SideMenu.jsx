import React, { useEffect, useState } from "react";
import { Button, Menu, Divider, Row, Col,Layout } from "antd";
import { Link } from "react-router-dom";
import {
    MenuOutlined,
    CloseOutlined
} from "@ant-design/icons";
import { preguntasFrecuentes } from "../utils/preguntas";
import useWindowWidth from "../../utils/hooks/useWindowWith.jsx";


export default function SideMenu() {
    const [isSidebarVisible, setIsSidebarVisible] = useState(true);
      
     const toggleSidebar = () => {
          setIsSidebarVisible(!isSidebarVisible);
        }
    const windowWidth = useWindowWidth();
    const arrayPreguntas = [];
    
    return (
        <>
                {/*  */}
            <div className="flex h-screen">
                {
                    isSidebarVisible ? (

                        <div className="w-60 bg-red-800">
                            <Button
                                type="link"
                                className="text-white px-2 py-2 flex items-center justify-center ml-48"
                                onClick={toggleSidebar}
                            >
                                {isSidebarVisible ? <CloseOutlined className="hover:text-red-200" />  : <MenuOutlined />}
                            </Button>
                            <ul className="py-4 text-white">
                                {
                                    preguntasFrecuentes.map((preguntas, index) => (
                                        <React.Fragment key={index}>
                                            <li className="px-4 py-2">{preguntas.subtitle}</li>
                                        </React.Fragment>
                                    ))
                                }
                            </ul>
                        </div>
                    ) : ( 
                        <div className="w-8 bg-red-800">
                            <Button
                                type="link"
                                className="text-white hover:text-blue-800 px-2 py-2 rounded flex items-center justify-center"
                                onClick={toggleSidebar}
                            >
                                {isSidebarVisible ? <CloseOutlined />  : <MenuOutlined className="hover:text-red-200"/>}
                            </Button>
                        </div> 
                    )
                }
                <br />
                <span>Holadddddd ddddddd</span>
            </div>
        </>
    );
}
