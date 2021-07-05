import React from 'react';
import './modal.scss'

/**
 * 
 * @param {function} hide 
 */
const Modal = ({hide, children}) => {

    return (
        <div id="modal">
           <div className="modal--container">
               <div className="modal--content">
                   <p onClick={hide} className="close--action">x</p>
                    {children}
               </div>
           </div>
        </div>
    )
  
}

export default Modal;