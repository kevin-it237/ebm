import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom'
import { ReactComponent as Eye } from '../../../../assets/icons/eye.svg';
import { ReactComponent as Uneye } from '../../../../assets/icons/uneye.svg';
import Button from '../../../../app/components/buttons/button/button';
import ebmLogo from "../../../../assets/images/ebm.svg"
import ebmLogoBig from "../../../../assets/images/ebm_big.png"
import './signup.scss'


const SignUp = () => {
    const history = useHistory()

    const [showPassword, setPassword] = useState(false);
    const [signupForm, setForm] = useState({name: "", surname: "", email: "", password: "", confirmation: ""})
    const [formStep, setFormStep] = useState(1)

    const onSubmit = (e) => {
        history.push('/home')
    }

    const nextStep = () => {
        setFormStep(2)
    }

    // Change form input values. 
    const onChange = (e) => setForm({...signupForm,  [e.target.name]: e.target.value })

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
                        {Object.keys(signupForm).map((input, index) => (
                            <div key={index} className="auth-container__input-container">
                                <input
                                    name={input}
                                    onChange={onChange}
                                    value={signupForm[input]}
                                    placeholder={`${input}`}
                                    type={(input === 'password' || input === 'confirmation' ) ? showPassword ? 'text' : 'password' : 'text'}
                                    autoComplete={"off"}
                                    required
                                    className={`auth-container__input ${(input === 'password' || input === 'confirmation' ) ? 'password' : ''}`}
                                />
                                {input === 'password' ? showPassword ? <Uneye onClick={() => setPassword(!showPassword)} /> : <Eye onClick={() => setPassword(!showPassword)} /> : ''}
                            </div>
                        ))}

                        <div className="circles">
                            <span className="selected"></span>
                            <span></span>
                        </div>

                        <Button 
                            onClick={() => nextStep()}
                            variant="primary" 
                            type="submit" 
                            size="lg">Create My Account
                        </Button>

                        <div className="auth-container__line-element">
                            <p className="auth-text">Already have an account ? <Link to="/login">Log In</Link></p>
                        </div>
                    </form>
                ): (
                    <div className="registation-final__step">
                        <select name="">
                            <option value="">Lorem</option>
                            <option value="">Lorem Ipsum</option>
                        </select>

                        <div className="circles">
                            <span></span>
                            <span className="selected"></span>
                        </div>
                        <Button 
                            onClick={() => onSubmit()}
                            variant="primary" 
                            type="submit" 
                            size="lg">Complete Creation
                        </Button>
                    </div>
                )
            }
        </div>
    )
}


export default SignUp;