import React, { useState, useEffect } from 'react';
import { ReactComponent as FilledArrow } from "../../../../assets/icons/filled_arrow.svg";
import Button from "../../../../app/components/buttons/button/button"
import './services.scss';
import axios from "axios";
import Select from 'react-select'
import Loader from "react-loader-spinner";
import Modal from "../../../../app/components/modal/modal";
import config from "../../../../config";
import {useParams} from "react-router-dom";
import LoaderIcon from "react-loader-icon";

import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateTimePicker from '@mui/lab/DateTimePicker';
import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';

const Services = (props) => {

    const param = useParams();
    const select = param.slug;
    const [services, setServices] = useState([]);
    const [loader, setLoader] = useState(false);
    const [loaderServ, setLoaderServ] = useState(false);
    const [message, setMassage] = useState(false);
    const [selectService, setselectService] = useState([]);
    const [services_order, setService_Order] = useState([]);
    const [comment, setComment] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modal, setModal] = useState(false);
    const [activeServiceIndex, setActiveServiceIndex] = useState(-1);

    const [value, setValue] = React.useState(new Date());

    const role = props.role;
    useEffect(() => {
        setServices(props.services);
        getServiceInstitut();
    }, [])

    const onClick = (event) => {
        event.preventDefault()
    }

    const selectCat = Object.keys(services).map((service, index) => ({
            'id': index,
            'value': service
        }
    ))

    const getServiceInstitut = () => {
        setLoaderServ(true)
        axios.get(config.baseUrl + "/institution/service/show/" + select)
            .then(response => {
                console.log(response.data)
                if (response.data.message) {
                    setselectService(response.data.message);
                    setLoaderServ(false)
                }
            })
            .catch(error => {
                console.log(error)
                setLoaderServ(false)
            })
    }

    const selectServiceItem = Object.keys(selectService).map((service, index) => (
        {
            'value': selectService[service].id,
            'label': selectService[service].name_fr
        }
    ))

    console.log(role)

    console.log(services_order)
    const saveCommand = () => {
        setLoader(true)
        if (role === 'institut') {
            axios.post(config.baseUrl + '/user/service/order/register', {
                service_id: services_order.value, institution_id: props.select, comment: comment, date: value.toISOString()
            })
                .then(response => {
                    setValue(new Date())
                    console.log(response.data)
                    setLoader(false)
                    if (response.data.message === 'vous avez déjà souscrit à ce service') {
                        setMassage("vous avez déjà souscrit à ce service")
                    } else {
                        setMassage("Commande Enregistrée")
                    }
                })
                .catch(error => {
                    console.log(error)
                    setLoader(false)
                    setMassage("Erreur")
                })
        } else {
            axios.post(config.baseUrl + '/institution/expert/order', {expert_id: props.expert, comment: comment, date: value.toISOString()})
                .then(response => {
                    console.log(response)
                    setLoader(false)
                    if (response.data.message === 'Vous avez deja commander cet expert') {
                        setMassage("vous avez déjà demander cet Expert.")
                    }else {
                        setMassage("Commande Enregistrée")
                    }
                })
                .catch(error => {
                    console.log(error)
                    setLoader(false)
                    setMassage("Erreur")
                })
        }
        setComment("")
    }
    const onSelect = (event) => {
        setService_Order(event)
    }

    const onChange = (event) => {
        setComment(event.target.value)
    }

    const toggleService = (index) => {
        setActiveServiceIndex(activeServiceIndex === index ? -1 : index)
    }

    console.log(props.expert)

    return (
        <div className="services">
            {!loaderServ&&services.length !== 0 &&
            <div>
                {
                    Object.keys(services).map((service, i) => (
                        <div key={i} className={`service-group ${activeServiceIndex === i ? 'actived' : ''}`}>
                            <div className="title-wrapper" onClick={(event) => {
                                onClick(event);
                                toggleService(i)
                            }}>
                                <FilledArrow/>
                                <h3 className="title">{service}</h3>
                            </div>
                            {activeServiceIndex === i && (services[service]).map(item => (
                                <div key={i} className="items">
                                    {
                                        <p>{item.name_fr}</p>
                                    }
                                </div>
                            ))}


                        </div>
                    ))
                }
            </div>
            }
            {
                loaderServ&&services.length===0&&<div className="spinner_load_search">
                    <LoaderIcon type={"cylon"} color={"#6B0C72"}/>
                </div>
            }
            {
                !loaderServ&&services.length===0&&<center>
                    <br/>
                    <img src={require("../../../../assets/images/telescope.png").default}/>
                    <p>Aucun Services</p>
                </center>
            }

            {services.length !== 0 ?
                <div className="button-wrapper">
                    <Button size="md"
                            onClick={() => setShowModal(true)}>{role === 'institut' ? "Acheter Un Service" : "Commander Cet Expert"}</Button>
                </div>
                : ""
            }

            {
                showModal &&
                <Modal>
                    <div className="cart-modal-content" style={{marginTop: -5}}>
                        {role === 'institut' ?
                            <h3>Choisir un service</h3> : <h3>Demander cet expert</h3>
                        }

                        {role === 'institut' ?
                            <div className="registation-final__step">
                                <Select options={selectServiceItem} onChange={onSelect}/>
                            </div>
                            : ""}
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DateTimePicker
                                renderInput={(props) => <TextField {...props} className="textName"/>}
                                label="Date de Livraison"
                                value={value}
                                onChange={(newValue) => {
                                    setValue(newValue);
                                }}
                            />
                        </LocalizationProvider>
                        {
                            role === 'institut' ?
                                <h3 className="cart-modal-content">Commentaire</h3> : ""
                        }
                        <textarea placeholder="Enregistrer votre commentaire ..." name="comment" rows="7"
                                  onChange={onChange}
                                  value={comment} style={{fontSize: "small", marginTop: 5}}/>
                        <div style={{display: 'flex', }}>
                            <Button size="sm" style={{backgroundColor: 'red' }} onClick={() => {setShowModal(false); setComment(''); setValue(new Date())}}>
                                <h3>Annuler</h3>
                            </Button>
                            <Button size="sm" onClick={() => {saveCommand();setModal(true); setShowModal(false)}}>
                                <h3>Commander</h3>
                            </Button>
                        </div>
                        
                    </div>
                </Modal>
            }
            {
                loader && <Modal>
                    <br/>
                    <center>
                        <LoaderIcon type="cylon" color="#6B0C72"/>
                    </center>
                </Modal>
            }
            {
                !loader &&message&& <Modal hide={()=>setMassage(false)}>
                    <center><h2 style={{fontSize: 'small', marginTop: 15}}>{message}</h2>
                    </center>
                </Modal>
            }
        </div>
    )

}

export default Services;
