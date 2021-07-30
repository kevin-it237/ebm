import React, { useState, useEffect } from 'react';
import './expert.scss'
import { useHistory, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux'
import NavigatorOnline from 'react-navigator-online'
import { ReactComponent as Back } from "../../../../assets/icons/back.svg"
import Reviews from "../../components/reviews_expert/reviews_expert"
import Services from "../../components/services/services"
import Works from "../../components/works/works"
import img from "../../../../assets/images/mansory.png";
import axios from "axios";
import config from "../../../../config/index";
import {rate} from "../../../../config/helpers";
import StarsRating from "../../components/stars.rating/stars.rating";

const Expert = () => {
    const params = useParams();
    const history = useHistory();
    const select = params.slug;

    const [content, setContent] = useState("Revues");
    const [expert, setExpert] = useState([]);
    const [services, setServices] = useState([]);
    const [star, setStar] = useState(0);
    const [total, setTotal] = useState(0);
    const [each, setEach] = useState([]);
    const [messageOnline, setmessageOnline] = useState("");

    useEffect(()=>{
        getInfoExpert();
        getStarVote();
        getEachVote();
        showStatus();
    },[]);

    const MENU_ITEMS = ["Revues", "Services", "Oeuvres"];

    const changeContent = (contentName) => {
        setContent(contentName);
    }

    const getInfoExpert = () =>{
        axios.get(config.baseUrl+"/expert/show/"+select)
            .then(response=>{
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

    console.log("err "+messageOnline)
    const showStatus=(status)=>{
        if (navigator.onLine) {
            console.log(navigator.onLine)
            setmessageOnline("Online");
        }else{
            console.log(navigator.onLine)
            setmessageOnline("Vue à 9h");
        }
    }

    console.log(each)

    const getEachVote = () =>{
        axios.get(config.baseUrl+'/expert/review/rate/'+select)
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
        bottomContent = (<Services services={services}/>);
    } else {
        bottomContent = (<Works />);
    }

    return (
        <div id="expert">
            <div className="header">
                <div className="header-title">
                    <Back onClick={() => history.goBack()} />
                    <h4>{select}</h4>
                </div>
            </div>

            <div className="institute-content">
                <div className="owner-infos">
                    <img className="avatar" src={expert.logo} alt={expert.username} />
                    <div>
                        <h3 className="name">{expert.username}</h3>
                        <div>status {messageOnline}</div>
                    </div>
                </div>

                <p className="description">
                    {expert.description}
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
                                <StarsRating showNumberOfVotes={true} showProgresBar={true} stars={index} total={total} votes={vote}/>
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

export default Expert;