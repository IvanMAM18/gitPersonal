
import {
  SnippetsOutlined,
  AuditOutlined,
  IdcardOutlined,
  CopyOutlined,
} from '@ant-design/icons';

const fileUploadHandlers = [
  {
    ic: <IdcardOutlined />,
    multiple: false,
    dsiplayname: 'Identificacion Frontal',
    name: 'identificacion-frontal',
    action: '/app/file-expediente/identificacion-frontal',
    required: true,
  },
  {
    ic: <IdcardOutlined />,
    multiple: false,
    dsiplayname: 'Identificacion Trasera',
    name: 'identificacion-trasera',
    action: '/app/file-expediente/identificacion-trasera',
    required: true,
  },
  {
    ic: <CopyOutlined />,
    multiple: false,
    dsiplayname: 'Comprobante de Domicilio SAPA (Propetario)',
    name: 'comprobante-de-domicilio',
    action: '/app/file-expediente/comprobante-de-domicilio',
    required: true,
  },
  {
    ic: <CopyOutlined />,
    multiple: false,
    dsiplayname: 'Constancia de Situación Fiscal',
    name: 'constancia-de-situacion-fiscal',
    action: '/app/file-expediente/constancia-de-situacion-fiscal',
  },
  {
    ic: <CopyOutlined />,
    multiple: false,
    dsiplayname: 'Pasaporte',
    name: 'pasaporte',
    action: '/app/file-expediente/pasaporte',
  },
]

export default fileUploadHandlers