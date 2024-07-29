import React, { useEffect, useState } from "react";
import { Button,Space, Menu, Divider, Row, Col,Layout } from "antd";
import {QuestionCircleOutlined} from "@ant-design/icons";


export default function Main({ preguntaSelect, indexSelect }) {
    
    return (
        <>
            <div className="">
                
                {
                    indexSelect === '' 
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
                                <div className="px-4 py-6 bg-blue-200 w-full rounded-lg">
                                    <h2 className="text-red-900 pt-2 " style={{textShadow: '1px 1px 0 black',}}> Preguntas Frecuentes - {preguntaSelect.subtitle} </h2>
                                    {
                                        preguntaSelect.preguntas.map((preguntas,index)=>(
                                            <React.Fragment key={index}>
                                                <Button className="w-full rounded-lg py-4">
                                                    <Space className="">
                                                        <QuestionCircleOutlined/>
                                                        <h5 >{preguntas.title}</h5>
                                                    </Space>
                                                </Button>
                                            </React.Fragment>
                                       ))
                                    }
                                </div> 
                            )
                }
            </div>
        </>
    );
}
