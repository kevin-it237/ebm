import React, { useState, useEffect } from 'react';
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
                email: signupForm1.email,
                password: signupForm1.password,
                password_confirmation: signupForm1.confirmation,
                address: Form2.address,
                phone: Form2.phone,
                role: role.role, 
                institution_phone: Form3.institution_phone,
                institution_address: Form3.institution_address,
                description: description.description
            };
        }else if (role.role === 'EXPERT') {
            user = {
                username: signupForm1.username,
                firstname: signupForm1.firstname,
                lastname: signupForm1.lastname,
                email: signupForm1.email,
                password: signupForm1.password,
                password_confirmation: signupForm1.confirmation,
                address: Form2.address,
                phone: Form2.phone,
                role: role.role,
                description: description.description
            };
        }else{
            user = {
                username: signupForm1.username,
                firstname: signupForm1.firstname,
                lastname: signupForm1.lastname,
                email: signupForm1.email,
                password: signupForm1.password,
                password_confirmation: signupForm1.confirmation,
                address: Form2.address,
                phone: Form2.phone,
                role: role.role.toLowerCase(),
            };
        }

        console.log(user)

        setLoading(true)
        axios.post(config.baseUrl+"/register", user)
            .then(res =>{
                console.log(res.data)
                history.push('/verification/'+user.role.toLowerCase())
            })
            .catch(err=>{
                console.log(err.response.data)
                if (err.response.data){
                    const error = err.response.data.errors;
                    console.log(error)
                    if (error.username){
                        notifyFailed(error.username[0])
                    }else if(error.firstname){
                        notifyFailed(error.firstname[0])
                    }else if(error.lastname){
                        notifyFailed(error.lastname[0])
                    }else if(error.email){
                        notifyFailed(error.email[0])
                    }else if(error.password){
                        notifyFailed(error.password[0])
                    }else if(error.phone){
                        notifyFailed(error.phone[0])
                    }else if(error.address){
                        notifyFailed(error.address[0])
                    }else if(error.role){
                        notifyFailed(error.role[0])
                    }
                }else if (!err.response.data || !err){
                    notifyFailed("Verifiez votre connexion internet");
                }

                //console.log(err.response)
            }).finally(e=>{

            setLoading(false)
        })
    }

    const notifyFailed = (err)=>{
        toast.error(err)
    }
    const nextStep = () => {
        setFormStep(2)
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
                setEmail("Doit etre un email valide")
            }else {
                setEmail("")
            }
        }else if (e.target.name === 'password') {
            const password = e.target.value;
            if (!verifiedPassword(password)) {
                setErrorPassword("Doit contenir au moins 6 caractéres")
            }else {
                setErrorPassword("")
            }
        }else if (e.target.name === 'confirmation') {
            const confirmation = e.target.value;
            const password = signupForm1.password;
            if (!confirmationPass(password, confirmation)) {
                setConfirmation("Doit correspondre au mot de passe");
            }else {
                setConfirmation("")
            }
        }else if (e.target.name === 'phone' || e.target.name === 'institution_phone'){
            const phone = parseInt(e.target.value);
            if (!verifiedPhone(phone)){
                setPhone("Doit etre un numéro valide");
            }else {
                setPhone("")
            }
        }
    }

    return (
        <div className="signup-container">
            <div className="logo-box">
                <img src={ebmLogo} alt="" />
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
                            <span></span>
                        </div>

                        <Button
                            variant="primary" 
                            type="submit" 
                            size="lg">Créer Mon Compte
                        </Button>

                        <div className="auth-container__line-element">
                            <p className="auth-text">Vous avez déjà un compte ? <Link to="/login">Log In</Link></p>
                        </div>
                    </form>
                ): formStep === 2 ?(
                    <div className="signup-container">
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
                                    <textarea placeholder='Description ...' name="description" rows="7" 
                                        onChange={onChangeDescription} autoComplete={"off"} required style={{color: 'gray', opacity: '0.8'}}
                                        className={`auth-container__input`}

                                    />
                                </div>
                                : ""}
                            <ToastContainer/>
                            <div className="circles">
                                <span></span>
                                <span className="selected"></span>
                            </div>
                            <Button
                                variant="primary"
                                type="submit"
                                onSubmit
                                loading={loading}
                                disabled={loading}
                                size="lg">{role.role === "INSTITUTION" ? "information institution": "completez inscription"}
                            </Button>
                        </form>
                    </div>
                ) :(
                    <div className="signup-container">
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
                                <textarea placeholder='Description ...' name="description" rows="7" 
                                    onChange={onChangeDescription} autoComplete={"off"} required
                                    className={`auth-container__input`}

                                />
                            </div>
                            <ToastContainer/>
                            <div className="circles">
                                <span></span>
                                <span className="selected"></span>
                            </div>
                            <Button
                                variant="primary"
                                type="submit"
                                onSubmit
                                loading={loading}
                                disabled={loading}
                                size="lg">{"completez inscription"}
                            </Button>
                        </form>
                    </div>
                )
            }
        </div>
    )
}


export default SignUp;