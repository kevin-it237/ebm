import React, { useState } from 'react';
import axios from "axios";
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import { useHistory, Link } from 'react-router-dom'
import { ReactComponent as Eye } from '../../../../assets/icons/eye.svg';
import { ReactComponent as Uneye } from '../../../../assets/icons/uneye.svg';
import Button from '../../../../app/components/buttons/button/button';
import ebmLogo from "../../../../assets/images/ebm.svg"
import ebmLogoBig from "../../../../assets/images/ebm_big.png"
import './signup.scss'
import config from "../../../../config/index";
import {confirmationPass, verifiedEmail, verifiedPassword, verifiedPhone} from "../../../../config/helpers";
import {useDispatch} from "react-redux";
import politique from '../../assets/politique/Politique de Confidentialité EBM.pdf'
import {countryTab} from "../../../../config/county";

const SignUp = () => {
    const history = useHistory()
    const dispatch = useDispatch()

    const [showPassword, setPassword] = useState(false);
    const [signupForm1, setForm1] = useState({username: "",firstname: "",lastname: "", email: "", password: "", confirmation: ""});
    const [Form2, setForm2] = useState({address: "", phone: ""});
    const [Form3, setForm3] = useState({institution_name: "", institution_address: "", institution_phone: ""});
    const [role, setRole] = useState("USER");
    const [country, setCountry] = useState("Cameroon");
    const [formStep, setFormStep] = useState(1)
    const [loading, setLoading]= useState(false);
    const [field, setField]= useState(true);
    const [disabled,setDisabled]= useState(false);
    const [emailError, setEmail] = useState("");
    const [passwordError, setErrorPassword] = useState("");
    const [confirmationError, setConfirmation] = useState("");
    const [phoneError, setPhone] = useState("");

    const [action, setAction]=useState(false);

    const onHandleSubmit = (e) => {
        e.preventDefault();
        console.log("hjnddkjlme,z")
        onSubmit(e)
    }

    const onSubmit = (e) => {
        e.preventDefault();
        if (formStep===1){
            setFormStep(2);
            return;
        }else if(formStep === 2 && role === "INSTITUTION"){
            setFormStep(3);
            return;
        }
        
        let user;
        setLoading(true);
        if (role === 'INSTITUTION') {
            user = {
                username: signupForm1.username,
                firstname: signupForm1.firstname,
                lastname: signupForm1.lastname,
                email: signupForm1.email.toLowerCase(),
                password: signupForm1.password,
                password_confirmation: signupForm1.confirmation,
                address: Form2.address,
                phone: Form2.phone,
                roles: role,
                country: country,
                institution_phone: Form3.institution_phone,
                institution_name: Form3.institution_name,
                institution_address: Form3.institution_address
            };
        }else if (role === 'EXPERT') {
            user = {
                username: signupForm1.username,
                firstname: signupForm1.firstname,
                lastname: signupForm1.lastname,
                email: signupForm1.email.toLowerCase(),
                password: signupForm1.password,
                password_confirmation: signupForm1.confirmation,
                address: Form2.address,
                phone: Form2.phone,
                roles: role,
                country: country,
            };
        }else{
            user = {
                username: signupForm1.username,
                firstname: signupForm1.firstname,
                lastname: signupForm1.lastname,
                email: signupForm1.email.toLowerCase(),
                password: signupForm1.password,
                password_confirmation: signupForm1.confirmation,
                address: Form2.address,
                phone: Form2.phone,
                roles: role.toLowerCase(),
                country: country,
            };
        }

        console.log(user)
        const users = Object.values(user);

        users.forEach(function(item){
            if(!item){
                setField(false)
                return;
            }
        })

        if (field){
            axios.post(config.baseUrl+"/register", user)
                .then(res =>{
                    console.log(res)
                    dispatch({
                        type: 'USER_EMAIL',
                        payload: user.email
                    })
                    history.push('/verification/'+user.roles.toLowerCase())
                    setLoading(false)
                })
                .catch(err=>{
                    setLoading(false)
                    console.log(err.response)
                    if (err.response){
                        if (err.response.data.message){
                            const code = err.response.data.message
                            if(code.startsWith('Expected response code 220 but got code')){
                                notifyFailed('Votre addresse mail est incorrecte')
                            }else if (code.startsWith('Connection could not be established with host mail')){
                                notifyFailed('Vérifiez votre connexion')
                            }else {
                                notifyFailed('Vérifiez votre connexion')
                            }
                        }
                        else if (err.response.data.errors){
                            const error = err.response.data.errors;
                            if (error.username){
                                notifyFailed("Nom d'utilisateur déjà utilisé")
                            }else if(error.firstname){
                                notifyFailed(error.firstname[0])
                            }else if(error.lastname){
                                notifyFailed(error.lastname[0])
                            }else if(error.email){
                                notifyFailed("Address mail déjà utilisée")
                            }else if(error.password){
                                notifyFailed(error.password[0])
                            }else if(error.phone){
                                notifyFailed("Numéro de téléphone déjà utilisé")
                            }else if(error.address){
                                notifyFailed(error.address[0])
                            }else if(error.role){
                                notifyFailed(error.role[0])
                            }
                        }else if (!err.response.data || !err){
                            notifyFailed("Verifiez votre connexion");
                        }
                    }else {
                        notifyFailed("Verifiez votre connexion")
                    }
                })
        }else {
            notifyFailed('Remplir tous les champs !')
            setLoading(false)
            console.log('uhjrkfnrfurfijknlfez')
        }
    }

    const notifyFailed = (err)=>{
        toast.error(err)
    }

    // Change form input values.
    const onChange = (e) => {
        setForm1({...signupForm1,  [e.target.name]: e.target.value });
    }

    const onChangeForm = (e) => {
        setForm2({...Form2,  [e.target.name]: e.target.value });
    }

    const onChangeForm3 = (e) => {
        setForm3({...Form3,  [e.target.name]: e.target.value });
    }

    const onChangeRole = (e) => {
        setRole(e.target.value);
    }

    const onChangeCountry = (e) => {
        setCountry(e.target.value);
    }

    const onBlur = (e)=>{
        if (e.target.name === 'email'){
            const email = e.target.value;
            if (!verifiedEmail(email)){
                setDisabled(true)
                setEmail("Doit etre un email valide")
            }else {
                setEmail("")
                setDisabled(false)
            }
        }else if (e.target.name === 'password') {
            const password = e.target.value;
            if (!verifiedPassword(password)) {
                setDisabled(true)
                setErrorPassword("Doit contenir au moins 6 caractéres")
            }else {
                setDisabled(false)
                setErrorPassword("")
            }
        }else if (e.target.name === 'confirmation') {
            const confirmation = e.target.value;
            const password = signupForm1.password;
            if (!confirmationPass(password, confirmation)) {
                setDisabled(true)
                setConfirmation("Doit correspondre au mot de passe");
            }else {
                setDisabled(false)
                setConfirmation("")
            }
        }else if (e.target.name === 'phone' || e.target.name === 'institution_phone'){
            const phone = e.target.value;
            if (verifiedPhone(phone)){
                setDisabled(false)
                setPhone("")
            }else {
                setDisabled(true)
                setPhone("Votre Numéro de Téléphone est incorrect")
            }

        }
    }

    const onAction=(e)=>{
        e.preventDefault();
        const url = 'https://docs.google.com/forms/d/e/1FAIpQLScpvBNHPRi6oYZ3MC6lIMaDXKDIBo4QtZorako33heTS43gBQ/viewform?usp=sf_link';
        setAction(true)
        window.open(url, '_blank')
    }

    return (
        <div className="signup-container">

            <div className={"login-container-overlay _show-on-large"}/>
            <div className="logo-box _show-on-small">
                <img src={ebmLogo} alt="" />
            </div>
            <div className="logo-box _show-on-large">
            </div>
            <div className="big-logo__box">
                <img src={ebmLogoBig} alt="" />
            </div>
            {
                formStep === 1 ? (
                    <form onSubmit={onSubmit} className="auth-container" >
                        {Object.keys(signupForm1).map((input, index) => (
                            <div key={index} className="auth-container__input-container">
                                <input
                                    name={input}
                                    onChange={onChange}
                                    onBlur={onBlur}
                                    value={signupForm1[input]}
                                    placeholder={`${input}`}
                                    type={(input === 'password' || input === 'confirmation' ) ? showPassword ? 'text' : 'password' : 'text'}
                                    autoComplete={"off"}
                                    required
                                    className={`auth-container__input ${(input === 'password' || input === 'confirmation' ) ? 'password' : ''}`}
                                />{<p className="errorMessage">{input === 'password' ? <div>{passwordError}</div> : ""}</p>}
                                {<p className="errorMessage">{input === 'email' ? <div>{emailError}</div>: ""}</p>}
                                {<p className="errorMessage">{input === 'confirmation' ? <div>{confirmationError}</div>: ""}</p>}
                                {input === 'password' ? showPassword ? <Uneye onClick={() => setPassword(!showPassword)} /> : <Eye onClick={() => setPassword(!showPassword)} /> : ''}
                            </div>
                        ))}

                        <div className="circles">
                            <span className="selected"></span>
                            <span onClick={(e)=>{
                                e.preventDefault();
                                if (!disabled){
                                    setFormStep(2);
                                }
                            }}></span>
                        </div>

                        <Button
                            variant="primary"
                            type="submit"
                            disabled={disabled}
                            size="lg">Suivant
                        </Button>

                        <div className="auth-container__line-element">
                            <p className="auth-text">Vous avez déjà un compte ? <Link to="/login">Se Connecter</Link></p>
                        </div>
                        <br/>
                        <div className="auth-container__line-element">
                            <p className="auth-text-1">En appuyant sur S’inscrire, vous acceptez notre<br/> <a href={politique} target="_blank" rel="noopener noreferrer">Politique de confidentialité</a>. Vous recevrez peut-être<br/> des notifications par mail de notre part.</p>
                        </div>
                    </form>
                ): formStep === 2 ?(
                    <div>
                        <form onSubmit={role === "INSTITUTION" ? onSubmit : onHandleSubmit} className="auth-container">
                            {Object.keys(Form2).map((input, index) => (
                                <div key={index} className="auth-container__input-container">
                                    <input
                                        name={input}
                                        onChange={onChangeForm}
                                        onBlur={onBlur}
                                        value={Form2[input]}
                                        placeholder={`${input}`}
                                        autoComplete={"off"}
                                        type="text"
                                        required
                                        className={`auth-container__input`}
                                    />
                                    {<p className="errorMessage">{input === 'phone' ? <div>{phoneError}</div>: ""}</p>}
                                </div>
                            ))}
                            <div className="registation-final__step">
                                <select name="country" onChange={onChangeCountry} required style={{color: 'gray', opacity: '0.8'}}>
                                    <option value="" disabled selected>Choisir votre pays</option>
                                    {countryTab.map(e=>(
                                        <option value={e.name}>{e.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="registation-final__step">
                                <select name="roleSet" onChange={onChangeRole} required style={{color: 'gray', opacity: '0.8'}}>
                                    <option value="" disabled selected>Choisir un Role</option>
                                    <option value="USER">Client</option>
                                    <option value="INSTITUTION">Institution</option>
                                    <option value="EXPERT">Freelance</option>
                                </select>
                            </div>
                            {role === "EXPERT" &&
                                <div className="auth-container__line-element">
                                    <p className="auth-text">
                                        <a
                                            target='_blank'
                                            style={{textDecoration: 'none', fontWeight: 'bold', color: 'red'}}
                                            href={'https://docs.google.com/forms/d/e/1FAIpQLScpvBNHPRi6oYZ3MC6lIMaDXKDIBo4QtZorako33heTS43gBQ/viewform?usp=sf_link'}
                                            type="submit"
                                            onClick={onAction}>Cliquez Ici pour répondre au questionnaire
                                        </a>
                                    </p>
                                </div>}
                            <ToastContainer/>
                            <div className="circles">
                                <span onClick={(e)=>{
                                    e.preventDefault();
                                    if (!disabled){
                                        setFormStep(1);
                                    }
                                }}></span>
                                <span className="selected"></span>
                                {role === "INSTITUTION" && <span onClick={(e)=>{
                                    e.preventDefault();
                                    if (!disabled){
                                        setFormStep(3);
                                    }
                                }}></span>}
                            </div>
                            {role === "EXPERT" && action &&<Button
                                variant="primary"
                                type="submit"
                                onSubmit
                                loading={loading}
                                disabled={disabled}
                                size="lg">{"S’inscrire"}
                            </Button>}
                            {role !== "EXPERT" && <Button
                                variant="primary"
                                type="submit"
                                onSubmit
                                loading={loading}
                                disabled={disabled}
                                size="lg">{role === "INSTITUTION" ? "Information sur l'Institution" : "S’inscrire"}
                            </Button>}

                            <div className="auth-container__line-element">
                                <p className="auth-text">Vous avez déjà un compte ? <Link to="/login">Log In</Link></p>
                            </div>
                            <br/>
                            <div className="auth-container__line-element">
                                <p className="auth-text-1">En appuyant sur S’inscrire, vous acceptez notre<br/> <a href={politique} target="_blank" rel="noopener noreferrer">Politique de confidentialité</a>. Vous recevrez peut-être<br/> des notifications par mail de notre part.</p>
                            </div>
                        </form>
                    </div>
                ) :(
                    <div>
                        <form onSubmit={onHandleSubmit} className="auth-container">
                            {Object.keys(Form3).map((input, index) => (
                                <div key={index} className="auth-container__input-container">
                                    <input
                                        name={input}
                                        onChange={onChangeForm3}
                                        onBlur={onBlur}
                                        value={Form3[input]}
                                        placeholder={`${input !== 'institution_name' ? input : 'ex. Kellawel (à partir de 1000 frs)'}`}
                                        autoComplete={"off"}
                                        type="text"
                                        required
                                        className={`auth-container__input`}
                                    />
                                    {<p className="errorMessage">{input === 'institution_phone' ? <div>{phoneError}</div>: ""}</p>}
                                </div>
                            ))}
                            <div className="auth-container__line-element">
                                <p className="auth-text">
                                    <a
                                        target='_blank'
                                        style={{textDecoration: 'none', fontWeight: 'bold', color: 'red'}}
                                        href={'https://docs.google.com/forms/d/e/1FAIpQLScpvBNHPRi6oYZ3MC6lIMaDXKDIBo4QtZorako33heTS43gBQ/viewform?usp=sf_link'}
                                        type="submit"
                                        onClick={onAction}>Cliquez Ici pour répondre au questionnaire
                                    </a>
                                </p>
                            </div>
                            <ToastContainer/>

                            <div className="circles">
                                <span onClick={(e)=>{
                                    e.preventDefault();
                                    if (!disabled){
                                        setFormStep(1);
                                    }
                                }}></span>
                                {role ==='INSTITUTION' &&<span onClick={(e)=>{
                                    e.preventDefault();
                                    if (!disabled){
                                        setFormStep(2);
                                    }
                                }}></span>
                                }
                                <span className="selected"></span>
                            </div>
                            {action && <Button
                                variant="primary"
                                type="submit"
                                onSubmit
                                loading={loading}
                                disabled={disabled}
                                size="lg">{"S'inscrire"}
                            </Button>}

                            <div className="auth-container__line-element">
                                <p className="auth-text">Vous avez déjà un compte ? <Link to="/login">Log In</Link> </p>
                            </div>

                            <br/>
                            <div className="auth-container__line-element">
                                <p className="auth-text-1">En appuyant sur S’inscrire, vous acceptez notre<br/> <a href={politique} target="_blank" rel="noopener noreferrer">Politique de confidentialité</a>. Vous recevrez peut-être<br/> des notifications par mail de notre part.</p>
                            </div>
                        </form>
                    </div>
                )
            }
        </div>
    )
}


export default SignUp;
