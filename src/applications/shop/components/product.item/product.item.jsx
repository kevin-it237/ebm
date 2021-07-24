import React from 'react';
import './product.item.scss'
import axios from "axios";
import config from "../../../../config/index";
import { ReactComponent as Star } from "../../../../assets/icons/star.svg"
import {getToken} from "../../../../config/helpers";
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import cils from "../../../../assets/images/cils.jpg"
import cart from "../../../../assets/icons/cart.svg"
import heart from "../../../../assets/icons/heart.svg"
import { useHistory } from 'react-router-dom';
import {connect} from "react-redux";


const ProductItem = (props) => {
    const history = useHistory();

    const goToCart = () => {
        const token = getToken();
        if (token === null){
            history.push("/login");
            return
        }

        axios.post(config.baseUrl+"/user/cart/product/register", {id: props.id})
            .then((response)=>{
                notifySucces(JSON.stringify(response.data.message))
                history.push("/cart")
            })
            .catch((error)=>{
                console.log(error)
            })

        //history.push("/cart")
    }

    const notifySucces = (err)=>{
        toast.error(err)
    }

    return (
        <div className="product-item">
            <ToastContainer/>
            <div className="product-item__infos">
                <div className="head">
                    <p className="discount">{props.discount}% OFF</p>
                    <div className="like"><img src={heart} alt="" /></div>
                </div>
                <img className="product-image" src={cils} alt="" />
                <div className="product-infos">
                    <h4 className="name">{props.name}</h4>
                    <p className="price">{props.price} XAF</p>
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
                <div onClick={goToCart} className="cart"><img src={cart} alt="" /></div>
            </div>
        </div>
    )
  
}

export default ProductItem;