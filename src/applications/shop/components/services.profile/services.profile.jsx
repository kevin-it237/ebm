import React, { useState, useEffect } from 'react';
import { ReactComponent as FilledArrow } from "../../../../assets/icons/filled_arrow.svg";
import Button from "../../../../app/components/buttons/button/button"
import './services.profile.scss';
import Modal from "../../../../app/components/modal/modal";
import Select from 'react-select'
import makeAnimated from 'react-select/animated';
import axios from "axios";
import config from "../../../../config";
import {toast} from "material-react-toastify";
import LoaderIcon from "react-loader-icon";

const SERVICES_LIST = [
    {
        id: 1,
        title: "Coupe Homme",
        items: [ "Coupe et brushing femme", "Brushing", "Soin capillaire femme", "Coupe femme"],
        actived: true
    },
    {
        id: 2,
        title: "Coupe Femme",
        items: [ "Coupe et brushing femme", "Brushing", "Soin capillaire femme", "Coupe femme"],
        actived: false
    },
]
const animatedComponents = makeAnimated();

const ServicesProfile = () => {

    const [services, setServices] = useState([]);//contient les services de l'institution
    const [showModal, setShowModal] = useState(false);
    const [selectService, setselectService] = useState([]); //contient tous les services de la base
    const [activeServiceIndex, setActiveServiceIndex] = useState(-1); //contient tous les services de la base

    useEffect(() => {
        getServiceInstitut();
        getAllservice();
        //setServices(SERVICES_LIST);
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

    console.log(services)
    const toggleService = (index) => {
        setActiveServiceIndex(activeServiceIndex===index?-1:index)
    }

    const getServiceInstitut = () =>{
        axios.get(config.baseUrl+"/institution/services/show")
            .then(response=>{
                console.log(response.data.message)
                setServices(response.data.message)
            })
            .catch(error=>{
                notify(error)
            })
    }

    const notify = (err) => toast.error(err);

    console.log(selectService)
    console.log(services)
    const groupStyles = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    };
    const groupBadgeStyles = {
        backgroundColor: '#EBECF0',
        borderRadius: '2em',
        color: '#172B4D',
        display: 'inline-block',
        fontSize: 12,
        fontWeight: 'normal',
        lineHeight: '1',
        minWidth: 1,
        padding: '0.16666666666667em 0.5em',
        textAlign: 'center',
    };
    return (
        <div className="services">
            {services.length !== 0 ?
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
           <div className="button-wrapper" onClick={e=>{
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
                            closeMenuOnSelect={false}
                            components={animatedComponents}
                            isMulti
                            options={selectService}
                        />
                        <Button size="sm" onClick={() => {
                            setShowModal(false)
                        }}>Enregistrer</Button>
                    </div>
                </Modal>
            }
        </div>
    )

}

export default ServicesProfile;
