import React, {useState, useEffect} from 'react';
import {ReactComponent as Back} from "../../../../assets/icons/back_arrow.svg"
import {useHistory} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import CardItem from "../../components/cart.item/cart.item"
import Button from "../../../../app/components/buttons/button/button";
import Modal from "../../../../app/components/modal/modal";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import SwipeToDelete from 'react-swipe-to-delete-ios'
import './cart.scss'
import axios from "axios";
import config from "../../../../config/index";
import LoaderIcon from "react-loader-icon";
import img from "../../../../assets/images/ebm.svg";
import Charge from "../../../../app/components/charge/charge";
import {isMobile} from "../../../../config/helpers";

import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateTimePicker from '@mui/lab/DateTimePicker';
import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import {format} from 'date-fns';
import moment from "moment";

const Cart = () => {
    const history = useHistory()
    const dispatch = useDispatch();
    const prod = useSelector(state => state.cart.product)
    const [showModal, setShowModal] = useState(false);
    const [products, setProduct] = useState("");
    const [loading, setLoading] = useState(false);
    const [regist, setRegist] = useState(false);
    const [comment, setComment] = useState("");
    const [message, setMessage] = useState("");

    const [value, setValue] = React.useState(new Date());

    useEffect(() => {
        getProduct();
    }, []);

    const getProduct = () => {
        setLoading(true)
        axios.get(config.baseUrl + '/user/cart/quantity')
            .then(response => {
                console.log(response.data.message)
                setProduct(response.data.message)
                dispatch({
                    type: 'ALL_CART_PRODUCT',
                    product: response.data.message
                })
                setLoading(false)
            })
            .catch(error => {
                console.log(error)
                setLoading(false)
            })
    }

    let total = 0;
    if (prod.length !== 0) {
        for (let i = 0; i < prod.length; i++) {
            total += prod[i]["quantity"] * prod[i]["price"] - (prod[i]["quantity"] * prod[i]["price"] * prod[i]["discount"]) / 100;
        }
    }

    const saveCommand = () => {
        setRegist(true)
        const order = {comment: comment, date: value.toISOString()}
        console.log(order)
        axios.post(config.baseUrl + '/user/commande/register', order)
            .then(response => {
                console.log(response)
                setComment("");
                setProduct("");
                setValue(new Date());
                dispatch({
                    type: 'ADD_TO_CART',
                    payload: 0
                });
                dispatch({
                    type: 'ALL_CART_PRODUCT',
                    product: []
                });
                setMessage("Commande Enregistrée")
                setRegist(false)
            })
            .catch(error => {
                console.log(error)
                setRegist(false)
            })
    }

    const getCartNumber = () => {
        axios.get(config.baseUrl + '/user/cart/number')
            .then(response => {
                console.log(response.data.message)
                dispatch({
                    type: 'ADD_TO_CART',
                    payload: response.data.message
                });
            }).catch(err => {
        })
    }

    const Undelete = (id) => {
        axios.get(config.baseUrl + '/user/cart/product/delete/' + id)
            .then(res => {
                getProduct()
                axios.get(config.baseUrl + '/user/cart/quantity')
                    .then(response => {
                        setProduct(response.data.message)
                        dispatch({
                            type: 'ALL_CART_PRODUCT',
                            product: response.data.message
                        })
                        getCartNumber();
                    })
                    .catch(error => {
                    })
            })
            .catch(error => {
                console.log(error)
            })
    }

    const onChange = (event) => {
        event.target.name = event.target.value;
        setComment(event.target.name)
    }

    console.log(value.toISOString())

    return (
        <>
            {isMobile()&&<div id="cart">
                <div className="header">
                    <Back onClick={() => history.goBack()}/>
                    <p>Panier</p>
                </div>
                {prod.length !== 0 &&
                <div className="cart-items" style={{padding: 0, paddingTop: 20, paddingBottom: 20}}>
                    {Object.keys(prod).map((product, index) => (
                        <SwipeToDelete key={index}
                                       onDelete={() => Undelete(products[product]['id'])} // required
                                       height={91} // required
                            // optional
                                       transitionDuration={250} // default
                                       deleteWidth={75} // default
                                       deleteColor="rgba(252, 58, 48, 1.00)" // default
                                       deleteText="Retirer" // default
                                       deleteComponent={null} // not default
                                       disabled={false} // default
                                       rtl={false} // default
                        >
                            <CardItem id={prod[product]['id']} products={prod}
                                      name={prod[product]['name']}
                                      price={prod[product]['price']}
                                      quantity={prod[product]['quantity']}
                                      image={prod[product]['image']}
                                      discount={prod[product]['discount']} update={setProduct} index={index}/>

                        </SwipeToDelete>
                    ))}
                </div>
                }
                {loading && prod.length === 0 &&
                <Charge className="spinner_load">
                    <LoaderIcon type="cylon" color="#6B0C72"/>
                </Charge>
                }
                {regist &&
                <Charge className="spinner_load">
                    <LoaderIcon type="cylon" color="#6B0C72"/>
                </Charge>
                }
                {!loading && prod.length === 0 && isMobile() &&
                <div style={{position: 'absolute', top: '30%', left: '35%'}}>
                    <center>
                        <br/>
                        <img src={require("../../../../assets/images/telescope.png").default}/>
                        <p>{"Aucun Produit dans le panier"}</p>
                    </center>
                </div>
                }
                {prod.length !== 0 ?
                    <div className="footer" style={{position: "fixed", bottom: 0, width: '100%'}}>
                        <div className="summary">
                            <p>TOTAL</p>
                            <p className="price">{total} XAF</p>
                        </div>

                        <Button onClick={() => setShowModal(true)} size="sm">VALIDER</Button>
                    </div>
                    : <div></div>}
            </div>}

            {!isMobile()&&<div id="cart-web">
                <div className="header-web">
                    <Back onClick={() => history.goBack()}/>
                    <p>Panier</p>
                </div>
                {prod.length !== 0 &&
                <div className="cart-items-web" style={{padding: 0, paddingTop: 20, paddingBottom: 20}}>
                    {Object.keys(prod).map((product, index) => (
                        <SwipeToDelete key={index}
                                       onDelete={() => Undelete(products[product]['id'])} // required
                                       height={91} // required
                            // optional
                                       transitionDuration={250} // default
                                       deleteWidth={75} // default
                                       deleteColor="rgba(252, 58, 48, 1.00)" // default
                                       deleteText="Retirer" // default
                                       deleteComponent={null} // not default
                                       disabled={false} // default
                                       rtl={false} // default
                        >
                            <CardItem id={prod[product]['id']} products={prod}
                                      name={prod[product]['name']}
                                      price={prod[product]['price']}
                                      quantity={prod[product]['quantity']}
                                      image={prod[product]['image']}
                                      discount={prod[product]['discount']} update={setProduct} index={index}/>

                        </SwipeToDelete>
                    ))}
                </div>
                }
                {loading && prod.length === 0 &&
                    <div className="spinner_load">
                        <LoaderIcon type="cylon" color="#6B0C72"/>
                    </div>
                }
                {regist &&
                    <div className="spinner_load">
                        <LoaderIcon type="cylon" color="#6B0C72"/>
                    </div>
                }
                {!loading && prod.length === 0 && !isMobile() &&
                    <div style={{position: 'absolute', top: '30%', left: '50%'}}>
                        <center>
                            <br/>
                            <img src={require("../../../../assets/images/telescope.png").default}/>
                            <p>{"Aucun Produit dans le panier"}</p>
                        </center>
                    </div>
                }
                {prod.length !== 0 ?
                    <div className="footer" style={{position: "fixed", bottom: 0, width: '100%'}}>
                        <div className="summary">
                            <p>TOTAL</p>
                            <p className="price">{total} XAF</p>
                        </div>

                        <Button onClick={() => setShowModal(true)} size="sm">VALIDER</Button>
                    </div>
                    : <div></div>}
            </div>}

            {
                showModal &&
                <Modal>
                    <div className="cart-modal-content">
                        <h3>Valider la Commande</h3>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DateTimePicker
                                renderInput={(props) => <TextField {...props} className="textName"/>}
                                label="Date de Livraison"
                                value={value}
                                onChange={(newValue) => {
                                    setValue(newValue);
                                }}
                            />
                        </LocalizationProvider>
                        <br/>
                        <textarea placeholder="Enregistrer votre commentaire..." name="comment" rows="7"
                                  onChange={onChange} style={{fontSize: "small"}}
                                  value={comment}>

                        </textarea>
                        <div style={{display: 'flex', justifyContent: 'space-between'}}>
                            <Button onClick={() => {
                                setComment('');
                                setValue(new Date());
                                setShowModal(false)
                            }} style={{background: "red"}}>Annuler</Button>
                            <Button size="sm" onClick={() => {
                                saveCommand();
                                setShowModal(false)
                            }}>Completer</Button>
                        </div>

                    </div>
                </Modal>
            }
            {
                !loading && message &&
                <Modal hide={() => setMessage("")}>
                    <br/>
                    <center>
                        <p>{message}</p>
                    </center>
                </Modal>
            }
        </>
    )
}

export default Cart;
