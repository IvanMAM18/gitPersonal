import axios from "axios";
import { useEffect, useState } from "react";

export default function useNegocioDetalles () {
  const [negocio, setNegocioDetalles] = useState({})

  const updateNegocio = (negocioId) => {
    axios.get('/app/negocio/' + negocioId)
      .then(result => {
        console.log("NEGOCIO DETALLES: ", result.data)
        setNegocioDetalles(result.data)
      })
  }

  return [negocio, updateNegocio]
}
