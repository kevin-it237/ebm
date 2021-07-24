import React, { useState, useEffect } from 'react';
import { ReactComponent as Back } from "../../../../assets/icons/back_arrow.svg"
import { useHistory } from 'react-router-dom';
import CardItem from "../../components/cart.item/cart.item"
import Button from "../../../../app/components/buttons/button/button";
import Modal from "../../../../app/components/modal/modal"
import './cart.scss'
import axios from "axios";
import config from "../../../../config/index";
import {useSelector} from "react-redux";

const Cart = () => {
    const history = useHistory()
    const [showModal, setShowModal] = useState(false);
    const [carts, setCart] = useState("");
    const [products, setProduct] = useState("");

    useEffect(()=>{
        getProduct();
    }, []);

    const getProduct = ()=>{
        axios.get(config.baseUrl+'/user/cart/quantity')
            .then(response=>{
                setProduct(response.data.message)
            })
            .catch(error=>{
                console.log(error)
            })
        }

    return (
        <>
            <div id="cart">
                <div className="header">
                    <Back onClick={() => history.goBack()} />
                    <p>Panier</p>
                </div>

                <div className="cart-items">
                    {Object.keys(products).map((product, index)=>(
                        <div key={index}>
                            <CardItem name={products[product]['name']}
                                      price={products[product]['price']}
                                      quantity={products[product]['quantity']}
                                      discount={products[product]['discount']}/>
                        </div>
                    ))}
                </div>

                <div className="footer">
                    <div className="summary">
                        <p>TOTAL</p>
                        <p className="price">$1530</p>
                    </div>
                    <Button onClick={() => setShowModal(true)} size="sm">CHECKOUT</Button>
                </div>
            </div>
            {
                showModal&&
                <Modal hide={() => setShowModal(false)}>
                    <div className="cart-modal-content">
                        <h3>Checkout</h3>
                        <textarea placeholder="Any comment to" name="comment" rows="7"></textarea>
                        <Button size="sm">Complete</Button>
                    </div>
                </Modal>
            }
        </>
    )
}

export default Cart;