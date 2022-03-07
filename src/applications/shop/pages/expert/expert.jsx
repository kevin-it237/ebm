import React, { useState, useEffect } from 'react';
import TimeAgo from 'javascript-time-ago'
import './expert.scss'
import { useHistory, useParams } from 'react-router-dom';
import { ReactComponent as Back } from "../../../../assets/icons/back.svg"
import Reviews from "../../components/reviews_expert/reviews_expert"
import Services from "../../components/services/services"
import Works from "../../components/works/works"
import img from "../../../../assets/images/mansory.png";
import axios from "axios";
import config from "../../../../config/index";
import {rate} from "../../../../config/helpers";
import StarsRating from "../../components/stars.rating/stars.rating";
import ReactTimeAgo from "react-time-ago";
import fr from "javascript-time-ago/locale/en";
import logoLink from "../../../../config/logo.link";

import {isMobile} from "../../../../config/helpers"

const Expert = () => {
    const params = useParams();
    const history = useHistory();
    const select = params.slug;
    TimeAgo.addLocale(fr)
    const [content, setContent] = useState("Revues");
    const [expert, setExpert] = useState([]);
    const [services, setServices] = useState([]);
    const [star, setStar] = useState(0);
    const [total, setTotal] = useState(0);
    const [each, setEach] = useState([]);
    const [created, setCreated] = useState(0);

    const MENU_ITEMS = ["Revues", "Services", "Oeuvres"];

    useEffect(()=>{
        getInfoExpert();
        getStarVote();
        getEachVote();
        getJoinedDate()
    },[]);

    const changeContent = (contentName) => {
        setContent(contentName);
    }

    const getJoinedDate = () => {
        axios.get(config.baseUrl + '/user/show')
            .then(res => {
                setCreated(res.data.message.created_at)
            })
            .catch(err => {
                console.log(err)
            })
    }

    const getInfoExpert = () =>{
        axios.get(config.baseUrl+"/expert/show/"+select)
            .then(response=>{
                console.log(response.data.message)
                setExpert(response.data.message);
            })
            .catch(error=>{
                console.log(error)
            })

        axios.get(config.baseUrl+"/expert/show/service/"+select)
            .then(response=>{
                setServices(response.data.message)
            })
            .catch(error=>{
                console.log(error)
            })
    }

    const getStarVote = () =>{
        axios.get(config.baseUrl+'/expert/rate/show/'+select)
            .then(response=>{
                setStar(rate(response.data.message));
                setTotal(response.data.message.length)
            })
            .catch(error=>{
                console.log(error)
            })
    }

    console.log(expert)

    const getEachVote = () =>{
        axios.get(config.baseUrl+'/expert/review/rate/'+select)
            .then(response=>{
                setEach(response.data.message);
            })
            .catch(error=>{
                console.log(error)
            })
    }

    console.log(MENU_ITEMS)

    let bottomContent = (<Reviews/>);
    if(content === "Revues") {
        bottomContent = (<Reviews/>);
    } else if(content === "Services") {
        bottomContent = (<Services services={services} role="expert" expert={select}/>);
    } else {
        bottomContent = (<Works name={select}/>);
    }

    return (
        <div id="expert">
            <div className="header">
                <div className="header-title">
                    <Back onClick={() => history.goBack()} />
                    <h4>Profil Expert</h4>
                </div>
            </div>

            <div className="institute-content">
                {isMobile() &&<div className="owner-infos">
                    <img className="avatar" src={logoLink.link +expert.logo} alt={expert.username} />
                    <div>
                        <h3 className="name">{expert.username} {expert.firstname}</h3>
                        {<p>Joined <ReactTimeAgo date={created} locale="en-US" timeStyle="round"/></p>}
                    </div>
                </div>}

                {!isMobile() &&<div className="owner-infos-web">
                    <img className="avatar" src={logoLink.link +expert.logo} alt={expert.username} />
                    <div>
                        <h3 className="name">{expert.username} {expert.firstname}</h3>
                        {<p>Joined <ReactTimeAgo date={created} locale="en-US" timeStyle="round"/></p>}
                    </div>
                </div>}

                <p className="description">
                    {expert.description}
                </p>

                {each.length !==0&&
                    <div className="stats">

                        <div className="rates">
                            <h2>{star}</h2>
                            <p>{total} ratings</p>
                        </div>
                        <div className="stars-group">
                            {each.map((vote, index)=>(
                                <StarsRating key={index} showNumberOfVotes={true} showProgresBar={true} stars={index+1} total={total} votes={vote}/>
                            ))
                            }
                        </div>
                    </div>
                }

                <div className="menu-expert">
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

export default Expert;