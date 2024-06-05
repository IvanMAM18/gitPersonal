import { message } from 'antd'

export default function triggerErrorMessageForFields (fields) {
  console.log('fields', fields)
  for (const fieldId in fields) {
    const field = fields[fieldId]
    if (!field) {
      message.error(`${fieldId.replace(/ma_/g, '').replace(/_id/g, '').replace(/_/g, ' ')} es requerido`)
      return true
    }
  }
  return false
}