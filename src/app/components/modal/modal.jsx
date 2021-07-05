import React, { useRef } from 'react';
import Close from "../../../assets/icons/close.svg";
import useOnClickOutside from '../../../helpers/hooks/useOnClickOutside';
import './modal.scss'


/**
 * 
 * @param {function} hide 
 */
const Modal = ({hide, children}) => {
    const ref = useRef()
    useOnClickOutside(ref, () => hide())

    return (
        <div id="modal">
           <div className="modal--container">
               <div ref={ref} className="modal--content">
                   <p onClick={hide} className="close--action">
                    <img src={Close} alt="" />
                   </p>
                    {children}
               </div>
           </div>
        </div>
    )
  
}

export default Modal;