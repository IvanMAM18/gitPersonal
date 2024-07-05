import React, { useState, useEffect, useRef } from "react";
import { Button, Table, message, Space, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import ModalForm from "../../components/ModalForm";
import axios from "axios";
import StyleTrueFalse from '../../Administrador/CrudsNegocio/components/StyleTrueFalse';
import TipoSectorStyle from '../../Administrador/CrudsNegocio/components/TipoSectorStyle';
import { Tag } from "antd";
import {
    deleteConfirm,
    nuevoRegistro,
    actualizarRegistro,
} from "./HttpActions";

export default function CrudView({
    pageTitle,
    modelo,
    columns,
    formFields,
    formFieldsPassword,
    isExpandedRow,
    tramites
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
        if(selectedKeys[0].toLowerCase() === 'si'){
            selectedKeys[0] = 'true';
        }else if(selectedKeys[0].toLowerCase() === 'no'){
            selectedKeys[0] = 'false';
        }
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
                    placeholder= {placeholderTitlte(columns,dataIndex)}
                    value={trueOrFalse(selectedKeys[0])}
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
        render: (text, record) => {
            return stylesDataTable(dataIndex, record, text);
        },
    });

    // const nombreColumnIndex = updatedColumns.findIndex(
    //     (column) => column.dataIndex === 'nombre'
    // );

    // updatedColumns[nombreColumnIndex] = {
    //     ...updatedColumns[nombreColumnIndex],
    //     ...getColumnSearchProps('nombre'),
    // };

    const columnIndex = [];
    columns.map((objeto, index)=>{
        columnIndex[index] = ['columnIndex'+index];
            columnIndex[index] = updatedColumns.findIndex(
                (column) => column.dataIndex === (''+objeto.dataIndex)
            );
    
            updatedColumns[columnIndex[index]] = {
                ...updatedColumns[columnIndex[index]],
                ...getColumnSearchProps(''+objeto.dataIndex),
            };
    });

    const _columns = [
        ...updatedColumns,

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
    ];

    const fillForm = (item) => {
        const itemKeys = Object.keys(item);
        console.log(formFields);
        formFields.map((formItem) => {
            if (itemKeys.includes(formItem.name))
                formItem.value = item[formItem.name];
        });
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
        loadItems();
        return () => {};
    }, []);

    // useEffect(() => {
    //     if (tableData?.length > 0 && tramites?.length > 0) {
    //         setTramitesAgrupados(agruparTramites(tableData, tramites))
    //     }

    // }, [tableData]);

    const loadItems = () => {
        axios
            .get(`/app/dashadmin_get_todos_los_${modelo}`)
            .then((response) => {
                const formData = response.data;
                formData.map((item) => {
                    item.key = item.id;
                });
                // console.log("get todos los: ", formData)
                setTableData(formData);
            })
            .catch((err) => console.error(err));
    };

    // function agruparTramites(catalogo, tramites) {
    //     const tramitesAgrupados = {};
    //     for (const elemento of catalogo) {
    //         const padre = tramitesAgrupados[elemento.catalogo_tramite_padre_id] || {};
    //         const hijo = tramites.find(t => t.id === elemento.catalogo_tramite_hijo_id);
    //         if (!padre || !hijo) continue;
    //         padre[hijo.nombre] = hijo;
    //         tramitesAgrupados[elemento.catalogo_tramite_padre_id] = padre;
    //     }
    //     debugger
    //     console.log("tramites agrupados: ", tramitesAgrupados)
    //     return tramitesAgrupados;
    // }

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
                dataSource={tableData}
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

function stylesDataTable(nameColumn, dataColumn,textData){
    if(nameColumn === 'tipo'){
        return <Tag >{dataColumn[nameColumn].replace(/\_/g, " ").toUpperCase()}</Tag>;
    }
    if(nameColumn === 'tipo_sector'){
        return <TipoSectorStyle sector={ dataColumn[nameColumn] }/>;
    }
    if(nameColumn === 'cobro_programa_interno' || nameColumn === 'certificado_medio_ambiente' || nameColumn === 'licencia_alcohol_giro_comercial'){
        return <StyleTrueFalse condicion={ dataColumn[nameColumn] } />;
    }else{
        return textData;
    }
}

function placeholderTitlte(columns, columnSelect){
    const titlePlaceholder = [];
    columns.map((objeto, index)=>{
        if(objeto.dataIndex === columnSelect){
            titlePlaceholder [index]= (objeto.title);
        }
    })
    return (titlePlaceholder+" (trámite)").replace(/,/g, "");
}

function trueOrFalse(text){

    if(text === 'true'){
        text = 'SI';
    }else if(text === 'false'){
        text='NO';
    }
    return text;
}
