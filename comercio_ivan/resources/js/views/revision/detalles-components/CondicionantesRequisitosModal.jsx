import React, { useState, useEffect } from "react";
import { Modal, Tabs, List, Checkbox }
  from 'antd'
import axios from "axios";
import TabContent from "./TabContent";


function CondicionantesRequisitosModal(props) {

  const {permissions, condicionantes, documentos, requisitos, modalOpened, setModalOpened, revisionAprobadoRechazado, onChangeCheckbox, onChangeCondicionantes, getDocumentos} = props;
  const [modalOpen, setModalOpen] = useState(false);

  console.log("permisions: ", permissions)

  
  
  const showModal1 = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpened(false);
  }

  const submitModal = () => {
    setModalOpened(false);
  }

  return (
    <>
    <Modal
        title="Documentos"
        style={{
          top: 20,
        }}
        visible={modalOpened}
        onOk={submitModal}
        onCancel={closeModal}
      >
        {/* <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab="Seleccionar Documentos" key="1">
          <ul>
              {renderCondicionantes()}
          </ul>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Seleccionar Condicionantes" key="2">

          </Tabs.TabPane>
        </Tabs> */}
        {(permissions.aprobarPermission || permissions.condicionantesPermission) && (
          <div className="">
            <h5>Seleccionar Documentos</h5>
            <div className="detalles-negocios-documents-list">
              <Tabs defaultActiveKey="1">
                {/* <Tabs.TabPane tab={tabTitle} key={tabKey}> */}
                {permissions.aprobarPermission == true && (
                    <Tabs.TabPane tab="Seleccionar Documentos" key="1">
                      <div className="documentos-container-overflow">
                          <List
                              className="detalles-negocios-documents-list"
                              rowKey={(item) => item.nombre}
                              size="large"
                              bordered
                              dataSource={documentos}
                              renderItem={(item) => (
                                  <List.Item>
                                      <Checkbox
                                          disabled={item.status !== -1}
                                          value={item}
                                          onChange={onChangeCheckbox}
                                      >
                                          {item.descripcion}
                                      </Checkbox>
                                  </List.Item>
                              )}
                          />
                      </div>
                  </Tabs.TabPane>
                )}
                {/* {permissions.aprobarPermission == true && ( */}
                  {/* <TabContent 
                    dataSource={documentos} 
                    // onChange={onChangeCheckbox} 
                    tabTitle="Seleccionar Documentos" 
                    tabKey={1} 
                    itemStatus={-1} /> */}

                {/* )} */}
                {permissions.condicionantesPermission === true && (
                  <Tabs.TabPane tab="Seleccionar Condicionantes" key="2">
                      <div className="documentos-container-overflow">
                          <List
                              className="detalles-negocios-documents-list"
                              rowKey={(item) => item.nombre}
                              size="large"
                              bordered
                              dataSource={condicionantes}
                              renderItem={(item) => (
                                  <List.Item>
                                      <Checkbox
                                          disabled={item.status !== -1}
                                          value={item}
                                          onChange={onChangeCondicionantes}
                                      >
                                          {item.descripcion}
                                      </Checkbox>
                                  </List.Item>
                              )}
                          />
                      </div>
                  </Tabs.TabPane>
                  )}
              </Tabs>
            </div>
          </div>
        )}
    </Modal>
    </>
  )
}

export default CondicionantesRequisitosModal;