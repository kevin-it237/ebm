import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom'
import Button from '../../../../app/components/buttons/button/button';
import ebmLogo from "../../../../assets/images/ebm.svg"
import './auth.choice.scss'

import illustration2 from "../../assets/images/illustration2.svg"

const AuthChoice = () => {

    const history = useHistory()

    const navigate = (to) => {
        history.push(to)
    }

    return (
        <div className="auth-choice">
            <div className="logo-box">
                <img src={ebmLogo} alt="" />
            </div>
            <h2>Every beauty care you want <br />to experience in a single app</h2>
            <img className="illustration" src={illustration2} alt="" />
            <div className="buttons-box">
                <Button onClick={() => navigate('/signup')} white={true}>Create My Account</Button>
                <Button  onClick={() => navigate('/login')}>Log Me In</Button>
            </div>
        </div>
    )
}


export default AuthChoice;