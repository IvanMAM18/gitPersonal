import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PushpinOutlined } from "@ant-design/icons";
import {
    Divider,
    Button,
    Card,
    List,
    Checkbox,
    Input,
    Row,
    Col,
    notification,
    Modal,
    Tabs,
    Space,
    Tag,
} from "antd";

function DocumentosCondicionantesTabs({
    documentos, 
    condicionantes, 
    mostrarDocumentos, 
    mostrarCondicionantes, 
    onDocumentoSeleccionado
}) {
    const onDocumentoSeleccionadoHandler = (e) => {
        if(typeof onDocumentoSeleccionado !== 'function') {
            return;
        }

        onDocumentoSeleccionado({
            id: e.target.id,
            checked: e.target.checked
        });
    };

    return (
        <Tabs defaultActiveKey="1">
            {mostrarDocumentos && (
                <Tabs.TabPane
                    tab="Seleccionar Documentos"
                    key="1"
                    forceRender={true}
                >
                    <div className="documentos-container-overflow">
                        <List
                            rowKey={(item) =>item.id}
                            size="large"
                            bordered
                            dataSource={documentos}
                            renderItem={(item) => (
                                <List.Item>
                                    <Checkbox
                                        disabled={item.status !== -1}
                                        value={item}
                                        onChange={onDocumentoSeleccionadoHandler}
                                    >{item.descripcion}
                                    </Checkbox>
                                </List.Item>
                            )}
                        />
                    </div>
                </Tabs.TabPane>
            )}
            {mostrarCondicionantes && (
                <Tabs.TabPane
                    tab="Seleccionar Condicionantes"
                    key="2"
                    forceRender={true}
                >
                    <div className="documentos-container-overflow">
                        <List
                            className="detalles-negocios-documents-list"
                            rowKey={(item) => item.id}
                            size="large"
                            bordered
                            dataSource={condicionantes}
                            renderItem={(item) => (
                                <List.Item>
                                    <Checkbox.Group>
                                        <Checkbox
                                            disabled={
                                                item.status !==
                                                -1
                                            }
                                            value={
                                                item
                                            }
                                            onChange={
                                                onChangeCondicionantes
                                            }
                                        >
                                            {
                                                item.descripcion
                                            }
                                        </Checkbox>
                                    </Checkbox.Group>
                                </List.Item>
                            )}
                        />
                    </div>
                </Tabs.TabPane>
            )}
        </Tabs>
    );
}

export default DocumentosCondicionantesTabs;