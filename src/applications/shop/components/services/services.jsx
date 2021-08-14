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

const Services = (props) => {

    const param = useParams();
    const select = param.slug;
    const [services, setServices] = useState([]);
    const [loader, setLoader] = useState(false);
    const [message, setMassage] = useState(false);
    const [selectService, setselectService] = useState([]);
    const [services_order, setService_Order] = useState([]);
    const [comment, setComment] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modal, setModal] = useState(false);
    const [activeServiceIndex, setActiveServiceIndex] = useState(-1);

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
        axios.get(config.baseUrl + "/institution/service/show/" + select)
            .then(response => {
                console.log(response.data)
                if (response.data.message) {
                    setselectService(response.data.message);
                }
            })
            .catch(error => {
                console.log(error)
            })
    }

    console.log(selectService)


    const selectServiceItem = Object.keys(selectService).map((service, index) => (
        {
            'value': selectService[service].id,
            'label': selectService[service].name_fr
        }
    ))

    console.log(services_order)
    const saveCommand = () => {
        setLoader(true)
        if (role === 'institut') {
            axios.post(config.baseUrl + '/user/service/order/register', {
                service_id: services_order.value, institution_id: props.select, comment: comment
            })
                .then(response => {
                    console.log(response.data)
                    setLoader(false)
                    if (response.data.message === 'vous avez déjà souscrit à ce service') {
                        setMassage("vous avez déjà souscrit à ce service")
                    } else {
                        setMassage("Commande Effectuée")
                    }
                })
                .catch(error => {
                    console.log(error)
                    setLoader(false)
                    setMassage("Erreur")
                })
        } else {
            axios.post(config.baseUrl + '/institution/expert/order', {expert_id: props.expert, comment: comment})
                .then(response => {
                    console.log(response)
                    setLoader(false)
                    setMassage("Commande Effectuée")
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

    console.log(services)

    return (
        <div className="services">
            {services.length !== 0 ?
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
                    }</div>
                : <div className="spinner_load_search">
                    <LoaderIcon type={"cylon"} color={"#6B0C72"}/>
                </div>
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
                <Modal hide={() => setShowModal(false)}>
                    <div className="cart-modal-content">
                        {role === 'institut' ?
                            <h3>Choisir un(les) service(s)</h3> : <h3>Demander cet expert</h3>
                        }

                        {role === 'institut' ?
                            <div className="registation-final__step">
                                <Select options={selectServiceItem} onChange={onSelect}/>
                            </div>
                            : ""}
                        {
                            role === 'institut' ?
                                <h3 className="cart-modal-content">Commentaire</h3> : ""
                        }

                        <textarea placeholder="Enregistrer votre commentaire..." name="comment" rows="7"
                                  onChange={onChange}
                                  value={comment}/>
                        <Button size="sm" onClick={() => {
                            saveCommand();
                            setModal(true)
                            setShowModal(false)
                        }}>
                            {role === 'institut' ?
                                <h3>Commander un service(s)</h3> : <h3>Commander cet expert</h3>
                            }
                        </Button>
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
            {/*
                modal && !loader && !showModal &&
                <Modal hide={() => setShowModal(false)}>
                    <br/>
                    <center>
                        <div>{message}</div>
                    </center>
                </Modal>
            */}
        </div>
    )

}

export default Services;
