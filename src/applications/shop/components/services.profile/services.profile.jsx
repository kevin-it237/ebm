import React, { useState, useEffect } from 'react';
import { ReactComponent as FilledArrow } from "../../../../assets/icons/filled_arrow.svg";
import Button from "../../../../app/components/buttons/button/button"
import './services.profile.scss';
import Modal from "../../../../app/components/modal/modal";
import Select from 'react-select'
import makeAnimated from 'react-select/animated';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import axios from "axios";
import config from "../../../../config";
import {toast} from "material-react-toastify";
import LoaderIcon from "react-loader-icon";

const animatedComponents = makeAnimated();

const ServicesProfile = () => {

    const [services, setServices] = useState([]);//contient les services de l'institution
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(false);
    const [identity, setIdentity] = useState("");
    const [idDelete, setIdDelete] = useState("");
    const [message, setMessage] = useState("");//Message a affiché
    const [showModal, setShowModal] = useState(false);
    const [del, setDel] = useState(false);
    const [selectService, setselectService] = useState([]); //contient tous les services de la base
    const [activeServiceIndex, setActiveServiceIndex] = useState(-1); //contient tous les services de la base

    useEffect(() => {
        getServiceInstitut();
        getAllservice();
    }, [])

    const getAllservice = () => {
        let tab = []
        axios.get(config.baseUrl + '/user/service/index')
            .then(response => {
                Object.keys(response.data.message).map((search, index) => (
                    tab[index] = {
                        value: response.data.message[search].id,
                        label: response.data.message[search].name_fr,
                    }
                ))
                setselectService(tab)
            })
            .catch(error => {
                console.log(error)
            })
    }

    const deleteService = () => {
        axios.post(config.baseUrl + '/institution/delete/service', {id: idDelete})
            .then(res => {
                getServiceInstitut()
            })
            .catch(err => {
                console.log(err)
            })
    }

    const toggleService = (index) => {
        setActiveServiceIndex(activeServiceIndex === index ? -1 : index)
    }

    const getServiceInstitut = () => {
        setLoading(true)
        axios.get(config.baseUrl + "/institution/services/show")
            .then(response => {
                setServices(response.data.message)
                setLoading(false)
            })
            .catch(error => {
                notify(error)
                setLoading(false)
            })
    }

    console.log(services)

    const addService = () => {
        setLoading(true)
        axios.post(config.baseUrl+'/institution/service/add', {service_id: identity})
            .then(res=>{
                console.log(res.data.message)
                if (res.data.message){
                    setData(true)
                    setMessage(res.data.message)
                }
                axios.get(config.baseUrl + "/institution/services/show")
                    .then(response => {
                        console.log(res.data.message)
                        setServices(response.data.message)
                        setLoading(false)
                    })
                    .catch(error => {
                        notify(error)
                        setLoading(false)
                    })
                setLoading(false)
            })
            .catch(error=>{
                console.log(error)
                setLoading(false)
            })
    }

    const notify = (err) => toast.error(err);

    const handleChange =(e)=>{
        setIdentity(e.value)
    }

    console.log(selectService)

    return (
        <div className="services">
            {!loading && services.length !== 0 &&
                <div>
                    {
                        Object.keys(services).map((service, i) => (
                            <div key={i} className={`service-group ${activeServiceIndex === i ? 'actived' : ''}`}>
                                <div className="title-wrapper" onClick={(event) => {
                                    event.preventDefault();
                                    toggleService(i)
                                }}>
                                    <FilledArrow/>
                                    <h3 className="title">{service}</h3>
                                </div>
                                {activeServiceIndex === i && (services[service]).map(item => (
                                    <div key={i} className="items">
                                        {
                                            <div style={{
                                                display: "flex", justifyContent: "space-between", height: 25,
                                                fontSize: 12, marginRight: 20
                                            }}>
                                                <p>{item.name_fr}</p>
                                                <DeleteOutlineIcon style={{height: 20, width: 20}} onClick={(e)=> {
                                                    e.preventDefault(); setIdDelete(item.id); setDel(true)
                                                }}/>
                                            </div>
                                        }
                                    </div>
                                ))}
                            </div>
                        ))
                    }</div>
            }
            {
                loading &&<LoaderIcon type={"cylon"} color={"#6B0C72"}/>
            }
            {
                !loading && services.length === 0 &&
                    <center>
                        <h2 style={{marginTop: '10vh', fontSize: 12}}>Aucun Sevice</h2>
                    </center>
            }
            <div className="button-wrapper" onClick={e => {
                setShowModal(true);
            }}>
                <Button size="md">Ajouter un Service</Button>
            </div>
            {
                showModal &&
                <Modal hide={() => setShowModal(false)}>
                    <div className="cart-modal-content">
                        <h3>Choisir un service</h3>
                        <Select
                            placeholder="Service(s)..."
                            onChange={handleChange}
                            closeMenuOnSelect={false}
                            components={animatedComponents}
                            options={selectService}
                        />
                        <Button size="sm" onClick={(e) => {e.preventDefault();
                            setShowModal(false); addService()
                        }}>Enregistrer</Button>
                    </div>
                </Modal>
            }
            {
                data &&
                <Modal hide={() => {
                    setShowModal(false); setData(false)
                }}>
                    <h2>{message}</h2>
                </Modal>
            }
            {
                del &&
                <Modal hide={() => {setShowModal(false); setData(false)}}>
                    <center><h2>Voulez vous vraiment supprimer ?</h2></center>
                    <div style={{display: "flex", justifyContent: "space-between", marginTop: 20}}>
                        <Button size="sm" onClick={() => {setDel(false)
                        }}>Annuler</Button>
                        <Button size="sm" style={{backgroundColor: 'red'}}
                                onClick={() => {deleteService(); setDel(false)}}>Confirmer</Button>
                    </div>
                </Modal>
            }
        </div>
    )

}

export default ServicesProfile;
