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
import {setToken, verifiedEmail, verifiedPassword} from "../../../../config/helpers";
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

    const onSubmit = (e) => {
        e.preventDefault();
        setLoading(true)
        const user = {
            email: loginForm.email,
            password: loginForm.password,
            roles: role.role
        }

        axios.post(config.baseUrl+"/login", {...user})
        .then(response=>{
            if(response.data.message === "Votre compte est en cours de vérification"){
                notifyInfo("Votre compte est en cours de vérification")
            }else if (response.data.message === "Verifiez votre compte"){
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
            setLoading(false)
        }).catch(error=>{
            console.log(error.message)
            if (error.message){
                notify("Email, Mot de passe ou Role Incorrect")
            }else if (!error.message){
                notify("Erreur de connexion")
            }
            setLoading(false)
        })
    }

    const getUser = () => {
        axios.get(config.baseUrl + '/user/show')
            .then(res=>{
                dispatch({
                    type: 'USER_INFO',
                    payload: res.data.message
                })
            })
            .catch(err=>{
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
                setEmail("Doit etre un email valide")
            }else if (verifiedEmail(email)){
                setEmail("")
            }
        }else if (e.target.name === 'password') {
            const password = e.target.value;
            if (!verifiedPassword(password)) {
                setErrorPassword("Doit contenir au moins 6 caractéres")
            }else if (verifiedPassword(password)){
                setErrorPassword("")
            }
        }
    };

    return (
        <div className="login-container">
            <ToastContainer position="top-center" autoClose="5000" pauseOnHover/>
            <div className="logo-box">
                <img src={ebmLogo} alt="" />
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
                        />{<p className="errorMessage">{input === 'email' ? <div>{emailError}</div>: ""}</p>}
                        {<p className="errorMessage">{input === 'password' ? <div>{passwordError}</div>: ""}</p>}
                        {input === 'password' ? showPassword ? <Uneye onClick={() => setPassword(!showPassword)} /> : <Eye onClick={() => setPassword(!showPassword)} /> : ''}
                    </div>
                ))}
                <div className="registation-final__step">
                    <select name="roleSet" onChange={onChangeRole} required style={{color: 'gray', opacity: '0.8'}}>
                        <option value="" disabled selected>Quelle est votre role ?</option>
                        <option value="USER">Normal</option>
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
                    disabled={loading}
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