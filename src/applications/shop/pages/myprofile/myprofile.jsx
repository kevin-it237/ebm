import React, { useState } from 'react';
import './myprofile.scss'
import { useHistory } from 'react-router';
import { ReactComponent as Back } from "../../../../assets/icons/back.svg"
import StarsRating from "../../components/stars.rating/stars.rating"
import Reviews from "../../components/reviews/reviews"
import Services from "../../components/services.profile/services.profile"
import Localization from "../../components/localization/localization"
import Works from "../../components/works.profile/works.profile"
import img from "../../../../assets/images/mansory.png";
import {ReactComponent as Uneye} from "../../../../assets/icons/uneye.svg";
import {ReactComponent as Eye} from "../../../../assets/icons/eye.svg";
import Button from "../../../../app/components/buttons/button/button";
import {Link} from "react-router-dom";
import {confirmationPass, verifiedEmail, verifiedPassword, verifiedPhone} from "../../../../config/helpers";

const MyProfile = () => {
    const history = useHistory()
    const [showPassword, setPassword] = useState(false);
    const [content, setContent] = useState("Information");
    const [infoForm, setInfoForm] = useState({name: "", surname: "", email: ""});
    const [infoForm2, setInfoForm2] = useState({password: "", confirmation: ""});
    const [emailError, setEmail] = useState("");
    const [passwordError, setErrorPassword] = useState("");
    const [confirmationError, setConfirmation] = useState("");
    const [phoneError, setPhone] = useState("");


    const MENU_ITEMS = ["Information", "Mot de passe", "Services", "Oeuvres"];

    const changeContent = (contentName) => {
        setContent(contentName);
    }
    // Change form input values.
    const onChange = (e) => {
        setInfoForm({...infoForm, [e.target.name]: e.target.value});
    }

    // Change form input values.
    const onChange2 = (e) => {
        setInfoForm2({...infoForm2, [e.target.name]: e.target.value});
    }

    const onSubmit = () => {

    }

    const onBlur = (e) => {

    }

    let bottomContent;
    if (content === "Information") {
        bottomContent = (<div className={"signup-container"} style={{width:"100%"}}>
            <form onSubmit={onSubmit} className="auth-container">
                {Object.keys(infoForm).map((input, index) => (
                    <div key={index} className="auth-container__input-container">
                        <input
                            name={input}
                            onChange={onChange}
                            onBlur={onBlur}
                            value={infoForm[input]}
                            placeholder={`${input}`}
                            type={(input === 'password' || input === 'confirmation') ? showPassword ? 'text' : 'password' : 'text'}
                            autoComplete={"off"}
                            required
                            className={`auth-container__input ${(input === 'password' || input === 'confirmation') ? 'password' : ''}`}
                        />{<p className="errorMessage">{input === 'password' ? <div>{passwordError}</div> : ""}</p>}
                        {<p className="errorMessage">{input === 'email' ? <div>{emailError}</div> : ""}</p>}
                        {<p className="errorMessage">{input === 'confirmation' ?
                            <div>{confirmationError}</div> : ""}</p>}
                        {input === 'password' ? showPassword ? <Uneye onClick={() => setPassword(!showPassword)}/> :
                            <Eye onClick={() => setPassword(!showPassword)}/> : ''}
                    </div>
                ))}


                <Button
                    variant="primary"
                    type="submit"
                    size="lg">Valider
                </Button>
            </form>


        </div>);
    }else  if (content === "Mot de passe") {
            bottomContent = (<div className={"signup-container"} style={{width:"100%"}}>
                <form onSubmit={onSubmit} className="auth-container">
                    {Object.keys(infoForm2).map((input, index) => (
                        <div key={index} className="auth-container__input-container">
                            <input
                                name={input}
                                onChange={onChange2}
                                onBlur={onBlur}
                                value={infoForm2[input]}
                                placeholder={`${input}`}
                                type={(input === 'password' || input === 'confirmation') ? showPassword ? 'text' : 'password' : 'text'}
                                autoComplete={"off"}
                                required
                                className={`auth-container__input ${(input === 'password' || input === 'confirmation') ? 'password' : ''}`}
                            />{<p className="errorMessage">{input === 'password' ? <div>{passwordError}</div> : ""}</p>}
                            {<p className="errorMessage">{input === 'email' ? <div>{emailError}</div> : ""}</p>}
                            {<p className="errorMessage">{input === 'confirmation' ?
                                <div>{confirmationError}</div> : ""}</p>}
                            {input === 'password' ? showPassword ? <Uneye onClick={() => setPassword(!showPassword)}/> :
                                <Eye onClick={() => setPassword(!showPassword)}/> : ''}
                        </div>
                    ))}
                    <Button
                        variant="primary"
                        type="submit"
                        size="lg">Valider
                    </Button>


                </form>


            </div>);
        } else if (content === "Services") {
            bottomContent = (<Services />);
        } else {
            bottomContent = (<Works/>);
        }

        return (
            <div id="institute">
                <div className="header">
                    <div className="header-title">
                        <Back onClick={() => history.goBack()}/>
                        <h4>Mon Profil</h4>
                    </div>
                </div>

                <div className="institute-content">
                    <div className="owner-infos">
                        <img className="avatar" src={img} alt=""/>
                        <div>
                            <h3 className="name">Tamko K Clarence</h3>
                            <p className="address">Joined 2 days ago</p>
                        </div>
                    </div>
                    <div className="menu">
                        {
                            MENU_ITEMS.map(item => (
                                <h2 key={item} onClick={() => changeContent(item)}
                                    className={`menu-item ${content === item ? "actived" : ""}`}>{item}</h2>
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

export default MyProfile;
