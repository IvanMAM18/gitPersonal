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
             <div className="p-2">
                 {inputStyle(selectedKeys,setSelectedKeys,confirm,dataIndex,columns,searchInput)}
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
                         style={{
                             width: 90,
                         }}
                     >
                         Reiniciar
                     </Button>
                     <Button
                         type="primary"
                         size="small"
                         style={{
                             width: 90,
                         }}
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

      const nombreColumnIndex = updatedColumns.findIndex(
          (column) => column.dataIndex === 'nombre'
      );

      updatedColumns[nombreColumnIndex] = {
          ...updatedColumns[nombreColumnIndex],
          ...getColumnSearchProps('nombre'),
      };

      const claveScianColumnIndex = updatedColumns.findIndex(
        (column) => column.dataIndex === 'clave_scian'
    );

    updatedColumns[claveScianColumnIndex] = {
        ...updatedColumns[claveScianColumnIndex],
        ...getColumnSearchProps('clave_scian'),
    };

    const tipoColumnIndex = updatedColumns.findIndex(
        (column) => column.dataIndex === 'tipo'
    );

    updatedColumns[tipoColumnIndex] = {
        ...updatedColumns[tipoColumnIndex],
        ...getColumnSearchProps('tipo'),
    };
    //  const columnIndex = [];
    //  columns.map((objeto, index)=>{
    //      columnIndex[index] = ['columnIndex'+index];
    //          columnIndex[index] = updatedColumns.findIndex(
    //              (column) => column.dataIndex === (''+objeto.dataIndex)
    //          );
    
    //          updatedColumns[columnIndex[index]] = {
    //              ...updatedColumns[columnIndex[index]],
    //              ...getColumnSearchProps(''+objeto.dataIndex),
    //          };
    //  });

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
 function inputStyle(selectedKeys,setSelectedKeys,confirm,dataIndex,columns,searchInput){
    if(dataIndex === 'nombre' || dataIndex === 'clave_scian'){
         return (
             <Input
             ref={searchInput}
             placeholder= {placeholderTitlte(columns,dataIndex)}
             value={selectedKeys[0]}
             onChange={(e) =>
                setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() =>
                handleSearch(selectedKeys, confirm, dataIndex)
            }
            className={"mb-1 d-block"}
            />);
    }
    if(dataIndex === 'tipo'){
        columns.map((objeto, index)=>{
            if(objeto.dataIndex === dataIndex){
                //titlePlaceholder [index]= (objeto.filters);
                console.log(objeto.filters);
            }
        })
//         <Checkbox
//   options={[
//     { label: 'Sí', value: 'si' },
//     { label: 'No', value: 'no' },
//     { label: 'Reset', value: 'reset' }
//   ]}
//   value={selectedKeys}
//   onChange={(values) => setSelectedKeys(values)}
//   className="mb-1 d-block"
// />
    }
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


// import {Checkbox, Input,Button,Popover,Table, Tag} from "antd";
// import React, {useEffect, useState} from "react";
// import SioNoTag from "@/v2/components/SioNo";
// import { InfoCircleOutlined } from '@ant-design/icons';
// import {debounce, pickBy} from "lodash";

// // Estados inicial de los filtros
// const INITIAL_STATE_FILTERS = {
//     nombre: '',
//     clave_scian: '',
//     descripcion: '',
//     impacto: null,
//     sector: null,
//     vende_alchol: null,
//     programa_interno: null,
//     vende_alcohol: null,
//     page: 1,
//     per_page: 10,
// }

// // Estado inicial del paginador
// const INITIAL_PAGINATOR = {
//     data: [],
//     total: 0,
//     page: 1,
//     perPage: 50,
// }

// const tipoSectorClasss = {
//     'COMERCIO' :'green',
//     'INDUSTRIA': 'blue',
//     'SERVICIOS' : 'pink',
// }

// const tipoImpactoClasss = {
//     'bajo_impacto' :'green',
//     'mediano_alto_impacto': 'blue',
//     'alto_impacto' : 'pink',
// }

// export default function CrudView({
//          pageTitle,
//          columns,
//          modulo,
//      }){

//     const [isLoading, setIsLoading] = useState(false)
//     const [filters, setFilters] = useState(INITIAL_STATE_FILTERS)
//     const [paginador, setPaginador] = useState(INITIAL_PAGINATOR)

//     useEffect(() => fetchGirosComerciales(), [filters])

//     const [showPopover, setShowPopover] = useState(false);
//     const [selectedRecord, setSelectedRecord] = useState(null);

//     const handleButtonClick = (nombre) => {
//         setSelectedRecord(nombre);
//         setShowPopover(!showPopover);
//     };

//     const fetchGirosComerciales = debounce(() => {
//         setIsLoading(true)
//         axios.get(`/v2/api/giros-comerciales`, {
//             params: pickBy(filters)
//         })
//             .then(response => {
//                 setPaginador(response.data)
//                 setIsLoading(false)
//             })
//             .catch(errors => {
//                 console.log(errors)
//                 setIsLoading(false)
//             })
//     }, 500)

//     const onTableChange = (event, tableFilters) => {
//         if (tableFilters['nombre']){
//             setData('nombre', tableFilters['nombre'][0])
//         }
//         if (tableFilters['tipo']){
//             setData('impacto', tableFilters['tipo'][0])
//         }
//         if (tableFilters['tipo_sector']){
//             setData('sector', tableFilters['tipo_sector'][0])
//         }
//         if (tableFilters['cobro_programa_interno']){
//             console.log(tableFilters['cobro_programa_interno'][0]);
//             setData('programa_interno', tableFilters['cobro_programa_interno'][0])
//         }
//         if (tableFilters['certificado_medio_ambiente']){
//             setData('medio_ambiente', tableFilters['certificado_medio_ambiente'][0])
//         }
//         if (tableFilters['licencia_alcohol_giro_comercial']){
//             setData('vende_alcohol', tableFilters['licencia_alcohol_giro_comercial'][0])
//         }

//         setData('page', event.current)
//         setData('per_page', event.pageSize)
//     }

//     const setData =(property, value) => {
//         setFilters(prevFilters => {
//             return {
//                 ...prevFilters,
//                 [property]: value
//             };
//         })
//     }

//     columns[1].render = (text, record) => {
//         return (
//             <span>
//                 {text}
//                 <Popover
//                     content={selectedRecord === record.nombre && (
//                         <div className="w-96 text-justify">
//                             <span className="text-red-800 text-lg">Descripcion:</span>
//                             <br />
//                             {record.descripcion}
//                         </div>
//                     )}
//                     visible={showPopover}
//                     placement="right"
//                 >
//                     <Button
//                         type="text"
//                         title="Descripcion"
//                         icon={<InfoCircleOutlined style={{ color: 'red' }} />}
//                         onClick={() => handleButtonClick(record.nombre)}
//                     />
//                 </Popover>
//             </span>
//         );
//     };

//     const _columns = [
//         ...columns,
                    
//         {
//             title: "Acciones",
//             key: "action",
//             // render: (text, record) => (
//             //     <Space size="middle">
//             //         <Button type="primary" onClick={() => fillForm(record)}>
//             //             Editar
//             //         </Button>
//             //         {formFieldsPassword && (
//             //             <Button
//             //                 type="primary"
//             //                 onClick={() => {
//             //                     fillFormPassword(record);
//             //                 }}
//             //             >
//             //                 Editar Contraseña
//             //             </Button>
//             //         )}
//             //         <Button
//             //             onClick={() => deleteConfirm(record, modelo, loadItems)}
//             //         >
//             //             Eliminar
//             //         </Button>
//             //     </Space>
//             // ),
//         },
//     ];

//     return (
//         <div className="p-4">
        

//             <h1 className="text-gray-700">{pageTitle ? pageTitle : "Titulo Default"}</h1>

//             <div className="mb-3 grid grid-cols-1 xl:grid-cols gap-2 bg-gray-100 border px-4 py-2 rounded-sm">
//                 <div className="w-full flex flex-col">
//                     <h2 className="text-red-800">Buscar palabras claves</h2>
//                     <Input placeholder="Buscar palabras claves" className="w-full" onChange={event => setData('descripcion', event.target.value)} />
//                 </div>
//             </div>
// <div className="top-bar">
//                  <span className="button-container">
//                      <Button
//                          type="primary"
//                          onClick={() => {
//                              cleanForm();
//                              showModal("Nuevo", true);
//                          }}
//                      >
//                          Nuevo
//                      </Button>
//                  </span>
//              </div>
//             <Table
//                 className="border border-gray-200 p-2"
//                 loading={isLoading}
//                 columns={_columns}
//                 dataSource={paginador.data}
//                 onChange={onTableChange}
//                 pagination={{
//                     defaultPageSize: 50,
//                     defaultPageSize: filters.per_page,
//                     showSizeChanger: true,
//                     total: paginador.total,
//                     pageSizeOptions: [
//                         "10",
//                         "50",
//                         "100",
//                         "300",
//                         "1000",
//                     ],
//                 }}
//             />
//         </div>
//     )
// }
