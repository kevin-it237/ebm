import React, {useState} from 'react';
import './home.drawer.content.scss'
import { useHistory } from 'react-router-dom';
import BottomDrawer from "../../../../app/components/bottom.drawer/bottom.drawer"
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";
import axios from "axios";
import config from '../../../../config/index'

const HomeDrawerContent = ({ onClose , name}) => {

    const history = useHistory();
    const [services, setService] = useState("");

    axios.post(config.baseUrl+'/showparent/show', {name})
        .then(response=>{
            setService(Object.values(response.data.message))
        }).catch(error=>{
            console.log(error)
    });

    /*const openService = (name) =>{
        console.log('/service'+{name})
        //history.push('/service'+{name})
    }*/

    return (
        <BottomDrawer onClose={onClose}>
            <div className="service-title">
                <h2>{name}</h2>
                <span></span>
            </div>
            {services.length !==0 ?
            <div className="categories">
                {Object.keys(services).map((service, index)=>(
                    <p className="category-item" key={index}>{services[service]['name_fr']}</p>
                ))}
            </div> :<div className="spinner_load">
                    <Loader type="Circles" height={70} width={70} color="#6B0C72"/>
            </div>
            }
        </BottomDrawer>
    )
}

export default HomeDrawerContent;