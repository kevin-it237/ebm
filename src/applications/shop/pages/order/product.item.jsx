import React from 'react'
import cils from "../../../../assets/images/cils.jpg";
import './product.item.scss'

const Product = (props)=>{

    return(
        <>
            <div id="order-form">
                <img className="order-image" src={cils} alt="Taille"/>
                <p style={{marginLeft: 5}} className="order-name">{props.name}</p>
                <p style={{marginLeft: 5}} className="order-price">{props.price} XAF</p>
                <div className="order-quantity-form">
                    <p className="order-quantity">x {props.quantity}</p>
                </div>
            </div>
        </>
    )
}

export default Product;