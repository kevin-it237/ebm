import React, { useRef } from 'react';
import './input.image.scss'
import useOnClickOutside from "../../../helpers/hooks/useOnClickOutside"

const InputImage = ({ children, onClose }) => {
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

export default InputImage;