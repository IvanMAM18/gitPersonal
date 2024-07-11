import React, { useState, useEffect, useRef } from "react";
import { Button, Table, message, Space, Input, Radio } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import ModalForm from "@/components/ModalForm";
import axios from "axios";
import {
    deleteConfirm,
    nuevoRegistro,
    actualizarRegistro,
} from "./HttpActions";
//import { options } from "less";

export default function CrudView({
    pageTitle,
    modelo,
    columns,
    formFields,
    formFieldsPassword,
    //isExpandedRow,
    tramites
}) {
    const [tableData, setTableData] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalTitle, setModalTitle] = useState("Form");
    const [onCreate, setOnCreate] = useState(() => {});
    const [formItems, setFormItems] = useState([]);
    //const [pagination, setPagination] = useState({ current: 1, pageSize: 30 });
    const [tramitesAgrupados, setTramitesAgrupados] = useState([])

    const updatedColumns = [...columns];

    const searchInput = useRef(null);
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    //  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    //      confirm();
    //      setSearchText(selectedKeys[0]);
    //      setSearchedColumn(dataIndex);
    //  };
    //  const handleReset = (clearFilters) => {
    //      clearFilters();
    //      setSearchText("");
    //  };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
        }) => (
            <div className="p-2">
                {inputOrRadioFilters(selectedKeys,setSelectedKeys,confirm,dataIndex,columns,searchInput)}
                <Space>
                    <Button
                        onClick={() => {
                            confirm({
                                closeDropdown: false,
                            });
                            setSearchText(clearFilters);
                            setSearchedColumn(dataIndex);
                        }}
                        size="small"
                    >
                        Reiniciar
                    </Button>
                    <Button
                        type="primary"
                        size="small"
                        onClick={() => {
                            confirm({
                                closeDropdown: false,
                            });
                            setSearchText(selectedKeys[0]);
                            setSearchedColumn(dataIndex);
                         }}
                     >
                        Filtro
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
    });

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
        //console.log(formFields);
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

    useEffect(() => {
        if (tableData?.length > 0 && tramites?.length > 0) {
            setTramitesAgrupados(agruparTramites(tableData, tramites))
        }

    }, [tableData]);

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

    function agruparTramites(catalogo, tramites) {
        const tramitesAgrupados = {};
        for (const elemento of catalogo) {
            const padre = tramitesAgrupados[elemento.catalogo_tramite_padre_id] || {};
            const hijo = tramites.find(t => t.id === elemento.catalogo_tramite_hijo_id);
            if (!padre || !hijo) continue;
            padre[hijo.nombre] = hijo;
            tramitesAgrupados[elemento.catalogo_tramite_padre_id] = padre;
        }
        debugger
        console.log("tramites agrupados: ", tramitesAgrupados)
        return tramitesAgrupados;
    }

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
                        className="mb-2"
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
                    defaultPageSize: 10,
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

function inputOrRadioFilters(selectedKeys,setSelectedKeys,confirm,dataIndex,columns,searchInput){
    if(dataIndex === 'nombre' || dataIndex === 'clave_scian'){
        return (
            <Input
                ref={searchInput}
                placeholder= {"Buscar "+ (dataIndex.replace(/_/g, " ")) + " (tramite)"}
                value={selectedKeys[0]}
                onChange={(e) =>
                    setSelectedKeys(e.target.value ? [e.target.value] : [])
                }
                onPressEnter={() =>
                    handleSearch(selectedKeys, confirm, dataIndex)
                }
                className={"mb-1 d-block"}
            />);
    }else{
        //Se mandan llamar los filters que se encuentran en clumnsArray 
        const arrayFiltersRadios = [];
        for(let i=0; i<columns.length; i++){
            if(columns[i].dataIndex === dataIndex){
                  for(let j=0; j<columns[i].tamanio; j++){
                      arrayFiltersRadios.push(
                        <Radio className={"mb-1 d-block"} value={columns[i].filters[j].value}>{columns[i].filters[j].text}</Radio>
                    );
                  }
            }
        }
        return (
                <Space className={"mb-1 d-block"}>
                    <Radio.Group
                        onChange={(e) =>
                            setSelectedKeys(e.target.value ? [e.target.value] : [])} 
                        value={selectedKeys[0]}>
                        {arrayFiltersRadios}
                    </Radio.Group>
                </Space>
        );
    }
}
