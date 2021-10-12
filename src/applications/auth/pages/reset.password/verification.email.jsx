import React, { useState } from 'react';
import { useHistory } from 'react-router-dom'
import axios from "axios";
import Button from '../../../../app/components/buttons/button/button';
import ebmLogo from "../../../../assets/images/ebm.svg"
import ebmLogoBig from "../../../../assets/images/ebm_big.png"
import './verification.email.scss'
import config from "../../../../config/index";
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import { verifiedEmail} from "../../../../config/helpers";


const VerificationEmail = () => {
    const history = useHistory();

    const [loginForm, setLoginForm] = useState({email: ""});
    const [emailError, setEmail] = useState("");
    const [loading,setLoading]= useState(false);

    const onSubmit = (e) => {
        e.preventDefault();
        setLoading(true)
        const user = {
            email: loginForm.email
        }
        axios.post(config.baseUrl+"/password/forgot", {...user})
        .then(response=>{
            
            history.push('/verification-token');
            setLoading(false)
        }).catch(error=>{
            notifyFailed("Email incorrect")
            setLoading(false)
        })
    }

    const notifyFailed = (err)=>{
        toast.error(err)
    }

    // Change form input values.
    const onChange = (e) => setLoginForm({...loginForm,  [e.target.name]: e.target.value })

    const onBlur = (e)=>{
        if (e.target.name === 'email'){
            const email = e.target.value;
            if (!verifiedEmail(email)){
                setEmail("Doit etre un email valide")
            }else if (verifiedEmail(email)){
                setEmail("")
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
                            type={'email'}
                            autoComplete={"off"}
                            required
                            className={`auth-container__input`}
                        />{<p className="errorMessage">{input === 'email' ? <div>{emailError}</div>: ""}</p>}
                    </div>
                ))}

                <Button
                    variant="primary"
                    type="submit"
                    loading={loading}
                    disabled={loading}
                    size="lg" >Code de Vérification
                </Button>

            </form>
        </div>
    )
}


export default VerificationEmail;