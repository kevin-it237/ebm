import React, { useState } from 'react';
import './institute.scss'
import { useHistory } from 'react-router';
import { ReactComponent as Back } from "../../../../assets/icons/back.svg"
import StarsRating from "../../components/stars.rating/stars.rating"
import Reviews from "../../components/reviews/reviews"
import Services from "../../components/services/services"
import Localization from "../../components/localization/localization"
import Works from "../../components/works/works"
import img from "../../../../assets/images/mansory.png";

const Institute = () => {
    const history = useHistory()
    const [content, setContent] = useState("Revues");

    const MENU_ITEMS = ["Revues", "Services", "Localisation", "Oeuvres"];

    const changeContent = (contentName) => {
        setContent(contentName);
    }

    let bottomContent = (<Reviews />);
    if(content === "Revues") {
        bottomContent = (<Reviews />);
    } else if(content === "Services") {
        bottomContent = (<Services />);
    } else if(content === "Localisation") {
        bottomContent = (<Localization />);
    } else {
        bottomContent = (<Works />);
    }

    return (
        <div id="institute">
            <div className="header">
                <div className="header-title">
                    <Back onClick={() => history.goBack()} />
                    <h4>Himalayas Institute….</h4>
                </div>
            </div>

            <div className="institute-content">
                <div className="owner-infos">
                    <img className="avatar" src={img} alt="" />
                    <div>
                        <h3 className="name">Institute of beauty</h3>
                        <p className="address">Yaoundé, ...</p>
                    </div>
                </div>

                <p className="description">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>

                <div className="stats">
                    <div className="rates">
                        <h2>4.5</h2>
                        <p>29 ratings</p>
                    </div>
                    <div className="stars-group">
                        <StarsRating showNumberOfVotes={true} showProgresBar={true} stars={5} votes={15} />
                        <StarsRating showNumberOfVotes={true} showProgresBar={true} stars={4} votes={5} />
                        <StarsRating showNumberOfVotes={true} showProgresBar={true} stars={3} votes={2} />
                        <StarsRating showNumberOfVotes={true} showProgresBar={true} stars={2} votes={8} />
                        <StarsRating showNumberOfVotes={true} showProgresBar={true} stars={1} votes={3} />
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