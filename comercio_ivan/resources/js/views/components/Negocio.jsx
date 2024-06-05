import React from 'react'
import { EyeOutlined } from '@ant-design/icons'

function Negocio (props) {
  const { id, nombre, status, revisiones } = props.negocio
  return (
    <Card
      title={negocio}
      extra={<a href={id}><EyeOutlined /></a>}>
      <p></p>
    </Card>
  )
}

export default Negocio
