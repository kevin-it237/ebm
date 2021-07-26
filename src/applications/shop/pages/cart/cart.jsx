import React, {useState, useEffect} from 'react';
import {ReactComponent as Back} from "../../../../assets/icons/back_arrow.svg"
import {useHistory} from 'react-router-dom';
import CardItem from "../../components/cart.item/cart.item"
import Button from "../../../../app/components/buttons/button/button";
import Modal from "../../../../app/components/modal/modal"
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import SwipeToDelete from 'react-swipe-to-delete-component';
import Loader from "react-loader-spinner";
import './cart.scss'
import axios from "axios";
import config from "../../../../config/index";

const Cart = () => {
    const history = useHistory()
    const [showModal, setShowModal] = useState(false);
    const [Total, setTotal] = useState("");
    const [totalProd, settotalProd] = useState("");
    const [products, setProduct] = useState("");
    const [comment, setComment] = useState("");

    useEffect(() => {
        getProduct();
    }, []);

    const getProduct = () => {
        axios.get(config.baseUrl + '/user/cart/quantity')
            .then(response => {
                setProduct(response.data.message)
            })
            .catch(error => {
                console.log(error)
            })
    }

    let total = 0;
    if (products.length !== 0) {
        for (let i = 0; i < products.length; i++) {
            total += products[i]["quantity"] * products[i]["price"] - (products[i]["quantity"] * products[i]["price"] * products[i]["discount"])/100;
        }
    }

    const saveCommand = () => {
        axios.post(config.baseUrl + '/user/commande/register', {comment: comment})
            .then(response => {
                setComment("");
                setProduct("");
            })
            .catch(error => {
                console.log(error)
            })
    }

    const onChange = (event) => {
        event.target.name = event.target.value;
        setComment(event.target.name)
    }

    return (
        <>
            <div id="cart" onClick={e=>{

                window.products = products;
            }}>
                <div className="header">
                    <Back onClick={() => history.goBack()}/>
                    <p>Panier</p>
                </div>
                {products.length !== 0 ?
                    <div className="cart-items">
                        {Object.keys(products).map((product, index) => (
                            <SwipeToDelete key={index}>
                                <CardItem id={products[product]['id']} products={products}
                                          name={products[product]['name']}
                                          price={products[product]['price']}
                                          quantity={products[product]['quantity']}
                                          discount={products[product]['discount']} update={setProduct} index={index}/>
                            </SwipeToDelete>
                        ))}
                    </div> : <div className="spinner_load">
                        <Loader type="Circles" height={90} width={90} color="#6B0C72"/>
                    </div>
                }
                {products.length !== 0 ?
                    <div className="footer">
                        <div className="summary">
                            <p>TOTAL</p>
                            <p className="price">{total} XAF</p>
                        </div>

                        <Button onClick={() => setShowModal(true)} size="sm">VALIDER</Button>
                    </div>
                    : <div></div>}
            </div>
            {
                showModal &&
                <Modal hide={() => setShowModal(false)}>
                    <div className="cart-modal-content">
                        <h3>Valider la Commande</h3>
                        <textarea placeholder="Enregistrer votre commentaire..." name="comment" rows="7"
                                  onChange={onChange}
                                  value={comment}></textarea>
                        <Button size="sm" onClick={() => {
                            saveCommand();
                            setShowModal(false)
                        }}>Completer</Button>
                    </div>
                </Modal>
            }
        </>
    )
}

export default Cart;