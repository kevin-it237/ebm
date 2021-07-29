import React, { useState } from 'react';
import './localization.scss'
import { ReactComponent as Location } from "../../../../assets/icons/location.svg";

const Localization = (props) => {

    console.log(props)
    return (
        <div className="localization">
            <p>Map here</p>
            <div className="position">
                <Location />
                <p>{props.address}</p>
            </div>
        </div>
    )
  
}

export default Localization;