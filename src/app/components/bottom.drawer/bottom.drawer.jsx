import React, { useRef } from 'react';
import './bottom.drawer.scss'
import useOnClickOutside from "../../../helpers/hooks/useOnClickOutside"
import {isMobile} from "../../../config/helpers"

const BottomDrawer = ({ children, onClose }) => {
    const ref = useRef()

    useOnClickOutside(ref, () => onClose());

    return (
        <div>
            {isMobile()&&
                <div className="bottom-drawer-backdrop">
                    <div ref={ref} id="bottom-drawer">
                        <div className="line"></div>
                        {children}
                    </div>
                </div>
            }
            {!isMobile()&&
                <div className="bottom-drawer-backdrop-web">
                    <div ref={ref} id="bottom-drawer-web">
                        <div className="line"></div>
                        {children}
                    </div>
                </div>
            }
        </div>
        
    )
  
}

export default BottomDrawer;