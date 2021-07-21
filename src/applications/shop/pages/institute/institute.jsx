import React from 'react';
import './institute.scss'
import Back from "../../../../assets/icons/arrow_left.svg"
import { ReactComponent as Star } from "../../../../assets/icons/star.svg"
import user from "../../../../assets/images/user.png"
import InputText from '../../../../app/components/inputs/input.search/input.search';

const Institute = () => {

    return (
        <div id="institute">
            <div className="header">
                <div>
                    <img src={Back} alt="" />
                    <h4>Himalayas Institute….</h4>
                </div>
            </div>
            <div className="owner-infos">
                <img src={user} alt="" />
                <div>
                    <h3 className="name">Institute of beauty</h3>
                    <p className="address">Yaoundé, ...</p>
                </div>
            </div>

            <p className="description">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum
            </p>

            <div className="stats">
                <div className="rates">
                    <h2>4.5</h2>
                    <p>29 ratings</p>
                </div>
                <div className="stars">
                    <div className="star_line">
                        <div className="stars">
                            <Star />
                            <Star />
                            <Star />
                            <Star />
                            <Star />
                        </div>
                        <div className="line"></div>
                        <div className="number">9</div>
                    </div>
                </div>
            </div>

            <div className="menu">
                <h2 className="menu-item">Revues</h2>
                <h2 className="menu-item">Services</h2>
                <h2 className="menu-item">Localisation</h2>
                <h2 className="menu-item">Oeuvres</h2>
            </div>
        </div>
    )
}

export default Institute;