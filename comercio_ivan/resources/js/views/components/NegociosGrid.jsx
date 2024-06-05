
import React, { useState } from 'react'
import { Tag, Space, Card } from 'antd'
import useNegocios from '../../utils/hooks/useNegocios'

function NegociosGrid () {
  const negocios = useNegocios()
  return (
    <div>
      {
        negocios.map(negocio => {
          return (
            <Card title={ negocio.nombre_del_negocio } style={{display:'inline-block','margin-right':5,'margin-bottom':5}}>
              <Tag color="green" key={1}>
                { negocio.status }
              </Tag>
              <Space size="middle">
                <a href={`/app/mis-negocios/${negocio.id}`}>DETALLES →</a>
              </Space>
            </Card>
          )
        })
      }
    </div>
  )
}

export default NegociosGrid
