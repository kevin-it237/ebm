import React, {useEffect, useState} from 'react';
import { useDispatch } from 'react-redux'
import './product.item.scss'
import axios from "axios";
import config from "../../../../config/index";
import {getToken} from "../../../../config/helpers";
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import cils from "../../../../assets/images/cils.jpg"
import cart from "../../../../assets/icons/cart.svg"
import { ReactComponent as Heart } from "../../../../assets/icons/heartClick.svg";
import { useHistory } from 'react-router-dom';
import Modal from "../../../../app/components/modal/modal";
import Charge from "../../../../app/components/charge/charge";
import img from "../../../../assets/images/mansory.png";
import Rating from "@material-ui/lab/Rating";
import Button from "../../../../app/components/buttons/button/button";
import LoaderIcon from "react-loader-icon";


const ProductItem = (props) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const [selectProduct, setSelectProduct] = useState([])
    const [select, setSelect] = useState(false)
    const [star, setStar] = useState(0);
    const [getStar, setgetStar] = useState(0);
    const [like, setLike] = useState([]);
    const [isLike, setIsLike] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(()=>{
        getStarProduct();
        getProductLike();
    }, [])

    const getStarProduct=()=>{
        axios.get(config.baseUrl+'/rate/product/'+props.id)
            .then(response=>{
                setgetStar(response.data.message)
            })
            .catch(error=>{
                console.log(error)
            })
    }

    const saveLike=()=>{
        dispatch({
            type: 'ADD_TO_FAVORITE',
            loader: true
        });
        axios.post(config.baseUrl+'/user/like/store',
            {like: !isLike, product_id: props.id})
            .then(response=>{
                axios.get(config.baseUrl + '/user/favorites/product')
                    .then(response => {
                        dispatch({
                                type: 'ADD_TO_FAVORITE',
                                payload: response.data.message.length,
                                loader: false
                            }
                        );
                    }).catch(err => {
                    notify(err)
                })
            })
            .catch(error=>{
                notify(error)
            })
    }

    const getProductLike=()=>{
        axios.get(config.baseUrl+'/user/like/product/'+props.id)
            .then(response=>{
                setIsLike(response.data.message)
            })
            .catch(error=>{
                notify(error)
            })
    }

    const goToCart = (event) => {
        event.preventDefault();
        setSelectProduct(null);
        setSelect(false)
        dispatch({
                type: 'ADD_TO_CART',
                loader: true
            });
        axios.post(config.baseUrl+"/user/cart/product/register", {id: props.id})
            .then((response)=>{
                axios.get(config.baseUrl + '/user/cart/number')
                    .then(response => {
                        dispatch({
                                type: 'ADD_TO_CART',
                                payload: response.data.message,
                                loader: false,
                                message: "Ajout au panier effectué"
                            }
                        );
                    }).catch(err => {
                    notify(err)
                })
            })
            .catch((error)=>{
                notify(error)
                /*dispatch({
                    type: 'ADD_TO_CART',
                    loader: true
                });*/
            })
    }

    const saveNote=()=>{
        setLoading(true)
        axios.post(config.baseUrl+'/user/rate/product/register',
            {rating: star, product_id: selectProduct.id})
            .then(response=>{
                getStarProduct();
                setLoading(false)
            })
            .catch(error=>{
                notify(error)
                setLoading(false)
            })
        setStar(0)
    }

    const notify = (err) => toast.error(err);

    return (
        <div className="product-item">
            <ToastContainer/>
            <div className="product-item__infos" >
                <div className="head">
                    {props.discount !==0 ?<p className="discount">{props.discount}% OFF</p>: <p className="discount-null"></p>}
                    <div className="like" onClick={(e)=> {e.preventDefault(); setIsLike(!isLike); saveLike();}}>
                        <Heart style={{fill : (isLike ? "#6B0C72" : 'gray')}}/>
                    </div>
                </div>
                <img className="product-image" src={cils} alt="" onClick={(e)=> {e.preventDefault();
                    setSelectProduct(props); setSelect(true)
                }}/>
                <div className="product-infos">
                    <h4 className="name">{props.name}</h4>
                    <p className="price">{props.price} XAF</p>
                    <div className="stars">
                        <Rating readOnly disabled size="small" precision={0.25} value={getStar}/>
                    </div>
                </div>
            </div>
            <div className="foot">
                <div onClick={goToCart} className="cart"><img src={cart} alt="" /></div>
            </div>
            {
                selectProduct && select &&
                <Modal hide={() => {
                    setSelectProduct(null); setStar(0)
                }}>
                    <div className="cart-modal-service">
                        <div className="section-title-product">
                            <h2>{selectProduct.name}</h2>
                        </div>
                        <div style={{display: "flex", justifyContent: "space-between"}}>
                            <h1 className="name-service">{selectProduct.price} XFA</h1>
                            <Rating name="half-rating" precision={0.25} size="large"
                                    onChange={(e, newValue)=>{e.preventDefault();
                                        setStar(newValue);}} value={star}/>
                        </div>
                        <img className="product-image-product" src={cils} alt=""/>
                        <h2 style={{wordBreak: "break-word", fontSize: "medium", marginBottom: '2vh', marginTop: '2vh', textAlign: "center"}}>
                            {selectProduct.description}
                        </h2>
                        <Button size="sm" onClick={() => {
                            setSelectProduct(null); saveNote()
                        }}>Fermer</Button>
                    </div>
                </Modal>
            }
            {
                !selectProduct && loading &&
                <Charge>
                    <LoaderIcon type="cylon" color="#6B0C72"/>
                </Charge>
            }

        </div>
    )

}

export default ProductItem;
