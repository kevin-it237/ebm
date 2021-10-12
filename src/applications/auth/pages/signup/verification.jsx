import React, {useEffect, useState} from 'react';
import axios from "axios";
import { ToastContainer, toast } from 'material-react-toastify';
import 'material-react-toastify/dist/ReactToastify.css';
import {Link, useHistory, useParams} from 'react-router-dom'
import Button from '../../../../app/components/buttons/button/button';
import ebmLogo from "../../../../assets/images/ebm.svg"
import ebmLogoBig from "../../../../assets/images/ebm_big.png"
import './signup.scss'
import config from "../../../../config/index";

const Verification = () => {
    const history = useHistory();
    const params = useParams();

    const role = params.slug;

    const [signupForm1, setForm1] = useState({verCode: ""});
    const [loading,setLoading]= useState(false);

    useEffect(()=>{
        notify("Un code vous a été envoyé par Email");
    }, []);

    const onSubmit = (e) => {
        e.preventDefault();
        const user = {
            verCode : signupForm1.verCode
        }
        setLoading(true)
        axios.post(config.baseUrl+"/verification", {...user})
            .then(res =>{
                if (res.data.message === 'Ce code est incorrect'){
                    notifyError("Ce code de vérification est incorrect");
                }else {
                    if (role.toLowerCase() === 'expert'){
                        history.push('/questions/'+role.toLocaleString())
                    }else history.push('/login')
                }
                setLoading(false)
            })
            .catch(err=>{
                if (err.response.data){
                    const error = err.response.data.errors;
                    console.log(error)
                    if (error.verCode){
                        notifyError(error.verCode[0])
                    }
                }else if (!err.response.data || !err){
                    notifyError("Verifiez votre connexion internet");
                }
                setLoading(false)
            })
    }
    const notify = (err) => toast.info(err);
    const notifyError = (err) => toast.error(err);



    // Change form input values.
    const onChange = (e) => {
        setForm1({...signupForm1,  [e.target.name]: e.target.value });
    }

    return (
        <div className="signup-container">
            <div className={"login-container-overlay _show-on-large"}/>
            <ToastContainer position="top-center"/>
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
