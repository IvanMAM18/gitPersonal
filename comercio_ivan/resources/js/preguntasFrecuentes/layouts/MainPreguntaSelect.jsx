import React, { useEffect, useState } from "react";
import { Button,Space, Menu, Divider, Row, Col,Layout } from "antd";
import {QuestionCircleOutlined} from "@ant-design/icons";


export default function MainPreguntaSelect({ preguntaSelect, indexSelect }) {
    const [selectedTitle, setSelectedTitle] = useState('');

    const handleButtonClick = (title) => {
        setSelectedTitle(title);
    };
    
    return (
        <>
            <div className="">
                
                {
                    indexSelect === '' 
                        ?
                            ( 
                            <div className="px-4 w-full h-screen">
                                <span>hola  {indexSelect} </span>
                            </div>
                            )
                        :
                            ( 
                                <div className="w-full h-full">
                                    <span>hola  {indexSelect} </span>
                                </div> 
                            )
                }
            </div>
        </>
    );
}
