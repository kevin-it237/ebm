import React, {useEffect, useState} from 'react';
import { useDispatch } from 'react-redux'
import './expert.item.scss'
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
import productLink from "../../../../config/product.link";


const ExpertItem = (props) => {
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
        axios.post(config.baseUrl+'/user/like/expert/store',
            {like: !isLike, product_id: props.id})
            .then(response=>{
                axios.get(config.baseUrl + '/user/favorites/expert')
                    .then(response => {
                        dispatch({
                                type: 'ADD_TO_FAVORITE',
                                payload: response.data.message.length,
                                loader: false
                            }
                        );
                        dispatch({
                            type: 'ALL_FAVORITE_PRODUCT',
                            favorite : response.data.message
                        })
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

    const onSelectProfile = (e)=>{
        console.log(e)
        history.push('/expert/'+e)
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

    console.log(props)
    const notify = (err) => toast.error(err);

    return (
        <div className="product-item">
            <ToastContainer/>
            <div className="product-item__infos" onClick={(e)=>{e.preventDefault(); onSelectProfile(props.id)}}>
                <div className="head">
                    <p className="discount">#{props.id}</p>
                    <div className="stars">
                        <Rating readOnly disabled size="small" precision={0.25} value={props.rate}/>
                    </div>
                    {/*<div className="like" onClick={(e)=> {e.preventDefault(); setIsLike(!isLike); saveLike();}}>
                        <Heart style={{fill : (isLike ? "#6B0C72" : 'gray')}}/>
    </div>*/}
                </div>
                <img className="product-image" src={productLink.link + props.image} alt=""/>
                <div className="product-infos">
                    <h4 className="name">{props.username}</h4>
                    <p className="price">{props.firstname} {props.lastname}</p>
                </div>
            </div>
            {/*<div className="foot">
                <div onClick={goToCart} className="cart"><img src={cart} alt="" /></div>
            </div>*/}
            {/*
                selectProduct && select &&
                <Modal hide={() => {
                    setSelectProduct(null); setStar(0)
                }}>
                    <div className="cart-modal-service">
                        <div className="section-title-product">
                            <h2>{selectProduct.username}</h2>
                        </div>
                        <div style={{display: "flex"}}>
                            <h1 className="name-service">{selectProduct.firstname}</h1>
                            <h1 className="name-service">{selectProduct.lastname}</h1>
                        </div>
                        <img className="product-image-product" src={productLink.link + props.image} alt=""/>
                        <h2 style={{wordBreak: "break-word", fontSize: "medium", marginBottom: '2vh', marginTop: '2vh', textAlign: "center"}}>
                            {selectProduct.description}
                        </h2>
                        <Button size="sm" onClick={() => {
                            setSelectProduct(null); saveNote()
                        }}>Fermer</Button>
                    </div>
                </Modal>
                    */}
            {
                !selectProduct && loading &&
                <Charge>
                    <LoaderIcon type="cylon" color="#6B0C72"/>
                </Charge>
            }

        </div>
    )

}

export default ExpertItem;
