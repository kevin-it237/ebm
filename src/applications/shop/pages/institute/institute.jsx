import React, { useState, useEffect } from 'react';
import './institute.scss'
import { useHistory } from 'react-router-dom';
import { ReactComponent as Back } from "../../../../assets/icons/back.svg"
import {useParams} from "react-router-dom";
import Reviews from "../../components/reviews/reviews"
import Services from "../../components/services/services"
import Localization from "../../components/localization/localization"
import Works from "../../components/works/works"
import img from "../../../../assets/images/mansory.png";
import axios from "axios";
import config from "../../../../config/index";
import {rate} from "../../../../config/helpers";
import logoLink from "../../../../config/logo.link";
import StarsRating from "../../components/stars.rating/stars.rating";


import {isMobile} from "../../../../config/helpers"

const Institute = (props) => {
    const params = useParams();
    const history = useHistory();
    const select = params.slug;

    const [content, setContent] = useState("Revues");
    const [institut, setInstitut] = useState([]);
    const [services, setServices] = useState([]);
    const [star, setStar] = useState(0);
    const [total, setTotal] = useState(0);
    const [each, setEach] = useState([]);
    const [imageProfile, setImageProfile] = useState("");

    useEffect(()=>{
        getInfoInstitut();
        getStarVote();
        getEachVote();
    }, []);

    const MENU_ITEMS = ["Revues", "Services", "Localisation", "Oeuvres"];

    const changeContent = (contentName) => {
        setContent(contentName);
    }

    const getInfoInstitut = () =>{
        axios.get(config.baseUrl+"/institution/show/"+select)
            .then(response=>{
                console.log(response.data)
                setInstitut(response.data.message);
            })
            .catch(error=>{
                console.log(error)
            })

        axios.get(config.baseUrl+"/institution/show/service/"+select)
            .then(response=>{
                setServices(response.data.message)
            })
            .catch(error=>{
                console.log(error)
            })
        axios.get(config.baseUrl+'/user/profile/photo/'+select)
            .then(res=>{
                setImageProfile(res.data.message)
            })
            .catch(error=>{
                console.log(error)
            })
    }

    const getStarVote = () =>{
        axios.get(config.baseUrl+'/institution/rate/show/'+select)
            .then(response=>{
                setStar(rate(response.data.message));
                setTotal(response.data.message.length)
            })
            .catch(error=>{
                console.log(error)
            })
    }

    const getEachVote = () =>{
        axios.get(config.baseUrl+'/institution/review/rate/'+select)
            .then(response=>{
                setEach(response.data.message);
            })
            .catch(error=>{
                console.log(error)
            })
    }

    let bottomContent = (<Reviews/>);
    if(content === "Revues") {
        bottomContent = (<Reviews/>);
    } else if(content === "Services") {
        bottomContent = (<Services services={services} role="institut" select={select}/>);
    } else if(content === "Localisation") {
        bottomContent = (<Localization localization={institut.location} address={institut.address}/>);
    } else {
        bottomContent = (<Works name={select}/>);
    }

    console.log(institut)

    return (
        <div id="institute">
            <div className="header">
                <div className="header-title">
                    <Back onClick={() => history.goBack()} />
                    <h4>Profil Institution</h4>
                </div>
            </div>

            <div className="institute-content">
                {isMobile() && <div className="owner-infos">
                    <img className="avatar" src={logoLink.link + imageProfile} alt={institut.username} />
                    <div>
                        <h3 className="name">{institut.username} {institut.lastname}</h3>
                        <p className="address">{institut.address}</p>
                    </div>
                </div>}
                {!isMobile() && <div className="owner-infos-web">
                    <img className="avatar" src={logoLink.link + imageProfile} alt={institut.username} />
                    <div>
                        <h3 className="name">{institut.username} {institut.lastname}</h3>
                        <p className="address">{institut.address}</p>
                    </div>
                </div>}

                <div className="stats">
                    <div className="rates">
                        <h2>{star}</h2>
                        <p>{total} ratings</p>
                    </div>
                    {
                        <div className="stars-group">
                            {each.map((vote, index)=>(
                                <StarsRating showNumberOfVotes={true} showProgresBar={true} stars={index+1} total={total} votes={vote}/>
                            ))  
                            }
                        </div>
                    }
                </div>

                {isMobile()&&<div className="menu">
                    {
                        MENU_ITEMS.map(item => (
                            <h2 key={item} onClick={() => changeContent(item)} className={`menu-item ${content=== item ? "actived": ""}`}>{item}</h2>
                        ))
                    }
                </div>}
                {!isMobile()&&<div className="menu-web">
                    {
                        MENU_ITEMS.map(item => (
                            <h2 key={item} onClick={() => changeContent(item)} className={`menu-item ${content=== item ? "actived": ""}`}>{item}</h2>
                        ))
                    }
                </div>}
                <div className="bottom-content">
                    {bottomContent}
                </div>
            </div>
        </div>
    )
}

export default Institute;