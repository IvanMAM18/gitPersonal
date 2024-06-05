import React from 'react';
import { Modal } from 'antd';
import ListaNegociosRefrendo from '../MisNegocios/ListaNegociosRefrendo';
import LoadingIndicator from '../../../components/LoadingIndicator';


export default function RefrendarNegocios({ negocios, modalProps, setModalPros, refreshNegocios, resetModal }) {
    return (
        <Modal {...modalProps}>
            {
                negocios?.length > 0 && negocios !== null
                    ? <ListaNegociosRefrendo
                        negocios={negocios.filter(negocio => negocio?.pagoClaveCatastral === true)}
                        negociosNoValidos={negocios.filter(negocio => negocio?.pagoClaveCatastral === false)}
                        setModalPros={setModalPros}
                        modalProps={modalProps}
                        resetModal={resetModal}
                    /> : <LoadingIndicator />
            }
        </Modal>
    )
}
