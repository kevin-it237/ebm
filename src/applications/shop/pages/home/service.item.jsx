import React from 'react'
import './service.item.scss'
import tof from "../../../../assets/images/woman.png"
import {isMobile} from "../../../../config/helpers";


const Service = (props)=>{

    return(
        <>
            {isMobile()&&
                <div id="service">
                    <img src={tof} className="service-image"/>
                    <h2 className="service-name">{props.name}</h2>
                    <span></span>
                </div>
            }
            {!isMobile()&&
                <div id="service-web">
                    <img src={tof} className="service-image-web"/>
                    <h2 className="service-name-web">{props.name}</h2>
                    <span></span>
                </div>
            }
        </>
    )
}

export default Service