import React, {useCallback, useEffect, useState} from 'react';
import './myprofile.scss'
import { useHistory } from 'react-router';
import { ReactComponent as Back } from "../../../../assets/icons/back.svg"
import Services from "../../components/services.profile/services.profile"
import Works from "../../components/works/works"
import img from "../../../../assets/images/mansory.png";
import {ReactComponent as Uneye} from "../../../../assets/icons/uneye.svg";
import {ReactComponent as Eye} from "../../../../assets/icons/eye.svg";
import Button from "../../../../app/components/buttons/button/button";
import config from "../../../../config/index";
import axios from "axios";

const MyProfile = () => {
    const history = useHistory()

    const [showPassword, setPassword] = useState(false);
    const [content, setContent] = useState("Information");
    const [infoForm, setInfoForm] = useState({name: "", surname: "", email: "", address: "", phone: ""});
    const [infoUser, setInfoUser] = useState([]);
    const [infoInstitut, setInfoInstitut] = useState([]);
    const [infoForm2, setInfoForm2] = useState({password: "", confirmation: ""});
    const [emailError, setEmail] = useState("");
    const [passwordError, setErrorPassword] = useState("");
    const [confirmationError, setConfirmation] = useState("");

    useEffect(()=>{
        axios.get(config.baseUrl+'/user/show')
            .then(response=>{
                setInfoUser(response.data.message)
                if (response.data.message.role === 'INSTITUTION'){
                    axios.get(config.baseUrl+'/institution/info')
                        .then(response=>{
                            setInfoForm({
                                name: infoUser.firstname,
                                surname: infoUser.lastname,
                                email: response.data.message.email,
                                address: response.data.message.address,
                                phone: response.data.message.phone
                            })
                        })
                        .catch(error=>{
                            console.log(error)
                        })
                }else {
                    setInfoForm({
                        name: response.data.message.firstname,
                        surname: response.data.message.lastname,
                        email: response.data.message.email,
                        address: response.data.message.address,
                        phone: response.data.message.phone
                    })
                }
            })
            .catch(error=>{
                console.log(error)
            })
    }, []);

    const editProfile=(event)=>{
        event.preventDefault();
        const user = {
            firstname: infoForm.name,
            lastname: infoForm.surname,
            email: infoForm.email,
            address: infoForm.address,
            phone: infoForm.phone
        }
        axios.put(config.baseUrl+'/user/update', {...user})
            .then(response=>{
                console.log(response)
            })
            .catch(error=>{
                console.log(error)
            })
    }

    const editProfilePassword=(event)=>{
        event.preventDefault();
        const user = {
            password: infoForm2.password,
            confirmation: infoForm2.confirmation
        }
        axios.put(config.baseUrl+'/user/password/edit', {...user})
            .then(response=>{
                console.log(response)
            })
            .catch(error=>{
                console.log(error)
            })
    }

    const MENU_ITEMS_USER = ["Information", "Mot de passe"];
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
                            type={'text'}
                            autoComplete={"off"}
                            required
                            className={`auth-container__input`}
                        />
                        {<p className="errorMessage">{input === 'email' ? <div>{emailError}</div> : ""}</p>}

                    </div>
                ))}

                <Button onClick={editProfile}
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
                        onClick={editProfilePassword}
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
                        <h4>{infoUser.firstname} {infoUser.lastname}</h4>
                    </div>
                </div>

                <div className="institute-content">
                    <div className="owner-infos">
                        <img className="avatar" src={img} alt=""/>
                        <div>
                            <h3 className="name">{infoUser.firstname} {infoUser.lastname}</h3>
                            <p className="address">Joined 2 days ago</p>
                        </div>
                    </div>
                    {infoUser.role === 'user' ?
                        <div className="menu">
                            {
                                MENU_ITEMS_USER.map(item => (
                                    <h2 key={item} onClick={() => changeContent(item)}
                                        className={`menu-item ${content === item ? "actived" : ""}`}>{item}</h2>
                                ))
                            }
                        </div>
                    :   <div className="menu">
                            {
                                MENU_ITEMS.map(item => (
                                    <h2 key={item} onClick={() => changeContent(item)}
                                        className={`menu-item ${content === item ? "actived" : ""}`}>{item}</h2>
                                ))
                            }
                        </div>
                    }
                    <div className="bottom-content">
                        {bottomContent}
                    </div>
                </div>
            </div>
        )

}

export default MyProfile;
