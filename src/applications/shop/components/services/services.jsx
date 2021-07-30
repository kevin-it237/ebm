import React, { useState, useEffect } from 'react';
import { ReactComponent as FilledArrow } from "../../../../assets/icons/filled_arrow.svg";
import Button from "../../../../app/components/buttons/button/button"
import './services.scss';

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

const Services = () => {
    
    const [services, setServices] = useState([]);

    useEffect(() => {
        setServices(SERVICES_LIST);
    }, [])

    const toggleService = (serviceId) => {
        const serviceList = services.map(ser => {
            if(ser.id === serviceId) {
                ser.actived = !ser.actived
            }
            return ser;
        })
        setServices(serviceList);
    }

    return (
        <div className="services">
            {
                services.map((service, i) => (
                    <div key={i} className={`service-group ${service.actived ? "actived" : ""}`}>
                        <div className="title-wrapper">
                            <FilledArrow />
                            <h3 onClick={() => toggleService(service.id)} className="title">{service.title}</h3>
                        </div>
                        {
                            service.actived&&
                            <div key={i} className="items">
                                {
                                    service.items.map(item => (
                                        <p key={item}>{item}</p>
                                    ))
                                }
                            </div>
                        }
                    </div>
                ))
            }
            <div className="button-wrapper">
                <Button size="md">Book a service</Button>
            </div>
        </div>
    )
  
}

export default Services;