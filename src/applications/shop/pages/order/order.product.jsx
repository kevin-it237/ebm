import React, {useEffect, useState} from 'react'
import config from "../../../../config/index";
import './order.product.scss'
import Button from "../../../../app/components/buttons/button/button";
import {ReactComponent as Back} from "../../../../assets/icons/back_arrow.svg";
import {useHistory, useParams} from "react-router-dom";
import cils from "../../../../assets/images/cils.jpg";
import Modal from "../../../../app/components/modal/modal";
import axios from "axios";
import LoaderIcon from "react-loader-icon";
import Product from "./product.item";
import Slider from "react-slick";
import Charge from "../../../../app/components/charge/charge";

const OrderProduct=()=> {
    const history = useHistory();
    const param = useParams();
    const id = param.slug;

    const settings = {
        dots: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 3,
        infinite: false
    };

    const [order, setOrder] = useState();
    const [product, setProduct] = useState();
    const [date, setDate] = useState(null)
    const [loader, setLoader] = useState(false)
    const [delCart, setDelCart] = useState(false)

    useEffect(() => {
        orderInfo()
    }, [])

    const orderInfo = () => {
        setLoader(true)
        axios.get(config.baseUrl + '/user/product/order/index/' + id)
            .then(response => {
                setOrder(response.data.message)
                axios.get(config.baseUrl + '/user/product/products/index/' + id)
                    .then(res => {
                        setProduct(res.data.message)
                        setLoader(false)
                    })
                    .catch(err => {
                        console.log(err)
                    })
            })
            .catch(err => {
                console.log(err)
                setLoader(false)
            })
    }

    console.log(order)

    const deleteCart = (e) => {
        e.preventDefault()
        let state;
        setDelCart(false)
        setLoader(true)
        if (order[0].state === 'EN ATTENTE'){
            state = "ANNULÉ"
        }else {
            state = "EN ATTENTE"
        }
        console.log(state)
        axios.post(config.baseUrl + '/user/product/order/nocomment/changestate/',
            {order_id: id, state: state})
            .then(res => {
                console.log(res.data.message)
                history.goBack()
                setLoader(false)
            })
            .catch(err => {
                setLoader(false)
            })
    }

    console.log(product)

    return (
        <>
            {order && !loader &&
            <div id="order">
                <div className="header">
                    <Back onClick={() => history.goBack()}/>
                    <div>
                        <div className="header-text">
                            <p style={{marginRight: 5}}>Commande</p>
                            <p>#{id}</p>
                        </div>
                        <p>Crée le {order[0].date}</p>
                    </div>
                </div>
                {product && <Slider {...settings} className="order-som">
                    {Object.keys(product).map((e, index) => (
                        <Product key={index} name={product[e].name} price={product[e].price}
                                 quantity={product[e].quantity}/>
                    ))}
                </Slider>}
                <span></span>
                <div className="order-amount">
                    <p style={{fontSize: "medium", fontWeight: "bold", opacity: 0.8}}>Montant Total</p>
                    <p className="order-amount-price">{order[0].price} XAF</p>
                </div>
                <div className="order-comment">
                    <p style={{fontSize: "medium", fontWeight: "bold", opacity: 0.8}}>Votre commentaire</p>
                    <p className="order-comment-value">{order[0].comment}</p>
                </div>
                <span></span>

                <div className="footer" style={{position: "fixed", bottom: 0, width: '100%', paddingLeft: '60%'}}>
                    <Button size="sm" style={{backgroundColor: '#d95702', fontSize: 'small'}} onClick={
                        (e) => {
                            e.preventDefault();
                            setDelCart(true)
                        }
                    }>
                        {order[0].state === "EN ATTENTE" ? "ANNULÉ" : "EN ATTENTE"}</Button>
                </div>
            </div>
            }
            {
                loader && !order && <Charge>
                    <LoaderIcon type="cylon" color="#6B0C72"/>
                </Charge>
            }
            {
                delCart && <Modal hide={() => setDelCart(false)}>
                    <center><h2 style={{fontSize: "small", marginTop: -8}}>Annulez la Commande ?</h2></center>
                    <br/>
                    <div style={{display: "flex"}}>
                        <Button onClick={(e) => {
                            e.preventDefault();
                            setDelCart(false)
                        }}>Annuler</Button>
                        <Button onClick={deleteCart} style={{backgroundColor: 'red', marginLeft: 10}}>Oui</Button>
                    </div>

                </Modal>
            }
        </>
    )
}

export default OrderProduct;