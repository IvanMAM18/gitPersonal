import React, { useEffect, useState } from "react";
import { Button, Space} from "antd";
import {
    MenuOutlined,
    CloseOutlined
} from "@ant-design/icons";
import { preguntasFrecuentes } from "../utils/preguntas.jsx";

export default function SideMenu({preguntasSelect}) {

    const [isSidebarVisible, setIsSidebarVisible] = useState(true);
    const [selectTitle, setSelectTitle] = useState('');
      
    const toggleSidebar = () => {
        setTimeout(() => {
              setIsSidebarVisible(!isSidebarVisible);
          }, 200);
    }

    const handleClick = () => {
        setIsSidebarVisible(true);
    };

    const handleButtonClick = (idPregunta) => {
        setSelectTitle(idPregunta);
        if(idPregunta===''){
            preguntasSelect(preguntasFrecuentes);
        }else{
            preguntasSelect(preguntasFrecuentes[idPregunta]);
        }
    };
    
    useEffect(() => {
        document.addEventListener('click', handleClick);
        return () => {
          document.removeEventListener('click', handleClick);
        };
    }, []);


    return (
        <>
        
            {
                isSidebarVisible ? 
                (
                    
                    <div className="flex">
                        <div 
                            className="w-10 mx-1 my-1 pt-1.5  rounded-lg text-center text-white bg-red-900 cursor-pointer hover:rounded-full ease-in-out duration-200" 
                            onClick={toggleSidebar}
                        >
                            {isSidebarVisible ? <MenuOutlined className="hover:text-red-200"/>  : <CloseOutlined />}
                        </div> 
                        <div className="mx-1 cursor-pointer">
                            <Space>
                                <img src="/imagenes/logo.png" className="w-9 cursor-pointer ease-in-out duration-200" onClick={() => handleButtonClick('')}/>
                                <h4 className="mt-2 hover:text-red-900 hover:font-bold ease-in-out duration-200" onClick={() => handleButtonClick('')}>Centro de ayuda</h4>
                            </Space>
                        </div>
                    </div>
                ) : ( 
                    <div>
                        <div className="fixed h-full w-60 bg-red-900">
                            <Button
                                type="link"
                                className="flex text-white px-2 py-2 ml-52  items-center justify-center "
                                onClick={toggleSidebar}
                            >
                                {isSidebarVisible ? <MenuOutlined />  : <CloseOutlined className="hover:text-red-200" />}
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
                                                    <span className="text-white hover:font-medium">{preguntas.subtitle}</span>   
                                                </Button>  
                                            </li>
                                        </React.Fragment>
                                    ))
                                }
                            </ul>
                        </div>
                        <div className="py-6"></div>
                    </div>
                )
            }
        </>
    );
}
