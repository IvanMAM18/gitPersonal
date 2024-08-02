import React, { useEffect, useState } from "react";
import { Layout,Space } from "antd";
import { preguntasFrecuentes } from "../utils/preguntas";
import SideMenu from "../layouts/SideMenu.jsx";
import Main from "../layouts/Main.jsx";
import PreguntaSelected from "../layouts/PreguntaSelected.jsx";
import useWindowWidth from "../../utils/hooks/useWindowWith.jsx";



export default function PreguntasFrecuentes() {

  const [selectedOption, setSelectedOption] = useState('');
  const [idSelectPregunta, setIdSelectPregunta] = useState('');

  const handleSelect = (item) => {
    setSelectedOption(item);
    if(item.length >= 0){
    }else{
      setIdSelectPregunta('');
    }
  };

  const handleIddPreguntaSelect = (item) => {
    setIdSelectPregunta(item);
  };

  console.log(selectedOption);
  return (
    <div className="w-full h-full">
        <SideMenu preguntasSelect={handleSelect}/>
        {
          selectedOption.length >=1 ?
            <Main preguntasSelect={selectedOption} idPreguntaSelectMain={handleSelect}/>
          :
          selectedOption === '' ?
            <Main preguntasSelect={preguntasFrecuentes} idPreguntaSelectMain={handleSelect}/>
          : 
            <PreguntaSelected preguntaSelect={preguntasFrecuentes[selectedOption]} indexSelect={selectedOption}/>
        }
        {/* {
          selectedOption === '' ? 
            <Main preguntasSelect={preguntasFrecuentes} idPreguntaSelectMain={handleSelect}/>
          : selectedOption >= 1 ?
            <span>1 {selectedOption}</span>
          :
          <span> 2 {selectedOption}</span>
        } */}
        {/* <div className="w-full">
        {
          selectedOption.length >= 1 ? 
          (
            <Main preguntasSelect={selectedOption} idPreguntaSelectMain={handleSelect}/>
          ) : selectedOption === '' ? (
            <Main preguntasSelect={preguntasFrecuentes} idPreguntaSelectMain={handleSelect}/>
          ) : (
            idSelectPregunta === '' ? (
              <PreguntasSelect preguntaSelect={selectedOption} idPreguntaSelect={handleIddPreguntaSelect}/>
            ) : (
              <PreguntaSelected preguntaSelect={selectedOption} indexSelect={idSelectPregunta}/>
            )
          )
        }
        </div> */}
    </div>
  );
}
