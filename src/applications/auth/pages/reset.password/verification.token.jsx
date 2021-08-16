import React, { useState } from 'react';
import axios from "axios";
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import {Link, useHistory, useParams} from 'react-router-dom'
import Button from '../../../../app/components/buttons/button/button';
import ebmLogo from "../../../../assets/images/ebm.svg"
import ebmLogoBig from "../../../../assets/images/ebm_big.png"
import './verification.email.scss'
import config from "../../../../config/index";

const VerificationToken = () => {
    const history = useHistory();
    const params = useParams();

    const [token, setToken] = useState("");
    const [loading,setLoading]= useState(false);


    const onSubmit = (e) => {
        e.preventDefault();
        setLoading(true)
        axios.post(config.baseUrl+"/password/verification", {token: token})
            .then(res =>{
                history.push('/reset-password/'+token)
                setLoading(false)
            })
            .catch(err=>{
                console.log(err.response.data)
                if (err.response.data){
                    const error = err.response.data.errors;
                    if (error){
                        notifyFailed("Code Incorrect")
                    }
                }else if (!err.response.data || !err){
                    notifyFailed("Verifiez votre connexion internet");
                }
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
                    <ToastContainer/>
                    <Button
                        variant="primary"
                        type="submit"
                        onSubmit
                        loading={loading}
                        disabled={loading}
                        size="lg">Confirmation
                    </Button>
                </form>
            </div>
        </div>
    )
}


export default VerificationToken;