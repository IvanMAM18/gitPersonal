import React, { useRef, useState } from "react";
import { Popconfirm, Table, message, Button, Input, Space } from "antd";
import moment from "moment";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";

const d = (date) => moment(date).format("DD/MM/YYYY HH:mm a");
 export default function TablaDeRevisiones({
    data,filterNombrePro,filterNombreOp,filterLicencia
}) {
    if (!data) {
        return null;
    }

    const desligar = (data) => {
            axios
            .post("/app/desligar-licencia-negocio", {
            ...data
            })
            .then((result) => {
                message.success("Actualizado Correctamente");
                //reload();
                //reable();
                location.href = '/app/ligar-licencias';
            })
            .catch((error) => {
                console.log("catch((error", error.response.data);
                message.error("Error al guardar"+error.response.data.message);
               
            });
        };
    
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const searchInput = useRef(null);

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
          clearFilters
        }) => (
          <div
            style={{
              padding: 8
            }}
          >
            <Input
              ref={searchInput}
              placeholder={`Search ${dataIndex}`}
              value={selectedKeys[0]}
              onChange={(e) =>
                setSelectedKeys(e.target.value ? [e.target.value] : [])
              }
              onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
              style={{
                marginBottom: 8,
                display: "block"
              }}
            />
            <Space>
              <Button
                type="primary"
                onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                icon={<SearchOutlined />}
                size="small"
                style={{
                  width: 90
                }}
              >
                BUSCAR
              </Button>
              <Button
                onClick={() => clearFilters && handleReset(clearFilters)}
                size="small"
                style={{
                  width: 90
                }}
              >
                REINICIAR
              </Button>
              <Button
                type="link"
                size="small"
                onClick={() => {
                  confirm({
                    closeDropdown: false
                  });
                  setSearchText(selectedKeys[0]);
                  setSearchedColumn(dataIndex);
                }}
              >
                FILTRAR
              </Button>
            </Space>
          </div>
        ),
        filterIcon: (filtered) => (
          <SearchOutlined
            style={{
              color: filtered ? "#1890ff" : undefined
            }}
          />
        ),
        onFilter: (value, record) => {
          const dataIndexArr = dataIndex.split(".");
          let nestedValue = record;
          for (const key of dataIndexArr) {
            nestedValue = nestedValue[key];
            if (!nestedValue) break;
          }
          return nestedValue && nestedValue.toString().toLowerCase().includes(value.toLowerCase());
        },
        onFilterDropdownOpenChange: (visible) => {
          if (visible) {
            setTimeout(() => searchInput.current?.select(), 100);
          }
        },
        render: (text, record) => {
        if(record.negocio_propietario==null)
        {
          record.negocio_propietario=record.propietario
          if(record.negocio_propietario.nombre_del_negocio==null)
          record.negocio_propietario.nombre_del_negocio= record.propietario.nombre==null ? record.propietario.razon_social:record.propietario.nombre
        }
          const dataIndexArr = dataIndex.split(".");
          let nestedValue = record;
          for (const key of dataIndexArr) {
            nestedValue = nestedValue[key];
            if (!nestedValue) break;
          }
          return searchedColumn === dataIndex ? (
            <Highlighter
              highlightStyle={{
                backgroundColor: "#ffc069",
                padding: 0
              }}
              searchWords={[searchText]}
              autoEscape
              textToHighlight={nestedValue ? nestedValue.toString() : ""}
            />
          ) : (
            nestedValue
          )
        }
      });
      
        
    return (
        <Table
            bordered
            columns={[
                {
                    title: "Licencia",
                    dataIndex: "revision_id",
                    key: "revision_id",
                    ...getColumnSearchProps("licencia.clave"),
                },
                
                {
                    title: "Propietario",
                    dataIndex: "entidad",
                    key: "entidad",
                    ...getColumnSearchProps("negocio_propietario.nombre_del_negocio"!==null   ?"negocio_propietario.nombre_del_negocio":"propietario.nombre"),
                },
                {
                    title: "RFC Propietario",
                    dataIndex: "rfc_propietario",
                    key: "rfc_propietario",
                    ...getColumnSearchProps("negocio_propietario.rfc"!==null  ?"negocio_propietario.rfc":"propietario.rfc"),
                },
                {
                    title: "Operador",
                    dataIndex: "revision_status",
                    key: "revision_status",
                    ...getColumnSearchProps("negocio_operador.nombre_del_negocio"),
                },
                {
                    title: "RFC Operador",
                    dataIndex: "rfc_operador",
                    key: "rfc_operador",
                    ...getColumnSearchProps("negocio_operador.rfc"),
                },
                {
                    title: "Fecha de Asignación",
                    dataIndex: "pago",
                    key: "pago",
                    render: (_, record) => {
                        return <h6>{d(record.created_at)}</h6>;
                    },
                },
                {
                    title: "Tipo",
                    dataIndex: "pago",
                    key: "pago",
                    render: (_, record) => {
                        return <h6>{record.licencia.tipo}</h6>;
                    },
                },
              
                {
                    title: "",
                    dataIndex: "id",
                    key: "id",
             
                    render: (_, record) => {
                   
                        if(window?.user?.role=='EntidadRevisoraDirector'){
                        return (
                        <Popconfirm
                        title="¿Está Seguro de desligar esta licencia? (causa: error al ligar por usuario)"
                        description="Desligar Licencia"
                        onConfirm={() => {
                            if ({ confirm }) {
                               
                                desligar(record)
                            }
                        }}
                        onCancel={() => {
                        }}
                        okText="Si"
                        cancelText="No"
                      >
                        <a href="#">Desligar</a>
                      </Popconfirm>
                            );
                    }
                },
                },
             
            ]}
            dataSource={data}
        ></Table>
    );
}
