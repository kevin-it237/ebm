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
import {isMobile} from "../../../../config/helpers";
import point from '../../../../assets/icons/new_moon_10px.png'

const HomeDrawerContent = ({ onClose , name}) => {

    const history = useHistory();
    const [services, setService] = useState([]);
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

    console.log(isMobile())

    console.log(services)
    console.log(loading)

    return (
        <BottomDrawer onClose={onClose}>
            {!isMobile()&&<div className="service-title" style={{paddingLeft: '40vh'}}>
                <h2>{name} ({services.length})</h2>
                <span></span>
            </div>}
            {!isMobile()&&<div style={{paddingLeft: '37vh', fontSize: '15px'}}>
                {!loading && services.length !== 0 &&
                    <div className="categories-web">
                    {Object.keys(services).map((service, index) => (
                        <div style={{display: 'flex', alignItems: 'center', margin: '5px'}}>
                            <img src={point}/>
                            <p className="category-item-web" style={{marginLeft: '5px'}} key={index}>{services[service]['name_fr']}</p>
                        </div>
                    ))}
                    </div>
                }
            </div>
            }
            {isMobile()&&<div>
                {!loading && services.length !== 0 &&
                <div className="categories">
                    {Object.keys(services).map((service, index) => (
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            <img src={point}/>
                            <p className="category-item" key={index}>{services[service]['name_fr']}</p>
                        </div>
                    ))}
                </div>
                }</div>
            }

            {
                loading&&services.length===0&&<div>
                    <LoaderIcon type="cylon" color="#6B0C72"/>
                </div>
            }
            {
                !loading && services.length === 0 &&
                <div>
                    <center>
                        <br/>
                        <img src={require("../../../../assets/images/telescope.png").default}/>
                        <p style={{color: '#6B0C72'}}>{"Aucun service dans cette catégorie"}</p>
                    </center>
                </div>
            }
        </BottomDrawer>
    )
}

export default HomeDrawerContent;