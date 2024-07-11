import React, { useState, useEffect, useRef } from "react";
import { Button, Table, Space, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import ModalForm from "@/components/ModalForm";
import axios from "axios";
import StyleTrueFalse from '@/Administrador/CrudsNegocio/components/StyleTrueFalse';
import TipoSectorStyle from '@/Administrador/CrudsNegocio/components/TipoSectorStyle';
import { Tag } from "antd";


export default function CrudGirosPublic({
    pageTitle,
    modelo,
    columns,
    formFields,
}) {
    const [tableData, setTableData] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [formItems, setFormItems] = useState([]);

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
                    placeholder={
                        placeholderTitlte(columns,dataIndex)
                    }
                    value={
                        trueOrFalse(selectedKeys[0])
                    }
                    onChange={
                        (e) =>setSelectedKeys(e.target.value ? [e.target.value] : [])
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
    ];

    useEffect(() => {
        setFormItems(formFields);
        loadItems();
        return () => {};
    }, []);


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

    return (
        <>
            <div className="top-bar text-center">
                <h1>{pageTitle ? pageTitle : "Titulo Default"}</h1>
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
    if(nameColumn === 'cobro_programa_interno' || nameColumn === 'certificado_medio_ambiente' || nameColumn === 'licencia_alcohol'){
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