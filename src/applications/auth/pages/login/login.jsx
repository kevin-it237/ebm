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


const Login = () => {
    const history = useHistory();

    const [showPassword, setPassword] = useState(false);
    const [loginForm, setLoginForm] = useState({email: "", password: ""});
    const [role, setRole] = useState({role: "USER"});
    const [emailError, setEmail] = useState("");
    const [passwordError, setErrorPassword] = useState("");
    const [loading,setLoading]= useState(false);

    const onSubmit = (e) => {
        e.preventDefault();
        const user = {
            email: loginForm.email,
            password: loginForm.password,
            role: role.role
        }

        console.log(user)
        axios.post(config.baseUrl+"/login", {...user}).
        then(response=>{
            if(response.data.message === "Votre compte est en cours de vérification"){
                notifyInfo("Votre compte est en cours de vérification")
            }else {
                console.log(response.data.acces_token)
                const token = `Bearer ${response.data.acces_token}`;
                setToken(token);
                response.headers.Authorization = `Bearer ${JSON.stringify(response.data.acces_token)}`;
                history.push('/home');
            }
        }).catch(error=>{
            console.log(error.message);
            notify(error.message)
        }).finally(e=>{
            setLoading(false)
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
                        <option value="" disabled selected>Choisir un Role</option>
                        <option value="USER">Normal</option>
                        <option value="INSTITUTION">Institution</option>
                        <option value="EXPERT">Expert</option>
                    </select>
                </div>

                <div className="forgot-password__box">
                    <Link to="/verification-email">Mot de Passe Oublié ?</Link>
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