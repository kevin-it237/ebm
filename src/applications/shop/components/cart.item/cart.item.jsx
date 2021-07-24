import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import './cart.item.scss'
import cils from "../../../../assets/images/cils.jpg"

const ProductItem = (props) => {
    const [count, setCount] = useState(props.quantity);
    const [price, setPrice] = useState(props.price);

    useEffect(()=>{
        calc();
    }, []);

    const setNumberOfItems = (op) => {
        if(op === "INC") {
            setCount(count => count+1)
        } else {
            if(count === 1) return;
            setCount(count => count-1)
        }
        calc();
    }

    const calc = () =>{
        const price_product = props.price;
        const discount = props.discount;
        let price = price_product*count - price_product*count*discount;
         setPrice(price);
    }
    return (
        <div className="cart-item">
            <img src={cils} alt="" />
            <div className="product-infos">
                <h4 className="name">{props.name}</h4>
                <p className="price">{price} XAF</p>
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