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

const SignUp = () => {
    const history = useHistory()

    const [showPassword, setPassword] = useState(false);
    const [signupForm1, setForm1] = useState({username: "",firstname: "",lastname: "", email: "", password: "", confirmation: ""});
    const [Form2, setForm2] = useState({address: "", phone: ""});
    const [Form3, setForm3] = useState({institution_address: "", institution_phone: ""});
    const [description, setDescription] = useState({description: ""});
    const [role, setRole] = useState("USER");
    const [formStep, setFormStep] = useState(1)
    const [loading,setLoading]= useState(false);
    const [disabled,setDisabled]= useState(false);
    const [emailError, setEmail] = useState("");
    const [passwordError, setErrorPassword] = useState("");
    const [confirmationError, setConfirmation] = useState("");
    const [phoneError, setPhone] = useState("");

    const onHandleSubmit = (e) => {
        e.preventDefault();
        onSubmit(e)
    }

    const onSubmit = (e) => {
        e.preventDefault();
        if (formStep===1){
            setFormStep(2);
            return;
        }else if(formStep === 2 && role.role === "INSTITUTION"){
            setFormStep(3);
            return;
        }

        let user;
        if (role.role === 'INSTITUTION') {
            user = {
                username: signupForm1.username,
                firstname: signupForm1.firstname,
                lastname: signupForm1.lastname,
                email: signupForm1.email.toLowerCase(),
                password: signupForm1.password,
                password_confirmation: signupForm1.confirmation,
                address: Form2.address,
                phone: Form2.phone,
                roles: role.role,
                institution_phone: Form3.institution_phone,
                institution_address: Form3.institution_address,
                description: description.description
            };
        }else if (role.role === 'EXPERT') {
            user = {
                username: signupForm1.username,
                firstname: signupForm1.firstname,
                lastname: signupForm1.lastname,
                email: signupForm1.email.toLowerCase(),
                password: signupForm1.password,
                password_confirmation: signupForm1.confirmation,
                address: Form2.address,
                phone: Form2.phone,
                roles: role.role,
                description: description.description
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
                roles: role.role.toLowerCase(),
            };
        }

        console.log(user)
        setLoading(true)
        axios.post(config.baseUrl+"/register", user)
            .then(res =>{
                history.push('/verification/'+user.roles.toLowerCase())
                setLoading(false)
            })
            .catch(err=>{
                setLoading(false)
                if (err.response){
                    if (err.response.data.message){
                        const code = err.response.data.message
                        if(code.startsWith('Expected response code 220 but got code')){
                            notifyFailed('Votre addresse mail est incorrecte')
                        }else if (code.startsWith('Connection could not be established with host mail')){
                            notifyFailed('Vérifiez votre connexion internet')
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
                        notifyFailed("Verifiez votre connexion internet");
                    }
                }else {
                    notifyFailed('Remplissez tous les champs')
                }
            })
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

    const onChangeDescription = (e) => {
        setDescription({...description,  [e.target.name]: e.target.value });
    }

    const onChangeRole = (e) => {
        setRole({...role, role: e.target.value });
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
            console.log(verifiedPhone(phone))
            if (verifiedPhone(phone)){
                setDisabled(false)
                setPhone("")
            }else {
                setDisabled(true)
                setPhone("Vérifier votre numero de téléphone")
            }

        }
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
                            <p className="auth-text">Vous avez déjà un compte ? <Link to="/login">Log In</Link></p>
                        </div>
                    </form>
                ): formStep === 2 ?(
                    <div>
                        <form onSubmit={role.role === "INSTITUTION" ? onSubmit : onHandleSubmit} className="auth-container">
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
                                <select name="roleSet" onChange={onChangeRole} required style={{color: 'gray', opacity: '0.8'}}>
                                    <option value="" disabled selected>Choisir un Role</option>
                                    <option value="USER">Normal</option>
                                    <option value="INSTITUTION">Institution</option>
                                    <option value="EXPERT">Expert</option>
                                </select>
                            </div>
                            {role.role === "EXPERT" ?
                                <div className="auth-container__input-container">
                                    <textarea placeholder='Votre Description ...' name="description" rows="7"
                                        onChange={onChangeDescription} autoComplete={"off"} required style={{color: 'gray', opacity: '0.8'}}
                                        className={`auth-container__input`} style={{fontSize: "medium", opacity: 0.8, padding: 12, border: "none"}}

                                    />
                                </div>
                                : ""}
                            <ToastContainer/>
                            <div className="circles">
                                <span onClick={(e)=>{
                                    e.preventDefault();
                                    if (!disabled){
                                        setFormStep(1);
                                    }
                                }}></span>
                                <span className="selected"></span>
                            </div>
                            <Button
                                variant="primary"
                                type="submit"
                                onSubmit
                                loading={loading}
                                disabled={disabled}
                                size="lg">{role.role === "INSTITUTION" ? "Information sur l'Institution": "Completez l'Inscription"}
                            </Button>

                            <div className="auth-container__line-element">
                                <p className="auth-text">Vous avez déjà un compte ? <Link to="/login">Log In</Link></p>
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
                                        placeholder={`${input}`}
                                        autoComplete={"off"}
                                        type="text"
                                        required
                                        className={`auth-container__input`}
                                    />
                                    {<p className="errorMessage">{input === 'institution_phone' ? <div>{phoneError}</div>: ""}</p>}
                                </div>
                            ))}
                            <div className="auth-container__input-container">
                                <textarea placeholder='Entrez la Description...' name="description" rows="7"
                                    onChange={onChangeDescription} autoComplete={"off"} required
                                    className={`auth-container__input`} style={{fontSize: "medium", opacity: 0.8, padding: 12, border: "none"}}

                                />
                            </div>
                            <ToastContainer/>

                            <div className="circles">
                                <span onClick={(e)=>{
                                    e.preventDefault();
                                    if (!disabled){
                                        setFormStep(1);
                                    }
                                }}></span>
                                {role.role==='INSTITUTION' ? <span onClick={(e)=>{
                                    e.preventDefault();
                                    if (!disabled){
                                        setFormStep(2);
                                    }
                                }}></span> : ""}
                                <span className="selected"></span>
                            </div>
                            <Button
                                variant="primary"
                                type="submit"
                                onSubmit
                                loading={loading}
                                disabled={disabled}
                                size="lg">{"Completez l'Inscription"}
                            </Button>

                            <div className="auth-container__line-element">
                                <p className="auth-text">Vous avez déjà un compte ? <Link to="/login">Log In</Link></p>
                            </div>
                        </form>
                    </div>
                )
            }
        </div>
    )
}


export default SignUp;
