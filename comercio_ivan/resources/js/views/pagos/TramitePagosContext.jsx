import React from 'react';
 
const cobrosContext = React.createContext({
    crearPagoFormModalVisible: false,
    setCrearPagoFormModalVisible: () => {},
    tramite: null,
    setTramite: () => {},
    negocio: null,
    setNegocio: () => {},
    avisoEntero: null,
    setAvisoEntero: () => {},
    persona: null,
    setPersona: () => {},
    year: null,
});
 
export default cobrosContext;