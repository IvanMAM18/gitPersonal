import { useEffect, useState, useRef } from "react";
import useGetListaEntidadesRevisoras from "../../utils/hooks/useGetListaEntidadesRevisoras";
import useGetRoles from "../../utils/hooks/useGetRoles";
import CrudView from "./CrudView";
import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, Space, Tag } from "antd";
import Highlighter from "react-highlight-words";
import { deDE } from "@mui/x-date-pickers";

export default function Usuario() {
    const [roles, getRoles] = useGetRoles();
    const [entidadesRevisoras, getEntidadesRevisoras] =
        useGetListaEntidadesRevisoras();
    const [renderCrudView, setRenderCrudView] = useState(false);

    useEffect(() => {
        getRoles();
        getEntidadesRevisoras();
    }, []);

    useEffect(() => {
        if (entidadesRevisoras.length > 0) {
            setRenderCrudView(true);
        }
    }, [entidadesRevisoras]);
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
            clearFilters,
            close,
        }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <Input
                    ref={searchInput}
                    placeholder={`Buscar ${dataIndex}`}
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
                        onClick={() =>
                            clearFilters && handleReset(clearFilters)
                        }
                        size="small"
                        style={{
                            width: 110,
                        }}
                    >
                        Restablecer
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
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        Cerrar
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
        // onFilter: (value, record) => (
        //     record[dataIndex]
        //     .toString()
        //     .toLowerCase()
        //     .includes(value.toLowerCase())
        // ),
        onFilter: (value, record) => {
            if (record[dataIndex] && typeof record[dataIndex] !== 'undefined') {
              return record[dataIndex].toString().toLowerCase().includes(value.toLowerCase());
            } else {
              return false;
            }
          },
            
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{
                        backgroundColor: "#ffc069",
                        padding: 0,
                    }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ""}
                />
            ) : (
                text
            ),
    });
    const getColumnSearchPropsRol = (dataIndex) => ({
        filterDropdown: ({
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
            close,
        }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <Input
                    ref={searchInput}
                    placeholder={`Buscar ${dataIndex}`}
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
                        onClick={() =>
                            clearFilters && handleReset(clearFilters)
                        }
                        size="small"
                        style={{
                            width: 110,
                        }}
                    >
                        Restablecer
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
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        Cerrar
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
        // onFilter: (value, record) => (
        //     record[dataIndex]
        //     .toString()
        //     .toLowerCase()
        //     .includes(value.toLowerCase())
        // ),
        onFilter: (value, record) => {
        
            if (record[dataIndex] && typeof record[dataIndex] !== 'undefined') {
                const rol = roles.filter((rol) => rol?.nombre.toLowerCase().includes(value.toLowerCase()));
                //console.log(rol)
               return  rol.find(r => r.id=== record[dataIndex]);

                 //return r.id === record[dataIndex];
                //return   rol[0]?.id === record[dataIndex];
                
             // record[dataIndex].role_id==.toString().toLowerCase().includes(value.toLowerCase());
            } else {
                if(value.toLowerCase()==="no asignado")
                return record[dataIndex] ===null
              return false;
            }
          },
            
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (record) => {
            const rol = roles.filter((rol) => rol?.id === record);
            return <span>{rol[0]?.nombre ?? "No asignado"}</span>;
        },
    });
    const getColumnSearchPropsER = (dataIndex) => ({
        filterDropdown: ({
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
            close,
        }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <Input
                    ref={searchInput}
                    placeholder={`Buscar ${dataIndex}`}
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
                        onClick={() =>
                            clearFilters && handleReset(clearFilters)
                        }
                        size="small"
                        style={{
                            width: 110,
                        }}
                    >
                        Restablecer
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
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        Cerrar
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
        // onFilter: (value, record) => (
        //     record[dataIndex]
        //     .toString()
        //     .toLowerCase()
        //     .includes(value.toLowerCase())
        // ),
        onFilter: (value, record) => {
           
            if (record[dataIndex] && typeof record[dataIndex] !== 'undefined') {
                const entidad_revisora = entidadesRevisoras.filter((entidadRevisora) => entidadRevisora?.nombre.toLowerCase().includes(value.toLowerCase()));
               
                return   entidad_revisora[0]?.id === record[dataIndex];
                
             // record[dataIndex].role_id==.toString().toLowerCase().includes(value.toLowerCase());
            } else {
                if(value.toLowerCase()==="no asignada")
                return record[dataIndex] ===null
              return false;
            }
          },
            
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (record) => {
            const entidad_revisora = entidadesRevisoras.filter(
                (entidadRevisora) => entidadRevisora?.id === record
            );
            return (
                <span>{entidad_revisora[0]?.nombre ?? "No asignada"}</span>
            );
        },
    });
    const tableColumns = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
            fixed: 'left',
        },
        {
            title: "Nombre",
            dataIndex: "nombre",
            key: "nombre",
            ...getColumnSearchProps("nombre"),
            fixed: 'left',
        },
        {
            title: "Primer Apellido",
            dataIndex: "apellido_pat",
            key: "apellido_pat",
            ...getColumnSearchProps("apellido_pat"),
        },
        {
            title: "Segundo Apellido",
            dataIndex: "apellido_mot",
            key: "apellido_mot",
            ...getColumnSearchProps("apellido_mot"),
        },
        {
            title: "RFC",
            dataIndex: "rfc",
            key: "rfc",
            ...getColumnSearchProps("rfc"),
        },
        {
            title: "CURP",
            dataIndex: "curp",
            key: "curp",
            ...getColumnSearchProps("curp"),
        },
        {
            title: "Correo",
            dataIndex: "email",
            key: "email",
            ...getColumnSearchProps("email"),
        },
        {
            title: "Rol",
            dataIndex: "role_id",
            key: "role_id",
            ...getColumnSearchPropsRol("role_id"),
            
        },
        {
            title: "Validado",
            dataIndex: "email_verified_at",
            key: "email_verified_at",
            render: (record) => {
                const verificado = (record!=null);
                return <span>{verificado?"Si": "No"}</span>;
            },
        },
        {
            title: "Entidad revisora",
            dataIndex: "entidad_revision_id",
            key: "entidad_revision_id",
            ...getColumnSearchPropsER("entidad_revision_id"),
        },
    ];

    const formFields = [
        {
            name: "id",
            label: "ID",
            value: "",
            type: "input",
            disabled: true,
            hidden: true,
            rules: [
                {
                    required: false,
                    message: "",
                },
            ],
        },
        {
            name: "nombre",
            label: "Nombre",
            value: "",
            type: "input",
            disabled: false,
            rules: [
                {
                    required: true,
                    message: "Por favor ingrese el nombre del usuario",
                },
            ],
        },
        {
            name: "apellido_pat",
            label: "Primer apellido",
            value: "",
            type: "input",
            disabled: false,
            rules: [
                {
                    required: true,
                    message:
                        "Por favor ingrese el apellido paterno del usuario",
                },
            ],
        },
        {
            name: "apellido_mot",
            label: "Segundo apellido",
            value: "",
            type: "input",
            disabled: false,
            rules: [
                {
                    required: false,
                    message:
                        "Por favor ingrese el apellido materno del usuario",
                },
            ],
        },
        {
            name: "email",
            label: "Correo",
            value: "",
            type: "input",
            disabled: false,
            rules: [
                {
                    pattern:
                        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                    required: true,
                    message: "Por favor ingrese el correo!",
                },
            ],
        },
        {
            name: "role_id",
            label: "Rol",
            value: "",
            options: [...roles],
            type: "select",
            disabled: false,
            rules: [
                {
                    required: false,
                    message:
                        "Por favor ingrese el nombre del rol que desea asignar a este usuario!",
                },
            ],
        },
        {
            name: "entidad_revision_id",
            label: "Entidad revisora",
            value: "",
            type: "select",
            disabled: false,
            options: [...entidadesRevisoras],
            rules: [
                {
                    required: false,
                    message: "Este campo es requerido!",
                },
            ],
        },
    ];

    const disabledFormFields = [...formFields].map((formField) => ({
        ...formField,
        disabled: true,
    }));
    const passwordFormFields = [
        {
            name: "password",
            label: "Contraseña",
            value: "",
            type: "inputpassword",
            disabled: false,
            rules: [
                {
                    min: 8,
                    required: true,
                    message:
                        "Por favor ingrese una contraseña, minimo 8 caracteres",
                },
            ],
        },
        {
            name: "password_confirmation",
            label: "Confirmar contraseña",
            value: "",
            type: "inputpasswordconfirm",
            disabled: false,
            rules: [
                {
                    min: 8,
                    required: true,
                    message:
                        "Por favor confirme su contraseña, minimo 8 caracteres",
                },
                ({ getFieldValue }) => ({
                    validator(_, value) {
                        if (!value || getFieldValue("password") === value) {
                            return Promise.resolve();
                        }

                        return Promise.reject(
                            new Error("Las contraseñas no coinciden!")
                        );
                    },
                }),
            ],
        },
    ];

    return (
        renderCrudView === true && (
            <CrudView
                pageTitle="Usuarios"
                modelo="usuarios"
                columns={tableColumns}
                formFields={formFields}
                formFieldsPassword={[
                    ...disabledFormFields,
                    ...passwordFormFields,
                ]}
                key="usuario"
            />
        )
    );
}
