import React, { useState, } from 'react';
import { FormOutlined } from '@ant-design/icons';
import { Link } from "react-router-dom";
import { Modal } from 'antd';
import './RefrendoIndividualStyle.scss';

import RefrendoActulizarDatosNegocio from './RefrendoActulizarDatosNegocio';

export default function RefrendoIndividualLink({ negocio, giros }) {
    const [isModalOpen, setIsModelOpen] = useState(false);
    const [_negocio, setNegocio] = useState(negocio);
    const [hideIcon, setHideIcon] = useState(false);
    return (
        <>
            {hideIcon === false && <Link onClick={() => setIsModelOpen(true)} title='Refrendar negocio con modificación'>
                <FormOutlined style={{ fontSize: 16 }} />
            </Link>}
            <Modal
                open={isModalOpen}
                title={`Refrendo ${negocio?.nombre_del_negocio ?? ""} ${new Date().getFullYear()}`}
                onCancel={() => setIsModelOpen(false)}
                width={"70%"}
                footer={<></>}
            >
                <RefrendoActulizarDatosNegocio negocio={_negocio} setIsModelOpen={setIsModelOpen} giros={giros} setHideIcon={setHideIcon} />
            </Modal>
        </>
    )
}
