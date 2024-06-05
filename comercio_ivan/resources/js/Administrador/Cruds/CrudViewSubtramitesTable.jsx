import React, { useState, useEffect, useRef } from "react";
import { Button, Table, message, Space, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import ModalForm from "../../components/ModalForm";
import axios from "axios";
import {
    deleteConfirm,
    nuevoRegistro,
    actualizarRegistro,
} from "./HttpActions";

export default function CrudViewSubtramitesTable({
    pageTitle,
    modelo,
    columns,
    formFields,
    formFieldsPassword,
    isExpandedRow,
    tramites,
    loadItems
}) {
    const [tableData, setTableData] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalTitle, setModalTitle] = useState("Form");
    const [onCreate, setOnCreate] = useState(() => {});
    const [formItems, setFormItems] = useState([]);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 30 });
    const [tramitesAgrupados, setTramitesAgrupados] = useState([])

    const updatedColumns = [...columns];

    const searchInput = useRef(null);
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText("");
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
        }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={searchInput}
                    placeholder="NOMBRE DEL TRÁMITE"
                    value={selectedKeys[0]}
                    onChange={(e) =>
                        setSelectedKeys(e.target.value ? [e.target.value] : [])
                    }
                    onPressEnter={() =>
                        handleSearch(selectedKeys, confirm, dataIndex)
                    }
                    style={{
                        marginBottom: 8,
                        display: "block",
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() =>
                            handleSearch(selectedKeys, confirm, dataIndex)
                        }
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Buscar
                    </Button>
                    <Button
                        onClick={() => handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Reiniciar
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({
                                closeDropdown: false,
                            });
                            setSearchText(selectedKeys[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filtrar
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? "#1890ff" : undefined,
                }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                .toString()
                .toLowerCase()
                .includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) => text,
    });

    const nombreColumnIndex = updatedColumns.findIndex(
        (column) => column.dataIndex === 'nombre'
    );

    updatedColumns[nombreColumnIndex] = {
        ...updatedColumns[nombreColumnIndex],
        ...getColumnSearchProps('nombre'),
    };

    const _columns = [
        ...updatedColumns,
    ];

    const fillForm = (item) => {
        const itemKeys = Object.keys(item);
        console.log("itemKeys", itemKeys)
        formFields.map((formItem) => {
            if (itemKeys.includes(formItem.name))
                formItem.value = item[formItem.name];
        });
        console.log("formFields", formFields)
        setFormItems(formFields);
        showModal("Actualzación", false);
    };

    const fillFormPassword = (item) => {
        const itemKeys = Object.keys(item);
        formFieldsPassword.map((formItem) => {
            if (itemKeys.includes(formItem.name))
                formItem.value = item[formItem.name];
        });
        setFormItems(formFieldsPassword);
        showModal("Actualzación", false);
    };
    const cleanForm = () => {
        if (formFieldsPassword) {
            var enabledFormFields = [...formFieldsPassword]?.map(
                (formField) => ({
                    ...formField,
                    disabled: false,
                })
            );
        }
        const itemsToSet = enabledFormFields ? enabledFormFields : formFields;
        itemsToSet.map((item) => {
            switch (item.type) {
                case "date":
                    item.value = null;
                case "year":
                    item.value = null;
                case "month":
                    item.value = null;
                case "multiselect":
                    item.value = [];
                case "checkbox":
                    return (item.value = false);
                default:
                    item.value = "";
            }
        });
        setFormItems(itemsToSet);
    };

    useEffect(() => {
        setFormItems(formFields);
        return () => {};
    }, []);

    const showModal = (title, op_type) => {
        setIsModalVisible(true);
        setModalTitle(title);
        if (op_type) {
            setOnCreate(() => nuevo);
            return;
        }
        setOnCreate(() => actualizar);
    };
    const nuevo = (formData) =>
        nuevoRegistro(
            formData,
            modelo,
            successCallbackFunction,
            errorCallbackFuntion
        );
    const actualizar = (formData) =>
        actualizarRegistro(
            formData,
            modelo,
            successCallbackFunction,
            errorCallbackFuntion
        );

    const successCallbackFunction = (response) => {
        setIsModalVisible(false);
        loadItems();
    };

    const errorCallbackFuntion = (error) => {
        setIsModalVisible(false);
        if (error.response) {
            // Request made and server responded
            //console.log(error.response.data);
            //console.log(error.response.status);
            if (error.response.status === 413) {
                notification["error"]({
                    message: "Error al enviar el archivo",
                    description: "El documento que envio es demasiado pesado",
                });
                message.error("Ha habido un error al enviar la información.");
            } else {
                message.error("Ha habido un error al enviar la información.");
            }
            //console.log(error.response.headers);
        } else if (error.request) {
            // The request was made but no response was received
            console.log(error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.log("Error", error.message);
        }
    };

    return (
        <>
            <div className="top-bar">
                <h1>{pageTitle ? pageTitle : "Titulo Default"}</h1>
                <span className="button-container">
                    <Button
                        type="primary"
                        onClick={() => {
                            cleanForm();
                            showModal("Nuevo", true);
                        }}
                    >
                        Nuevo
                    </Button>
                </span>
            </div>

            <Table
                bordered
                columns={_columns}
                dataSource={tramites}
                rowKey={(record) => record?.catalogo_tramite_padre_id} 
                // onChange={(pagination) => {
                //     setPagination(pagination);
                // }}
                
                // pagination={pagination}
                pagination={{
                    defaultPageSize: 50,
                    showSizeChanger: true,
                    pageSizeOptions: [
                        "10",
                        "50",
                        "100",
                        "500",
                        "1000",
                    ],
                }}
                expandable={{
                    expandedRowRender: (record) => {
                        if (isExpandedRow){
                            const tramitePadre = tramites.filter(
                                (tramite) => tramite.catalogo_tramite_padre_id === record.catalogo_tramite_padre_id
                            );
                            console.log('tramitePadre', tramitePadre)

                            let columns = [
                                {
                                    title: "Nombre",
                                    dataIndex: "nombre",
                                    key: "nombre",
                                    render: (text, record) => {
                                        return record?.tramite_hijo[0]?.nombre;
                                    },
                                },
                                {
                                    title: "Orden",
                                    dataIndex: "orden",
                                    key: "orden",
                                },
                                {
                                    title: "Acciones",
                                    key: "action",
                                    render: (text, record) => (
                                        <Space size="middle">
                                            <Button type="primary" onClick={() => fillForm(record)}>
                                                Editar
                                            </Button>
                                            {formFieldsPassword && (
                                                <Button
                                                    type="primary"
                                                    onClick={() => {
                                                        fillFormPassword(record);
                                                    }}
                                                >
                                                    Editar Contraseña
                                                </Button>
                                            )}
                                            <Button
                                                onClick={() => deleteConfirm(record, modelo, loadItems)}
                                            >
                                                Eliminar
                                            </Button>
                                        </Space>
                                    ),
                                },
                            ]
                            return (
                                // <div>
                                //     {tramitePadre[0]?.catalogo_tramite_hijos?.map((objeto) => {
                                //     console.log("objeto", objeto)
                                //         return (
                                //             <div style={{padding: 10}}>
                                //                 <span key={objeto.id}>{objeto.tramite_hijo[0]?.nombre}</span>
                                //             </div>
                                //         )
                                        
                                //     })}
                                // </div>
                                <Table columns={columns} dataSource={tramitePadre[0]?.catalogo_tramite_hijos} pagination={false} />
                            );
                        }
                        else {
                            return null;
                        }
                    },
                    rowExpandable: (record) => record.name !== 'Not Expandable',
                    // rowExpandable: () => {
                    //     if (isExpandedRow){
                    //         return true;
                    //     }
                    //     return false;
                    // },
                    // showExpandColumn: () => {
                    //     if (isExpandedRow){
                    //         return true;
                    //     }
                    //     return false;
                    // },
                }}    
            />

            {isModalVisible && (
                <ModalForm
                    visible={isModalVisible}
                    onCreate={onCreate}
                    onCancel={() => setIsModalVisible(false)}
                    formData={formItems}
                    title={modalTitle}
                />
            )}
        </>
    );
}
