import React from 'react'
import './service.item.scss'
import tof from "../../../../assets/images/woman.png"


const Service = (props)=>{

    return(
        <div id="service">
            <img src={tof} className="service-image"/>
            <h2 className="service-name">{props.name}</h2>
            <span></span>
        </div>
    )
}

export default Service