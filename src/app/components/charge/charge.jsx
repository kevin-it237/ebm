import React, { useRef } from 'react';
import './charge.scss'


/**
 *
 * @param {function} hide
 */
const Charge = ({children}) => {
    const ref = useRef()

    return (
        <div id="charge">
            <div className="charge--container">
                <div ref={ref} className="charge--content">
                    {children}
                </div>
            </div>
        </div>
    )

}

export default Charge;