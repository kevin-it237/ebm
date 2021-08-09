import React, {useEffect, useState} from 'react';
import './home.drawer.content.scss'
import { useHistory } from 'react-router-dom';
import BottomDrawer from "../../../../app/components/bottom.drawer/bottom.drawer"
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";
import axios from "axios";
import config from '../../../../config/index'
import LoaderIcon from "react-loader-icon";
import img from "../../../../assets/images/ebm.svg";

const HomeDrawerContent = ({ onClose , name}) => {

    const history = useHistory();
    const [services, setService] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(()=>{
        setLoading(true)
        axios.post(config.baseUrl+'/showparent/show', {name})
            .then(response=>{
                setService(Object.values(response.data.message))
                setLoading(false)
            }).catch(error=>{
            console.log(error)
            setLoading(false)
        });
    }, [])

    return (
        <BottomDrawer onClose={onClose}>
            <div className="service-title">
                <h2>{name}</h2>
                <span></span>
            </div>
            {!loading && services.length !== 0 &&
                <div className="categories">
                    {Object.keys(services).map((service, index)=>(
                        <p className="category-item" key={index}>{services[service]['name_fr']}</p>
                    ))}
                </div>
            }
            {loading &&
                <div className="spinner_load">
                    <LoaderIcon type="cylon" color="#6B0C72"/>
                </div>
            }
            {
                !loading && services.length === 0 &&
                <div>
                    <center>
                        <br/>
                        <img src={require("../../../../assets/images/telescope.png").default}/>
                        <p>{"Aucun resultat trouve"}</p>
                    </center>
                </div>
            }
        </BottomDrawer>
    )
}

export default HomeDrawerContent;