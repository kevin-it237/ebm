import React, { useState } from 'react';
import {useDispatch} from "react-redux";
import './cart.item.scss'
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import cils from "../../../../assets/images/cils.jpg"
import axios from "axios";
import config from "../../../../config/index";

const ProductItem = (props, state) => {
    const dispatch = useDispatch();
    const [count, setCount] = useState(props.quantity);
    const {update,index,products}=props;

    const setNumberOfItems = (op) => {
        let newCount;
        if(op === "INC") {
            newCount=count+1;
            setCount(newCount);
            axios.post(config.baseUrl+'/user/cart/changequantity/'+props.id, {quantity: newCount})
                .then(response=>{
                    axios.get(config.baseUrl + '/user/cart/number')
                        .then(response => {
                            dispatch({
                                    type: 'ADD_TO_CART',
                                    payload: response.data.message,
                                }
                            );
                        }).catch(err => {
                        notifyFailed(err)
                    })
                })
                .catch(error=>{
                    notifyFailed(error);
                })
        } else {
            if(count === 1) return;
            newCount=count-1;
            setCount(newCount);
            axios.post(config.baseUrl+'/user/cart/changequantity/'+props.id, {quantity: newCount})
                .then(response=>{
                    axios.get(config.baseUrl + '/user/cart/number')
                        .then(response => {
                            dispatch({
                                    type: 'ADD_TO_CART',
                                    payload: response.data.message,
                                }
                            );
                        }).catch(err => {
                        notifyFailed(err)
                    })
                })
                .catch(error=>{
                    notifyFailed(error);
                })
        }
        let currentProduct = products[index];
        currentProduct.quantity = newCount;
        products[index]=currentProduct;
        update([...products])
    }

    console.log(count)
    const notifyFailed = (err)=>{
        toast.error(err)
    }

    return (
        <div className="cart-item" style={{backgroundColor:"white",padding:"0 20px"}}>
            <img src={cils} alt="" />
            <div className="product-infos">
                <h4 className="name">{props.name}</h4>
                {props.discount !==0 ?
                    <div className="price align-price" style={{justifyContent:"start",alignItems:"flex-end"}}>
                        <p className="price">{props.price - (props.price*props.discount)/100} XAF</p>
                        <p className="price-discount" style={{marginLeft:5,opacity:0.6,fontSize:11}}>{props.price} XAF</p>
                    </div>
                    :
                    <div className="price"><p className="price">{props.price} XAF</p></div>
                }
                <div className="items-counts">
                    <button onClick={() => setNumberOfItems("INC")}>+</button>
                    <button className="quantity">{count}</button>
                    <button onClick={() => setNumberOfItems("DEC")}>-</button>
                </div>
            </div>
            <ToastContainer/>
        </div>
    )
  
}

export default ProductItem;