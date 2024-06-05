import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal, Select, Spin, message } from "antd";
import axios from "axios";

const selectTagsFormatterParaGiros = (giro) => {
  return {
    label: giro.nombre,
    value: giro.nombre,
  }
}

export default function EditorGirosModal (props) {
  const [loading, setLoading] = useState(true)
  const [giros, setGiros] = useState([])
  const [girosAgregados, setGirosAgregados] = useState([])
  const [defaultValues, setDefaultValues] = useState(null)

  const limpiarGiros = useCallback((girosSeleccionados) => {
    const girosValidos = giros.map(g=>g.value)
    girosSeleccionados = girosSeleccionados.filter(g => {
      return girosValidos.includes(g)
    })
    return girosSeleccionados
  }, [defaultValues, giros])

  useEffect(() => {
    axios.get('/app/get_giros_comerciales_registro')
      .then(({data}) => {
        setGiros(data.map(selectTagsFormatterParaGiros))
        axios.get('/app/giros-de-negocio/'+props.negocioId)
          .then(({ data: { giros_negocio }}) => {
            setGirosAgregados(giros_negocio.map(selectTagsFormatterParaGiros))
            setDefaultValues(giros_negocio.map(gn => gn.nombre))
            setLoading(false)
          })
      })
  }, [])

  const guardar = () => {
    setLoading(true)
    const girosFinales = limpiarGiros(girosAgregados)
    if (!girosFinales.length) {
      setLoading(false)
      return message.warn('La lista de giros está vacía')
    }
    axios.put('/app/negocio-giros/'+props.negocioId, girosFinales)
      .then(response => {
        if (response.data.ok) {
          message.success('Se actualizaron los giros...')
          setTimeout(() => {
            location.reload()
          }, 500)
        }
      })
      .catch((err) => setLoading(false))
  }

  return (
    <Modal
      onCancel={props.onCancel}
      footer={
        <><Button type="primary" disabled={loading} onClick={guardar}>Guardar nuevos giros</Button></>
      }
      visible={props.visible}>
      <br/>
      <p>Agrega y quita los giros comerciales</p>
      <br/>
      {
        !loading ? (
          <Select
            autoFocus
            mode="tags"
            size="large"
            placeholder="Please select"
            defaultValue={defaultValues}
            onChange={value => setGirosAgregados(value)}
            style={{
              width: '100%',
            }}
            options={giros}
          />
        ) : (
          <Spin/>
        )
      }

    </Modal>
  )
}