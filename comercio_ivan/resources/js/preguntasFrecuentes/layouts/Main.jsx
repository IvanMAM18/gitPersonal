import React, { useEffect, useState } from "react";
import { Button,Space, Menu, Divider, Row, Col,Layout } from "antd";
import {QuestionCircleOutlined} from "@ant-design/icons";
import MainPreguntaSelect from "./MainPreguntaSelect" 

export default function Main({ preguntaSelect, indexSelect, selectSideMenu }) {
    const [selectedPregunta, setSelectedPregunta] = useState(false);
    const [selectedPreguntaIndex, setSelectedPreguntaIndex] = useState('');

    const handleButtonClick = (title) => {
        setSelectedPregunta(false);
        setSelectedPreguntaIndex(title);
    };
    return (
        <>
            <div className="">
                
                {
                    selectSideMenu === false 
                        ?
                            ( 
                            <div className="px-4 w-full h-screen">
                                    <h2 className="text-red-900 pt-2" style={{textShadow: '1px 1px 0 black',}}>Bienvenido al Centro de Ayuda</h2>
                                    <h6>Aquí puedes encontrar respuestas a las preguntas más frecuentes.</h6>
                                    <div className="grid grid-cols-3 gap-2 pt-3">
                                        {
                                            preguntaSelect.map((preguntas, index) => (
                                                <React.Fragment key={index}>
                                                    <div className="text-black w-auto h-36 px-4 pt-2 rounded-lg shadow shadow-gray-600 cursor-pointer hover:shadow-lg hover:shadow-red-950 hover:bg-red-900 hover:text-white">
                                                        <Space >
                                                            <QuestionCircleOutlined className="mb-1"/>
                                                            <span className="text-2xl">{preguntas.subtitle}</span>
                                                        </Space>
                                                        <br />
                                                        <div className="pl-3 pt-3">
                                                            <span> {preguntas.description} </span>
                                                        </div>
                                                        
                                                    </div>
                                                </React.Fragment>
                                            ))
                                        }
                                        <div className="text-black w-auto h-36 px-4 pt-2 rounded-lg shadow shadow-gray-600 cursor-pointer hover:shadow-lg hover:shadow-red-950 hover:bg-red-900 hover:text-white">
                                                        <Space >
                                                            <QuestionCircleOutlined className="mb-1"/>
                                                            <span className="text-2xl">preguntas.subtitle</span>
                                                        </Space>
                                                        <br />
                                                        <div className="pl-3 pt-3">
                                                            <span> preguntas.description </span>
                                                        </div>
                                                        
                                                    </div>
                                                    <div className="text-black w-auto h-36 px-4 pt-2 rounded-lg shadow shadow-gray-600 cursor-pointer hover:shadow-lg hover:shadow-red-950 hover:bg-red-900 hover:text-white">
                                                        <Space >
                                                            <QuestionCircleOutlined className="mb-1"/>
                                                            <span className="text-2xl">preguntas.subtitle</span>
                                                        </Space>
                                                        <br />
                                                        <div className="pl-3 pt-3">
                                                            <span> preguntas.description </span>
                                                        </div>
                                                        
                                                    </div>
                                                    <div className="text-black w-auto h-36 px-4 pt-2 rounded-lg shadow shadow-gray-600 cursor-pointer hover:shadow-lg hover:shadow-red-950 hover:bg-red-900 hover:text-white">
                                                        <Space >
                                                            <QuestionCircleOutlined className="mb-1"/>
                                                            <span className="text-2xl">preguntas.subtitle</span>
                                                        </Space>
                                                        <br />
                                                        <div className="pl-3 pt-3">
                                                            <span> preguntas.description </span>
                                                        </div>
                                                        
                                                    </div>
                                                    <div className="text-black w-auto h-36 px-4 pt-2 rounded-lg shadow shadow-gray-600 cursor-pointer hover:shadow-lg hover:shadow-red-950 hover:bg-red-900 hover:text-white">
                                                        <Space >
                                                            <QuestionCircleOutlined className="mb-1"/>
                                                            <span className="text-2xl">preguntas.subtitle</span>
                                                        </Space>
                                                        <br />
                                                        <div className="pl-3 pt-3">
                                                            <span> preguntas.description </span>
                                                        </div>
                                                        
                                                    </div>
                                                    <div className="text-black w-auto h-36 px-4 pt-2 rounded-lg shadow shadow-gray-600 cursor-pointer hover:shadow-lg hover:shadow-red-950 hover:bg-red-900 hover:text-white">
                                                        <Space >
                                                            <QuestionCircleOutlined className="mb-1"/>
                                                            <span className="text-2xl">preguntas.subtitle</span>
                                                        </Space>
                                                        <br />
                                                        <div className="pl-3 pt-3">
                                                            <span> preguntas.description </span>
                                                        </div>
                                                        
                                                    </div>
                                    </div>
                            </div>
                            )
                        :
                            ( 
                                indexSelect != '' ?
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
                                :
                                (
                                    <MainPreguntaSelect 
                                        preguntaSelect={preguntaSelect[selectedPregunta]}
                                        indexSelect={selectedPregunta}
                                    />
                                )
                            )
                }
            </div>
        </>
    );
}
