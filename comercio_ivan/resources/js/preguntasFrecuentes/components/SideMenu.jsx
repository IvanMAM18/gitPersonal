import React, { useEffect, useState } from "react";
import { Button, Space} from "antd";
import {
    MenuOutlined,
    CloseOutlined
} from "@ant-design/icons";
import { preguntasFrecuentes } from "../utils/preguntas";
import Main from "./Main.jsx";

export default function SideMenu() {
    const [isSidebarVisible, setIsSidebarVisible] = useState(true);
    const [selectedTitle, setSelectedTitle] = useState('');
      
    const toggleSidebar = () => {
        
        setTimeout(() => {
              setIsSidebarVisible(!isSidebarVisible);
          }, 405);
    }

    const handleButtonClick = (title) => {
        setSelectedTitle(title);
    };

    return (
        <>
            <div className="">
                {
                    isSidebarVisible ? (

                        <div className="w-60 bg-red-900">

                            <Button
                                type="link"
                                className="text-white px-2 py-2 flex items-center justify-center ml-52"
                                onClick={toggleSidebar}
                            >
                                {isSidebarVisible ? <CloseOutlined className="hover:text-red-200" />  : <MenuOutlined />}
                            </Button>
                            <img src="/imagenes/logo.png" className="w-32 mx-auto my-auto hover:w-36 ease-in-out duration-300 cursor-pointer" onClick={() => handleButtonClick('')}/>
                            <Button 
                                type="link" 
                                className="px-2"
                                onClick={() => handleButtonClick('')}
                            > 
                               <span className="text-2xl text-red-950 font-bold hover:text-red-200 ease-in-out duration-300" style={{textShadow: '1px 1px 0 black',}}> centro de ayuda</span>
                            </Button>
                            <ul className="py-3 text-white">
                                {
                                    preguntasFrecuentes.map((preguntas, index) => (
                                        <React.Fragment key={index}>
                                            <li className="px-8 py-2 hover:bg-red-950 ease-in-out duration-300">
                                                <Button
                                                    type="link" 
                                                    className="hover:text-red-950 ease-in-out duration-300"
                                                    onClick={() => handleButtonClick(index)}
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
                        <div className="w-8 bg-red-900 ">
                            <Space>

                            <Button
                                type="link"
                                className="text-white hover:text-blue-800 px-2 rounded flex items-center justify-center"
                                onClick={toggleSidebar}
                            >
                                {isSidebarVisible ? <CloseOutlined />  : <MenuOutlined className="hover:text-red-200 "/>}
                            </Button>
                            <span className="w-full">Centrodeayudassssssssssssssssssssssssssssssssssssss</span>
                            </Space>
                        </div> 
                    )
                }
                <br />
                <Main 
                    preguntaSelect={selectedTitle === '' ? preguntasFrecuentes : preguntasFrecuentes[selectedTitle]}
                    indexSelect={selectedTitle}
                />
                
            </div>
        </>
    );
}
