import React, { useState } from 'react';
import './cart.item.scss'
import cils from "../../../../assets/images/cils.jpg"

const ProductItem = () => {
    const [count, setCount] = useState(2)

    const setNumberOfItems = (op) => {
        if(op === "INC") {
            setCount(count => count+1)
        } else {
            if(count === 1) return;
            setCount(count => count-1)
        }
    }

    return (
        <div className="cart-item">
            <img src={cils} alt="" />
            <div className="product-infos">
                <h4 className="name">Product name</h4>
                <p className="price">$1100</p>
                <div className="items-counts">
                    <button onClick={() => setNumberOfItems("INC")}>+</button>
                    <button className="quantity">{count}</button>
                    <button onClick={() => setNumberOfItems("DEC")}>-</button>
                </div>
            </div>
        </div>
    )
  
}

export default ProductItem;