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
import StarsRating from "../../components/stars.rating/stars.rating";

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
                setInstitut(response.data.message);
            })
            .catch(error=>{
                console.log(error)
            })

        console.log(institut)
        axios.get(config.baseUrl+"/institution/show/service/"+select)
            .then(response=>{
                setServices(response.data.message)
                console.log(response)
            })
            .catch(error=>{
                console.log(error)
            })
    }

    console.log(services)
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
        bottomContent = (<Works />);
    }

    return (
        <div id="institute">
            <div className="header">
                <div className="header-title">
                    <Back onClick={() => history.goBack()} />
                    <h4>{select}</h4>
                </div>
            </div>

            <div className="institute-content">
                <div className="owner-infos">
                    <img className="avatar" alt={institut.username} />
                    <div>
                        <h3 className="name">{institut.username}</h3>
                        <p className="address">{institut.address}</p>
                    </div>
                </div>

                <p className="description">
                    {institut.description}
                </p>

                <div className="stats">
                    <div className="rates">
                        <h2>{star}</h2>
                        <p>{total} ratings</p>
                    </div>
                    {
                        each.length !==0?
                        <div className="stars-group">
                            {each.map((vote, index)=>(
                                <StarsRating showNumberOfVotes={true} showProgresBar={true} stars={index+1} total={total} votes={vote}/>
                            ))  
                            }
                        </div>
                        :
                        <div className="aucun-vote">Aucun vote</div>
                    }
                </div>

                <div className="menu">
                    {
                        MENU_ITEMS.map(item => (
                            <h2 key={item} onClick={() => changeContent(item)} className={`menu-item ${content=== item ? "actived": ""}`}>{item}</h2>
                        ))
                    }
                </div>
                <div className="bottom-content">
                    {bottomContent}
                </div>
            </div>
        </div>
    )
}

export default Institute;