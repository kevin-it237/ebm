import React, { useState, useEffect } from 'react';
import { ReactComponent as FilledArrow } from "../../../../assets/icons/filled_arrow.svg";
import Button from "../../../../app/components/buttons/button/button"
import './services.scss';
import index from "../../../../config";
import {useSelector} from "react-redux";
import axios from "axios";
import {convertNwSeToNeSw} from "google-map-react";
import Loader from "react-loader-spinner";

const Services = (props) => {
    
    const [services, setServices] = useState([]);
    const [selected, setSelected] = useState([]);
    const [activeServiceIndex, setActiveServiceIndex] = useState(-1);


    useEffect(() => {
        setServices(props.services)
    }, [])

    console.log(services)


    const onClick = (event)=>{
        event.preventDefault();
    }

    const toggleService = (index) => {
        setActiveServiceIndex(activeServiceIndex===index?-1:index)
    }


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
                }</div> : <div className="spinner_load_search">
                    <Loader type="Circles" height={70} width={70} color="#6B0C72"/>
                </div>
            }

            <div className="button-wrapper">
                <Button size="md">Book a service</Button>
            </div>
        </div>
    )
  
}

export default Services;