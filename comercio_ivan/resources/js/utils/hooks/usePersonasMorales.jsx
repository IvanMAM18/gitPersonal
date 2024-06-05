
import axios from "axios";
import { useEffect, useState } from "react";

export default function usePersonasMorales () {
  const [personasMorales, setPersonasMorales] = useState([])

  function refresh () {
    axios.get('/app/personas-morales')
      .then(result => {
        setPersonasMorales(result.data)
      })
  }

  useEffect(() => {
    refresh()
  }, [])
  return [personasMorales, refresh]
}
