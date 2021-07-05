import React from 'react';
import './product.item.scss'
import { ReactComponent as Star } from "../../../../assets/icons/star.svg"
import cils from "../../../../assets/images/cils.jpg"
import cart from "../../../../assets/icons/cart.svg"
import heart from "../../../../assets/icons/heart.svg"

const ProductItem = () => {

    return (
        <div className="product-item">
            <div className="product-item__infos">
                <div className="head">
                    <p className="discount">30% OFF</p>
                    <div className="like"><img src={heart} alt="" /></div>
                </div>
                <img className="product-image" src={cils} alt="" />
                <div className="product-infos">
                    <h4 className="name">Face Wiper</h4>
                    <p className="price">127, 000 XAF</p>
                    <div className="stars">
                        <Star />
                        <Star />
                        <Star />
                        <Star />
                        <Star />
                    </div>
                </div>
            </div>
            <div className="foot">
                <div className="like"><img src={cart} alt="" /></div>
            </div>
        </div>
    )
  
}

export default ProductItem;