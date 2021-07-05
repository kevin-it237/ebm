import React, { useState } from 'react';
import { Link } from 'react-router-dom'
import { ReactComponent as Eye } from '../../../../assets/icons/eye.svg';
import { ReactComponent as Uneye } from '../../../../assets/icons/uneye.svg';
import Button from '../../../../app/components/buttons/button/button';
import ebmLogo from "../../../../assets/images/ebm.svg"
import ebmLogoBig from "../../../../assets/images/ebm_big.png"
import './login.scss'


const Login = () => {
    const [showPassword, setPassword] = useState(false);
    const [loginForm, setLoginForm] = useState({email: "", password: ""})

    const onSubmit = (e) => {
    }

    // Change form input values. 
    const onChange = (e) => setLoginForm({...loginForm,  [e.target.name]: e.target.value })

    return (
        <div className="login-container">
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
                            value={loginForm[input]}
                            placeholder={`${input}`}
                            type={input === 'password' ? showPassword ? 'text' : 'password' : 'email'}
                            autoComplete={"off"}
                            required
                            className={`auth-container__input ${input === 'password' ? 'password' : ''}`}
                        />
                        {input === 'password' ? showPassword ? <Uneye onClick={() => setPassword(!showPassword)} /> : <Eye onClick={() => setPassword(!showPassword)} /> : ''}
                    </div>
                ))}

                <div className="forgot-password__box">
                    <Link to="/reset-password">Forgot Password ?</Link>
                </div>

                <Button 
                    variant="primary" 
                    type="submit" 
                    size="lg" >Log Me In
                </Button>

                <div className="auth-container__line-element">
                    <p className="auth-text">Dont' have an account ? <Link to="/signup">Create your account</Link></p>
                </div>

            </form>
        </div>
    )
}


export default Login;