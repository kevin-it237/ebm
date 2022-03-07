import React, {useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux'
import './prestation.item.scss'
import axios from "axios";
import config from "../../../../config/index";
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import { useHistory } from 'react-router-dom';
import Charge from "../../../../app/components/charge/charge";
import LoaderIcon from "react-loader-icon";
import productLink from "../../../../config/product.link";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';

import {isMobile} from "../../../../config/helpers"

const PrestationItem = (props) => {

    const history = useHistory();
    const dispatch = useDispatch();
    const [selectProduct, setSelectProduct] = useState([])
    const [select, setSelect] = useState(false)
    const [star, setStar] = useState(0);
    const [getStar, setgetStar] = useState(0);
    const [like, setLike] = useState([]);
    const [isLike, setIsLike] = useState(false);
    const [loading, setLoading] = useState(false);

    const da = useSelector(state=>state.product.payload)

    console.log(da)

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
    
    const notify = (err) => toast.error(err);

    return (
        <div className="product-item">
            <ToastContainer/>
            {isMobile()&&<div className="product-item__infos_mobile">
                <div className="head">
                    <p className="discount">#{props.id}</p>
                    {/*<div className="like" onClick={(e)=> {e.preventDefault(); setIsLike(!isLike); saveLike();}}>
                        <Heart style={{fill : (isLike ? "#6B0C72" : 'gray')}}/>
    </div>*/}
                </div>

                <Carousel stopOnHover autoPlay thumbWidth={40} interval={4000} infiniteLoop className="prestation-image">
                    {props.image.map((e, i)=>(
                        <div>
                            <img key={i} src={productLink.link + e} alt=""/>
                        </div>
                    ))}
                </Carousel>

                <div className="product-infos">
                    <h4 className="name">{props.name}</h4>
                    <p className="price">{props.price} XAF</p>
                    {/*<div className="stars">
                        <Rating readOnly disabled size="small" precision={0.25} value={getStar}/>
</div>*/}
                </div>
            </div>}
            {!isMobile()&&<div className="product-item__infos">
                <div className="head">
                    <p className="discount">#{props.id}</p>
                    {/*<div className="like" onClick={(e)=> {e.preventDefault(); setIsLike(!isLike); saveLike();}}>
                        <Heart style={{fill : (isLike ? "#6B0C72" : 'gray')}}/>
    </div>*/}
                </div>

                <Carousel stopOnHover autoPlay interval={4000} infiniteLoop className="prestation-image">
                    {props.image.map((e, i)=>(
                        <div>
                            <img key={i} src={productLink.link + e} alt=""/>
                            <p className="legend">{props.name} {i}</p>
                        </div>
                    ))}
                </Carousel>

                <div className="product-infos">
                    <h4 className="name">{props.name}</h4>
                    <p className="price">{props.price} XAF</p>
                    {/*<div className="stars">
                        <Rating readOnly disabled size="small" precision={0.25} value={getStar}/>
</div>*/}
                </div>
            </div>}
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

export default PrestationItem;
