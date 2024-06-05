import { Spin, Alert } from 'antd'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

function ExpedienteCompletadoWidget (props) {
  const [completed, setCompleted] = useState(true)
  const [fetched, setFetched] = useState(true)

  useEffect(() => {
    axios.get('/app/expediente-completado/' + window.user.id)
      .then(data => {
        props.onEstaCompletado && props.onEstaCompletado(data.data.completed === 3)
        if (data.data.completed === 3) {
          setFetched(true)
        } else {
          setFetched(true)
          setCompleted(false)
        }
      })
      .catch(() => {})
  }, [])
  return (
    <div>
      {
        !fetched &&
        <p>Validando datos <Spin/></p>
      }
      {
        !completed &&
        <a href="/app/expediente">
          <Alert
            showIcon closable message="Expediente incompleto"
            description="Debe completar el expediente, haga click aqui."
            type="warning"/>
        </a>
      }
    </div>
  )
}

export default ExpedienteCompletadoWidget
