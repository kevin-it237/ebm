import React, { useState } from 'react';
import axios from "axios";
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import {useHistory, useParams} from 'react-router-dom'
import Button from '../../../../app/components/buttons/button/button';
import ebmLogo from "../../../../assets/images/ebm.svg"
import ebmLogoBig from "../../../../assets/images/ebm_big.png"
import './verification.email.scss'
import config from "../../../../config/index";
import {useSelector} from "react-redux";

const VerificationToken = () => {
    const history = useHistory();
    const email = useSelector(state=>state.user.payload)
    console.log(email)

    const back=(e)=>{
        e.preventDefault()
        history.push('/login')
    }

    const [token, setToken] = useState("");
    const [loading,setLoading]= useState(false);
    const [messageError,setMessageError]= useState(null);
    const [message,setMessage]= useState('Un code de verification vous a été envoyé par mail');


    const onSubmit = (e) => {
        e.preventDefault();
        setLoading(true)
        axios.post(config.baseUrl+"/password/verification", {token: token})
            .then(res =>{
                setLoading(false)
                if (res.data.message === "code incorrect"){
                    setMessageError("Code de verification incorrect")
                }else {
                    history.push('/reset-password/'+token)
                }
            })
            .catch(err=>{
                setLoading(false)
                console.log(err.response.data)
                /*const code = err.response.data.message
                if (code.startsWith('SQLSTATE[HY000] [2002]')){
                    setMessageError("Vérifiez votre connexion internet")
                }else if(code.errorInfo[0] === "HY000"){
                    setMessageError("Vérifiez votre connexion internet")
                }

                 */
            })
    }

    const resendCode = (e) => {
        e.preventDefault();
        setMessage(null)
        const user = {
            email : email
        }
        setLoading(true)
        axios.post(config.baseUrl+"/resend/forgot", {...user})
            .then(res =>{
                console.log(res.data.message)
                setLoading(false)
                setMessage('Un code de verification vous a été renvoyé par mail')
            })
            .catch(err=>{
                console.log(err)
                setLoading(false)
            })
    }

    const notifyFailed = (err)=>{
        toast.error(err)
    }

    // Change form input values.
    const onChange = (e) => {
        setToken(e.target.value);
    }

    return (
        <div className="signup-container">
            <div className="logo-box">
                <img src={ebmLogo} alt="" />
            </div>
            <div className="big-logo__box">
                <img src={ebmLogoBig} alt="" />
            </div>
            <div>
                <form onSubmit={onSubmit} className="auth-container" >
                    <div className="auth-container__input-container">
                        <input
                            name="token"
                            onChange={onChange}
                            value={token}
                            placeholder={`Code de verification`}
                            type={'text'}
                            autoComplete={"off"}
                            required
                            className="auth-container__input"
                        />
                    </div>
                    <div className="errorMessage">{messageError}</div>
                    <Button
                        variant="primary"
                        type="submit"
                        onSubmit
                        loading={loading}
                        disabled={loading}
                        size="lg">Confirmation
                    </Button>
                    {message&&<div className="code" style={{color: 'white'}}>{message}</div>}
                    <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10}}>
                        <div style={{fontSize: 13, marginTop: 10, color: 'white', fontWeight: "bold", cursor: "pointer"}} onClick={back}>Revenir au Login</div>
                        <div className="resend-code" style={{fontSize: 12}} onClick={resendCode}>Vous n'avez pas reçu le code ?</div>
                    </div>
                </form>
            </div>
        </div>
    )
}


export default VerificationToken;