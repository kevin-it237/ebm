import React, { useState } from 'react';
import axios from "axios";
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import { useHistory } from 'react-router-dom'
import Button from '../../../../app/components/buttons/button/button';
import ebmLogo from "../../../../assets/images/ebm.svg"
import ebmLogoBig from "../../../../assets/images/ebm_big.png"
import './signup.scss'
import config from "../../../../config/index";

const Verification = () => {
    const history = useHistory()

    const [signupForm1, setForm1] = useState({verCode: ""});
    const [loading,setLoading]= useState(false);

    const onSubmit = (e) => {
        e.preventDefault();
        const user = {
            verCode : signupForm1.verCode
        }
        console.log("le role "+user.verCode)
        setLoading(true)
        axios.post(config.baseUrl+"/verification", {...user})
            .then(res =>{
                history.push('/login')
            })
            .catch(err=>{
                console.log("err "+err.response.data)
                if (err.response.data){
                    const error = err.response.data.errors;
                    if (error.verCode){
                        notifyFailed(error.verCode[0])
                    }
                }else if (!err.response.data || !err){
                    notifyFailed("Verifiez votre connexion internet");
                }
            }).finally(e=>{
            setLoading(false)
        })
    }

    const notifyFailed = (err)=>{
        toast.error(err)
    }

    // Change form input values.
    const onChange = (e) => {
        console.log("le nom "+e.target.name)
        setForm1({...signupForm1,  [e.target.name]: e.target.value });
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
                    {Object.keys(signupForm1).map((input, index) => (
                        <div key={index} className="auth-container__input-container">
                            <input
                                name={input}
                                onChange={onChange}
                                value={signupForm1[input]}
                                placeholder={`Code de verification`}
                                type={'text'}
                                autoComplete={"off"}
                                required
                                className="auth-container__input"
                                />
                            </div>
                        ))}
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


export default Verification;