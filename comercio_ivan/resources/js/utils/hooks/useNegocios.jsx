import axios from "axios";
import { useEffect, useState } from "react";

export default function useNegocios () {
  const [negocios, setNegocios] = useState([])
  useEffect(() => {
    axios.get('/app/negocios')
      .then(result => {
        setNegocios(result.data)
      })
  }, [])
  return negocios
}
