import React from 'react';
import ReactDOM from 'react-dom';
import { PDFViewer } from '@react-pdf/renderer';

const Solicitud_PDF = () => (
  <PDFViewer>
    <Solicitud />
  </PDFViewer>
);


export default Solicitud_PDF;


if (document.getElementById('solicitud_PDF')) {
    ReactDOM.render(<Solicitud_PDF />, document.getElementById('solicitud_PDF'));
}


