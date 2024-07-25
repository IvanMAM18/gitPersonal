import React, { useEffect, useState } from "react";
import { Button,Space, Menu, Divider, Row, Col,Layout } from "antd";
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
        
        setTimeout(() => {
              setIsSidebarVisible(!isSidebarVisible);
          }, 405);
    }
    const windowWidth = useWindowWidth();
    const arrayPreguntas = [];
    
    return (
        <>
            <div className="flex h-screen">
                {
                    isSidebarVisible ? (

                        <div className="w-60 bg-red-800" style={{ background: '#994545' }}>

                            <Button
                                type="link"
                                className="text-white px-2 py-2 flex items-center justify-center ml-52"
                                onClick={toggleSidebar}
                            >
                                {isSidebarVisible ? <CloseOutlined className="hover:text-red-200" />  : <MenuOutlined />}
                            </Button>
                            <img src="/imagenes/logo.png" className="w-32 mx-auto my-auto"/>
                            <h4 className="mx-2.5 mt-1.5 text-red-950">Centro de ayuda</h4>
                            <ul className="py-2 text-white">
                                {
                                    preguntasFrecuentes.map((preguntas, index) => (
                                        <React.Fragment key={index}>
                                            <li className="px-8 py-2 hover:bg-red-800 ease-in-out duration-300">
                                                <Button
                                                    type="link" 
                                                    className="hover:text-red-950 hover:font-bold ease-in-out duration-300"
                                                > 
                                                    <span className="text-white">{preguntas.subtitle}</span>   
                                                </Button>  
                                            </li>
                                        </React.Fragment>
                                    ))
                                }
                            </ul>
                        </div>
                    ) : ( 
                        <div className="w-8 bg-red-800" style={{ background: '#994545' }}>
                            <Button
                                type="link"
                                className="text-white hover:text-blue-800 px-2 py-2 rounded flex items-center justify-center"
                                onClick={toggleSidebar}
                            >
                                {isSidebarVisible ? <CloseOutlined />  : <MenuOutlined className="hover:text-red-200 "/>}
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
