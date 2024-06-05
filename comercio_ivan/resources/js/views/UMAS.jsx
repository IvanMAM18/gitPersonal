import React, { useEffect, useState } from 'react';
import { Button, Table, Modal, notification, Input, Space} from 'antd';
import axios from "axios";
import ReactDOM from "react-dom";
import moment from 'moment'
import RolesRouter from './RolesRouter';


function UMAS(props) {

    const [umas, setUmas] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editModal, setEditModal] = useState(false)
    const [addUMAModal, setAddUMAModal] = useState(false)
    const [umaDeleted, setUmaDeleted] = useState(null)
    const [umaEdited, setUmaEdited] = useState(null)
    const [umaToAdd, setUmaToAdd] = useState([])

    const openNotification = (type, className, message, description) => {
      notification[type]({
          duration: 2,
          className: className,
          message: message,
          description: description,
      });
  };

    const deleteRecordModal = (record) => {
      setUmaDeleted(record)
      showModal()
    }

    const editRecordModal = (record) => {
      setUmaEdited(record)
      showEditModal()
    }

    const resetUMA = ()=> {
      setUmaToAdd({
        año: +moment().format('YYYY'),
        diario: 0,
        mensual: 0,
        anual: 0
      })
    }

    const deleteRecord = () => {
      axios.post('/app/delete-uma', umaDeleted)
      .then(result => {
        console.log(result);
        if (result.data == 1) {
          openNotification('success', 'success-notification', 'Borrar UMA', 'Se ha borrado correctamente.')
          getAllUmas()
        } else {
          openNotification('error', 'error-notification', 'Borrar UMA', 'Hubo un error al borrar, inténtelo de nuevo.')
        }
      })
    }

    const editUmaRecord = () => {
      axios.post('/app/add-uma', umaToAdd)
      .then(result => {
        console.log(result);
        if (result.data == 1) {
          openNotification('success', 'success-notification', 'Agregar UMA', 'Se ha agregado correctamente.')
          resetUMA()
          getAllUmas()
        } else {
          openNotification('error', 'error-notification', 'Agregar UMA', 'Hubo un error al agregar, inténtelo de nuevo.')
        }
      })
    }

    const addRecord = () => {
      axios.post('/app/add-uma', umaToAdd)
      .then(result => {
        console.log(result);
        if (result.data == 1) {
          openNotification('success', 'success-notification', 'Agregar UMA', 'Se ha agregado correctamente.')
          resetUMA()
          getAllUmas()
        } else {
          openNotification('error', 'error-notification', 'Agregar UMA', 'Hubo un error al agregar, inténtelo de nuevo.')
        }
      })
    }

    const showModal = () => {
      setIsModalOpen(true);
    };
    const handleOk = () => {
      deleteRecord();
      setIsModalOpen(false);
    };
    const handleCancel = () => {
      setIsModalOpen(false);
    };

    const showAddModal = () => {
      setAddUMAModal(true);
    };
    const handleAddOk = () => {
      addRecord();
      setAddUMAModal(false);
    };
    const handleAddCancel = () => {
      setAddUMAModal(false);
    };

    const getAllUmas = () => {
        axios.get('/app/all-umas' )
            .then(result => {
                let data = result.data
                data = data.map((d) => {
                    d.key = d.id
                    return d
                });
                setUmas(data)
            })
    }

    const changeDiarioValueOnAddState = (name, value) => {
      let mensual = value * 30.4;
      let anual = mensual * 12;
      setUmaToAdd({
        ...umaToAdd,
        'diario': value,
        'mensual': mensual,
        'anual': anual
      })
      console.log("UMA TO ADD: ", umaToAdd)
    }

    useEffect(() => {
        getAllUmas();
        resetUMA()
    }, [])

    const columns = [
        {
          title: 'Año',
          dataIndex: 'año',
          key: 'año',
          render: (text) => <a>{text}</a>,
        },
        {
            title: 'Diario',
            dataIndex: 'diario',
            key: 'diario',
          },
        {
          title: 'Mensual',
          dataIndex: 'mensual',
          key: 'mensual',
        },
        {
          title: 'Anual',
          dataIndex: 'anual',
          key: 'anual',
        },
        {
          title: 'Action',
          dataIndex: "id",
          key: "id",
          render: (text, record) => (
              <Button 
              type="primary"
              onClick={() => deleteRecordModal(record)}>
                Delete
              </Button>
          ),
        },
      ];

    return (
        <div className='umas-container'>
            <h1>UMAS</h1>
            <div className='umas-table'>
              <Button onClick={() => showAddModal()}>Agregar UMA</Button>
                <Table columns={columns} dataSource={umas} />
                <Modal title="Borrar UMA" 
                  centered
                  visible={isModalOpen}
                  onOk={() => handleOk()} 
                  onCancel={() => handleCancel()}>
                    <p>¿Está seguro que desea borrar este registro?</p>
                </Modal>
                <Modal title="Agregar UMA" 
                  centered
                  visible={addUMAModal}
                  onOk={() => handleAddOk()} 
                  onCancel={() => handleAddCancel()}>
                    <label>Año</label><Input placeholder="Basic usage" value={umaToAdd.año} disabled={true}/>
                    <label>Diario</label><Input placeholder="Basic usage" value={umaToAdd.diario} onChange={(e)=>changeDiarioValueOnAddState('diario', e.target.value)}/>
                    <label>Mensual</label><Input placeholder="Basic usage" value={umaToAdd.mensual} disabled={true}/>
                    <label>Anual</label><Input placeholder="Basic usage"value={umaToAdd.anual} disabled={true}/>
                </Modal>
            </div>
            
        </div>
        
    );

}

export default UMAS;

if (document.getElementById('umas-content')) {
    ReactDOM.render(<UMAS />, document.getElementById('umas-content'));
}