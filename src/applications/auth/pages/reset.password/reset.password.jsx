import React, { useState } from 'react';
import {useHistory, useParams} from 'react-router-dom'
import axios from "axios";
import Button from '../../../../app/components/buttons/button/button';
import ebmLogo from "../../../../assets/images/ebm.svg"
import ebmLogoBig from "../../../../assets/images/ebm_big.png"
import './reset.password.scss'
import config from "../../../../config/index";
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import {confirmationPass, getToken, setToken, verifiedEmail, verifiedPassword} from "../../../../config/helpers";
import {ReactComponent as Uneye} from "../../../../assets/icons/uneye.svg";
import {ReactComponent as Eye} from "../../../../assets/icons/eye.svg";


const ResetPassword = () => {
    const history = useHistory();
    const params = useParams();

    const [showPassword, setPassword] = useState(false);
    const [loginForm, setLoginForm] = useState({password: "", confirmation: ""});
    const [passwordError, setErrorPassword] = useState("");
    const [confirmationError, setConfirmation] = useState("");
    const [loading,setLoading]= useState(false);

    const onSubmit = (e) => {
        e.preventDefault();
        const user = {
            password: loginForm.password,
            token: params.slug
        }
        axios.post(config.baseUrl+"/password/reset", {...user}).
        then(response=>{
            console.log(response)
            history.push('/login');
        }).catch(error=>{
            console.log(error);
            notifyFailed("Email incorret")
        }).finally(e=>{
            setLoading(false)
        })
    }

    const notifyFailed = (err)=>{
        toast.error(err)
    }

    // Change form input values.
    const onChange = (e) => setLoginForm({...loginForm,  [e.target.name]: e.target.value })

    const onBlur = (e)=>{
        if (e.target.name === 'password') {
            const password = e.target.value;
            if (!verifiedPassword(password)) {
                setErrorPassword("Doit contenir au moins 6 caractéres")
            }else {
                setErrorPassword("")
            }
        }else if (e.target.name === 'confirmation') {
            const confirmation = e.target.value;
            const password = loginForm.password;
            if (!confirmationPass(password, confirmation)) {
                setConfirmation("Doit correspondre au mot de passe");
            }else {
                setConfirmation("")
            }
        }
    };

    return (
        <div className="login-container">
            <div className="logo-box">
                <img src={ebmLogo} alt="" />
            </div>
            <div className="big-logo__box">
                <img src={ebmLogoBig} alt="" />
            </div>
            <ToastContainer/>
            <form onSubmit={onSubmit} className="auth-container" >
                {Object.keys(loginForm).map((input, index) => (
                    <div key={index} className="auth-container__input-container">
                        <input
                            name={input}
                            onChange={onChange}
                            onBlur={onBlur}
                            value={loginForm[input]}
                            placeholder={`${input}`}
                            type={(input === 'password' || input === 'confirmation' ) ? showPassword ? 'text' : 'password' : 'text'}
                            autoComplete={"off"}
                            required
                            className={`auth-container__input ${(input === 'password' || input === 'confirmation' ) ? 'password' : ''}`}
                        />{<p className="errorMessage">{input === 'password' ? <div>{passwordError}</div> : ""}</p>}
                        {<p className="errorMessage">{input === 'confirmation' ? <div>{confirmationError}</div>: ""}</p>}
                        {input === 'password' ? showPassword ? <Uneye onClick={() => setPassword(!showPassword)} /> : <Eye onClick={() => setPassword(!showPassword)} /> : ''}
                    </div>
                ))}

                <Button
                    variant="primary"
                    type="submit"
                    loading={loading}
                    disabled={loading}
                    size="lg" >Changer Mot de Passe
                </Button>

            </form>
        </div>
    )
}


export default ResetPassword;