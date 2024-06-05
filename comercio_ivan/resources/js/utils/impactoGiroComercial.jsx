import React from 'react'
import { Tag } from 'antd'
import {
  CheckCircleOutlined,
  RightOutlined,
} from '@ant-design/icons'

const impactos = {
  ALTO_IMPACTO: 'ALTO_IMPACTO',
  BAJO_IMPACTO: 'BAJO_IMPACTO',
  color (_impactos) {
    switch (_impactos) {
      case 'ALTO_IMPACTO': return 'blue'
      case 'BAJO_IMPACTO': return 'green'
    }
  },
  iconoConColor (_impactos) {
    switch (_impactos) {
      case 'ALTO_IMPACTO': return <RightOutlined style={{color:'blue'}} className='timeline-clock-icon' />
      case 'BAJO_IMPACTO': return <CheckCircleOutlined style={{color:'green'}} className='timeline-clock-icon'/>
      default: return <RightOutlined style={{color:'blue'}} className='timeline-clock-icon' />;
    }
  },
  icono (_impactos) {
    switch (_impactos) {
      case 'ALTO_IMPACTO': return <RightOutlined />
      case 'BAJO_IMPACTO': return <CheckCircleOutlined />
      default: return <RightOutlined/>
    }
  },
  tag (_impactos) {
    switch (_impactos) {
      case 'mediano_alto_impacto': return <Tag color="purple"><span style={{ fontSize: 15 }}> ALTO IMPACTO</span></Tag>
      case 'bajo_impacto': return <Tag color="gold"><span style={{ fontSize: 15 }}> BAJO IMPACTO</span></Tag>
    }
  },
}

export default impactos
