import React, { useState } from 'react';
import './localization.scss'
import { ReactComponent as Location } from "../../../../assets/icons/location.svg";

const Localization = () => {
    

    return (
        <div className="localization">
            <p>Map here</p>
            <div className="position">
                <Location />
                <p>Address, here</p>
            </div>
        </div>
    )
  
}

export default Localization;