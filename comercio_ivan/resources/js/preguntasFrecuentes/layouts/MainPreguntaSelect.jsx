import React, { useEffect, useState } from "react";
import { Button,Space, Menu, Divider, Row, Col,Layout } from "antd";
import {QuestionCircleOutlined} from "@ant-design/icons";


export default function MainPreguntaSelect({ preguntaSelect, indexSelect}) {
    const [selectedTitle, setSelectedTitle] = useState('');
    const [cambio, setCambio] = useState(true);

    
    const handleButtonClick = (title) => {
        setCambio(false);
        setSelectedTitle(title);
    };
    // useEffect(() => {
    //     setCambio(true);
    //   });

    console.log(preguntaSelect);
    return (
        <>
            {
                cambio ? 
                (
                    <div className="w-full h-full">
            <div className="w-9/12 mx-auto text-center">
            <span className=" text-red-900 text-3xl font-medium" style={{textShadow: '1px 1px 0 black',}}> Preguntas Frecuentes - {preguntaSelect.subtitle} </span>
        </div>
                        <div className="px-2 pt-6 pb-10 mx-auto w-9/12 rounded-lg">
                            {
                                preguntaSelect.preguntas.map((preguntas,index)=>(
                                    <React.Fragment key={index}>
                                        <div 
                                            className="w-full py-2.5 mb-1.5 border-2 border-red-900 rounded-lg cursor-pointer hover:shadow-lg hover:shadow-red-950 hover:bg-red-900 hover:text-white ease-in-out duration-300"
                                            onClick={() => handleButtonClick(index)}
                                            >
                                            <Space className="pl-2">
                                                <QuestionCircleOutlined className="mb-1"/>
                                                <span className="subpixel-antialiased"> {preguntas.title} </span> 
                                            </Space>
                                        </div>
                                    </React.Fragment>
                            ))
                        }
                        </div>
    </div> 
        ) 
                :

                    <div className="w-full h-full">
                        <div className="flex h-screen">
                            <div className="w-7/12 rounded-lg p-4 mx-8 border-2 border-red-900 mb-4">
                                <h3 className="text-red-950" style={{textShadow: '1px 1px 0 black',}}>{preguntaSelect.preguntas[selectedTitle].title}</h3>
                                <div className="subpixel-antialiased pt-4" dangerouslySetInnerHTML={{ __html: preguntaSelect.preguntas[selectedTitle].content }} />
                            </div>
                            <div className="w-4/12 p-4 mb-4">
                                <h5 className="pb-4">Ayuda-{preguntaSelect.subtitle}</h5>
                                    {
                                        preguntaSelect.preguntas.map((preguntas,index)=>{
                                            if (selectedTitle === index) { // Condición para verificar si hay un título
                                                return (
                                                    <React.Fragment key={index}>
                                                        <Space className="pl-2 cursor-default font-bold text-red-900 mb-2">
                                                            <QuestionCircleOutlined className="mb-1"/>
                                                            <span className="subpixel-antialiased"> {preguntas.title} </span> 
                                                        </Space>
                                                    </React.Fragment>
                                                )
                                            }else{
                                                return (
                                                    <React.Fragment key={index}>
                                                        <Space 
                                                            className="pl-2 cursor-pointer hover:font-bold mb-2"
                                                            onClick={() => handleButtonClick(index)}
                                                        >
                                                            <QuestionCircleOutlined className="mb-1"/>
                                                            <span className="subpixel-antialiased"> {preguntas.title} </span> 
                                                        </Space>
                                                    </React.Fragment>
                                                )
                                            }
                                        })
                                    }
                            </div>
                        </div>
                    </div>
            }
                
                
                
        </>
    );
}
