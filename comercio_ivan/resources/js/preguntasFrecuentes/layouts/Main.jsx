import React, { useEffect, useState } from "react";
import { Button,Space, Menu, Divider, Row, Col,Layout } from "antd";
import {QuestionCircleOutlined} from "@ant-design/icons";
import MainPreguntaSelect from "./MainPreguntaSelect" 

export default function Main({ preguntaSelect, indexSelect, selectSideMenu }) {

    return (
        <>
            <div className="">
                
                {
                    selectSideMenu 
                        ?
                        
                            ( 
                                <MainPreguntaSelect 
                                    preguntaSelect={preguntaSelect}
                                    indexSelect={indexSelect}
                                />
                                
                            )
                        :
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

                            
                        }
            </div>
                        {console.log(indexSelect+'----'+selectSideMenu+'----'+cambio)}
        </>
    );
}
