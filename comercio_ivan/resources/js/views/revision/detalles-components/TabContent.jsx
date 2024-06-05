import React from 'react';
import { Tabs, List, Checkbox } from 'antd' // Asegúrate de importar los componentes necesarios

function TabContent(props) {
    const { dataSource, onChange, tabTitle, tabKey, itemStatus } = props;

    console.log("TabContent Props: ", props)
    // debugger
    return (
        <>
        <Tabs.TabPane tab={tabTitle} key={tabKey}>
            <div className="documentos-container-overflow">
                <List
                    className="detalles-negocios-documents-list"
                    rowKey={(item) => item.nombre}
                    size="large"
                    bordered
                    dataSource={dataSource}
                    renderItem={(item) => (
                        <List.Item>
                            <Checkbox
                                disabled={item.status !== itemStatus}
                                value={item}
                                // onChange={onChange}
                            >
                                {item.descripcion}
                            </Checkbox>
                        </List.Item>
                    )}
                />
            </div>
        </Tabs.TabPane>
        </>
    )
}


export default TabContent;
