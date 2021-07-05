import React, { useRef } from 'react';
import './bottom.drawer.scss'
import useOnClickOutside from "../../../helpers/hooks/useOnClickOutside"

const BottomDrawer = ({ children, onClose }) => {
    const ref = useRef()

    useOnClickOutside(ref, () => onClose());

    return (
        <div className="bottom-drawer-backdrop">
            <div ref={ref} id="bottom-drawer">
                <div className="line"></div>
                {children}
            </div>
        </div>
    )
  
}

export default BottomDrawer;