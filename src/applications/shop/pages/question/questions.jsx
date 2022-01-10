import React, { useState } from 'react';
import {Link, NavLink, useHistory} from 'react-router-dom'
import Button from '../../../../app/components/buttons/button/button';
import ebmLogo from "../../../../assets/images/ebm.svg"
import ebmLogoBig from "../../../../assets/images/ebm_big.png"
import './questions.scss'
import 'react-toastify/dist/ReactToastify.css'


const Questions = () => {
    const history = useHistory();

    const onclick=(event)=>{
        event.preventDefault();
        history.push('https://docs.google.com/forms/d/e/1FAIpQLScpvBNHPRi6oYZ3MC6lIMaDXKDIBo4QtZorako33heTS43gBQ/viewform?usp=sf_link')
    }

    const onLogin=()=>{
        history.push('/login');
    }

    return (
        <div className="signup-container">
            <div className="logo-box">
                <img src={ebmLogo} alt="" />
            </div>
            <div className="big-logo__box">
                <img src={ebmLogoBig} alt="" />
            </div>

            <div className="auth-container__line-element">
                <p className="auth-text">
                    Cliquez <a
                        style={{textDecoration: 'none', fontWeight: 'bold'}}
                        href={'https://docs.google.com/forms/d/e/1FAIpQLScpvBNHPRi6oYZ3MC6lIMaDXKDIBo4QtZorako33heTS43gBQ/viewform?usp=sf_link'}
                        variant="primary"
                        type="submit"
                        size="lg">Ici
                    </a> pour répondre au questionnaire
                </p>
            </div>

            <div className="button-wrapper">
                <Button size="sm" onClick={onLogin}>Login</Button>
            </div>

        </div>
    )
}


export default Questions;