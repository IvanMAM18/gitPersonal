
import axios from "axios";
import { useEffect, useState } from "react";

export default function useRequisitos () {
  const [requisitos, setRequisitos] = useState([])

  function pushRequisito (nuevoRequisito) {
    setRequisitos([...requisitos, nuevoRequisito])
  }

  useEffect(() => {
    axios.get('/app/requisitos')
      .then(result => {
        setRequisitos(result.data)
      })
  }, [])
  return [requisitos, pushRequisito]
}
