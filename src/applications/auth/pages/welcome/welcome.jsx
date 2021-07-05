import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom'
import Button from '../../../../app/components/buttons/button/button';
import { ReactComponent as ArrowRight } from "../../../../assets/icons/arrow_right.svg"
import { ReactComponent as ArrowLeft } from "../../../../assets/icons/arrow_left.svg"
import Fade from 'react-reveal/Fade';
import ebmLogo from "../../../../assets/images/ebm.svg"
import './welcome.scss'

import illustration1 from "../../assets/images/illustration1.svg"

const STEPS = [
    {
        id: 1,
        image: illustration1,
        title: "Ut enim ad minim veniam, quis nostrud exercitation",
    },
    {
        id: 2,
        image: illustration1,
        title: "Ut enim ad minim veniam, quis nostrud exercitation 2"
    },
    {
        id: 3,
        image: illustration1,
        title: "Ut enim ad minim veniam, quis nostrud exercitation 3"
    },
]


const Welcome = () => {

    const history = useHistory()
    const [currentStep, setCurrentStep] = useState(STEPS[0])

    /**
     * @param {string} step 
     */
    const navigate = (step) => {
        const currentStepId = currentStep.id
       
        if(step === "NEXT") {
            if(currentStepId === STEPS.length) {
                history.push('/auth/choice')
            } else {
                const nextStep = STEPS.find(step => step.id === currentStepId+1);
                setCurrentStep(nextStep)
            }
        } else if(step === "PREVIOUS") {
            const previousStep = STEPS.find(step => step.id === currentStepId-1);
            setCurrentStep(previousStep)
        }
    }

    return (
        <div className="welcome-container">
            <div className="logo-box">
                <img src={ebmLogo} alt="" />
            </div>
            <div className="info-box">
                <div className="infos">
                    <Fade><h4>{currentStep.title}</h4></Fade>
                    <Fade><img className="illustration" src={currentStep.image} alt="" /></Fade>
                </div>
                <div className="circles">
                    {STEPS.map((item) => <span className={`${item.id === currentStep.id ? "selected": ""}`} key={item.id}></span>)}
                </div>
            </div>
            <div className="buttons-wrapper">
                <Button onClick={() => navigate("PREVIOUS")} disabled={currentStep.id === 1} rounded={true}><ArrowLeft /></Button>
                <Button onClick={() => navigate("NEXT")} rounded={true}><ArrowRight /></Button>
            </div>
        </div>
    )
}


export default Welcome;