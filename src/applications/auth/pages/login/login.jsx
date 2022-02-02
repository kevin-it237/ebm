import React, { useState } from 'react';
import { useHistory } from 'react-router-dom'
import axios from "axios";
import { Link } from 'react-router-dom'
import { ReactComponent as Eye } from '../../../../assets/icons/eye.svg';
import { ReactComponent as Uneye } from '../../../../assets/icons/uneye.svg';
import Button from '../../../../app/components/buttons/button/button';
import ebmLogo from "../../../../assets/images/ebm.svg"
import ebmLogoBig from "../../../../assets/images/ebm_big.png"
import './login.scss'
import config from "../../../../config/index";
import { ToastContainer, toast } from 'material-react-toastify';
import 'material-react-toastify/dist/ReactToastify.css';
import {
    getToken,
    setToken,
    verifiedEmail,
    verifiedPassword,
    setUser,
    getUser
} from "../../../../config/helpers";
import {useDispatch} from "react-redux";



const Login = () => {
    const history = useHistory();

    const dispatch = useDispatch();

    const [showPassword, setPassword] = useState(false);
    const [loginForm, setLoginForm] = useState({email: "", password: ""});
    const [role, setRole] = useState({role: "USER"});
    const [emailError, setEmail] = useState("");
    const [passwordError, setErrorPassword] = useState("");
    const [loading,setLoading]= useState(false);
    const [disabled,setDisabled]= useState(false);

    const onSubmit = (e) => {
        e.preventDefault();
        setLoading(true)
        setDisabled(true)
        const user = {
            email: loginForm.email,
            password: loginForm.password,
            roles: role.role
        }
//justlogmein
        axios.post(config.baseUrl+"/justlogmein", {...user})
            .then(response=>{
                setLoading(false)
                setDisabled(false)
                const code = response.data.message
                console.log(code)
                if(response.data.message === "Votre compte est en cours de vérification"){
                    notifyInfo("Votre compte est en cours de vérification")
                }else if (response.data.message === "Verifiez votre compte"){
                    history.push('/verification/'+user.roles.toLowerCase())
                }else if (code === "Votre compte n'est pas vérifié"){
                    notify("Votre addresse mail n'est pas vérifié")
                    history.push('/verification/'+user.roles.toLowerCase())
                }
                else {
                    const token = `Bearer ${response.data.acces_token}`;
                    setToken(token);
                    window.axios = axios;
                    axios.defaults.headers['Authorization'] = window.token;
                    getUser()
                    getFavorites()
                    getCart()
                    history.push('/home');
                }
            }).catch(error=>{
                setLoading(false)
                setDisabled(false)
                console.log(error)
                if (error.response) {
                    // Request made and server responded
                    console.log(error.response.data);
                    
                    console.log(error.response.data.message);
                    if(error.response.data.errors.startsWith("Votre mail n'a pas été vérifié")){
                        notify("Votre mail n'a pas été vérifié !")
                    }
                    else if(error.response.data.message.startsWith("Attempt to read property \"email_verified_at\" on null")){
                        notify("Email ou Mot de passe Incorrect !")
                    }else if (error.response.data.message.startsWith("Mot de passe ne correspond pas")){
                        notify("Mot passe ou Role incorrect !")
                    }
                    console.log(error.response.status);
                    console.log(error.response.headers);
                } else if (error.request) {
                    // The request was made but no response was received
                    console.log(error.request);
                    notify("Erreur de connexion !")

                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log('Error', error.message);
                }
            })
    }



    const getUser = () => {
        axios.get(config.baseUrl + '/user/show')
            .then(res=>{
                dispatch({
                    type: 'USER_INFO',
                    payload: res.data.message
                })
                setUser(res.data.message)
            })
            .catch(err=>{
                console.log(err)
            })
    }

    const getFavorites = () => {
        axios.get(config.baseUrl + '/user/favorites/product')
            .then(response => {
                dispatch({
                        type: 'ADD_TO_FAVORITE',
                        payload: response.data.message.length,
                        loader: false
                    }
                );
            }).catch(err => {
            notify(err)
        })
    }

    const getCart = () => {
        axios.get(config.baseUrl + '/user/cart/number')
            .then(response => {
                dispatch({
                        type: 'ADD_TO_CART',
                        payload: response.data.message,
                    }
                );
            }).catch(err => {
            notify(err)
        })
    }

    const notify = (err) => toast.error(err);
    const notifyInfo = (err) => toast.info(err);

    // Change form input values.
    const onChange = (e) => setLoginForm({...loginForm,  [e.target.name]: e.target.value })

    const onChangeRole = (e) => setRole({...role,  role: e.target.value })

    const onBlur = (e)=>{
        if (e.target.name === 'email'){
            const email = e.target.value;
            if (!verifiedEmail(email)){
                setDisabled(true)
                setEmail("Doit etre un email valide")
            }else if (verifiedEmail(email)){
                setDisabled(false)
                setEmail("")
            }
        }else if (e.target.name === 'password') {
            const password = e.target.value;
            if (!verifiedPassword(password)) {
                setDisabled(true)
                setErrorPassword("Doit contenir au moins 6 caractéres")
            }else if (verifiedPassword(password)){
                setDisabled(false)
                setErrorPassword("")
            }
        }
    };

    return (
        <div className="login-container">
            <div className={"login-container-overlay _show-on-large"}/>
            <ToastContainer position="top-center" autoClose="5000" pauseOnHover/>
            <div className="logo-box _show-on-small">
                <img src={ebmLogo} alt="" />
            </div>
            <div className="logo-box _show-on-large">

            </div>
            <div className="big-logo__box">
                <img src={ebmLogoBig} alt="" />
            </div>
            <form onSubmit={onSubmit} className="auth-container" >
                {Object.keys(loginForm).map((input, index) => (
                    <div key={index} className="auth-container__input-container">
                        <input
                            name={input}
                            onChange={onChange}
                            onBlur={onBlur}
                            value={loginForm[input]}
                            placeholder={`${input}`}
                            type={input === 'password' ? showPassword ? 'text' : 'password' : 'email'}
                            autoComplete={"off"}
                            required
                            className={`auth-container__input ${input === 'password' ? 'password' : ''}`}
                        />{<p className="errorMessage">{input === 'email' ? <div style={{color: '#e80011'}}>{emailError}</div>: ""}</p>}
                        {<p className="errorMessage">{input === 'password' ? <div style={{color: '#e80011'}}>{passwordError}</div>: ""}</p>}
                        {input === 'password' ? showPassword ? <Uneye onClick={() => setPassword(!showPassword)} /> : <Eye onClick={() => setPassword(!showPassword)} /> : ''}
                    </div>
                ))}
                <div className="registation-final__step">
                    <select name="roleSet" onChange={onChangeRole} required style={{color: 'gray', opacity: '0.8'}}>
                        <option value="" disabled selected>Quelle est votre role ?</option>
                        <option value="USER">Client</option>
                        <option value="INSTITUTION">Institution</option>
                        <option value="EXPERT">Expert</option>
                    </select>
                </div>

                <div className="forgot-password__box">
                    <Link to="/verification-email" style={{color: '#e80011'}}>Mot de Passe Oublié ?</Link>
                </div>

                <Button
                    variant="primary"
                    type="submit"
                    loading={loading}
                    disabled={disabled}
                    size="lg" >Se Connecter
                </Button>

                <div className="auth-container__line-element">
                    <p className="auth-text">Vous n'avez pas de compte ? <Link to="/signup">Créer votre compte</Link></p>
                </div>

            </form>
        </div>
    )
}


export default Login;
