import React, { useState, useEffect } from 'react';
import './institute.scss'
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux'
import { ReactComponent as Back } from "../../../../assets/icons/back.svg"
//import StarsRating from "../../components/stars.rating/stars.rating"
import Rating from "@material-ui/lab/Rating";
import { makeStyles } from "@material-ui/core/styles";
import Reviews from "../../components/reviews/reviews"
import Services from "../../components/services/services"
import Localization from "../../components/localization/localization"
import Works from "../../components/works/works"
import img from "../../../../assets/images/mansory.png";
import axios from "axios";
import config from "../../../../config/index";
import {rate} from "../../../../config/helpers";
import StarsRating from "../../components/stars.rating/stars.rating";

const Institute = () => {
    const history = useHistory();
    const select = useSelector((state)=>state.product.payload.name);
    const identity = useSelector((state)=>state.product.payload.identity);

    const [content, setContent] = useState("Revues");
    const [institut, setInstitut] = useState([]);
    const [services, setServices] = useState([]);
    const [star, setStar] = useState(0);
    const [total, setTotal] = useState(0);
    const [each, setEach] = useState([]);
    const [vote, setVote] = useState([]);

    useEffect(()=>{
        getInfoInstitut();
        getStarVote();
        getEachVote();
        let tab = [];
        for (let i =0; i<each.length; i++){
            tab[i] = Object.values(each[i]).length;
        }
        setVote(tab)
    },[]);

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

        axios.get(config.baseUrl+"/institution/show/service/"+identity)
            .then(response=>{
                setServices(response.data.message)
            })
            .catch(error=>{
                console.log(error)
            })
    }

    const getStarVote = () =>{
        axios.get(config.baseUrl+'/user/rate/show/'+identity)
            .then(response=>{
                setStar(rate(response.data.message));
                setTotal(response.data.message.length)
            })
            .catch(error=>{
                console.log(error)
            })
    }

    console.log(each)

    const getEachVote = () =>{
        axios.get(config.baseUrl+'/institution/review/rate/'+identity)
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
                    <img className="avatar" src={institut.logo} alt={institut.username} />
                    <div>
                        <h3 className="name">{institut.type}</h3>
                        <p className="address">{institut.address}</p>
                    </div>
                </div>

                <p className="description">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>

                <div className="stats">
                    <div className="rates">
                        <h2>{star}</h2>
                        <p>{total} ratings</p>
                    </div>
                    <div className="stars-group">
                        <StarsRating showNumberOfVotes={true} showProgresBar={true} stars={5} total={total} votes={vote[5]}/>
                        <StarsRating showNumberOfVotes={true} showProgresBar={true} stars={4} total={total} votes={vote[4]}/>
                        <StarsRating showNumberOfVotes={true} showProgresBar={true} stars={3} total={total} votes={vote[3]}/>
                        <StarsRating showNumberOfVotes={true} showProgresBar={true} stars={2} total={total} votes={vote[2]}/>
                        <StarsRating showNumberOfVotes={true} showProgresBar={true} stars={1} total={total} votes={vote[1]}/>
                        <StarsRating showNumberOfVotes={true} showProgresBar={true} stars={0} total={total} votes={vote[0]}/>
                    </div>
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