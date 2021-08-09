import React, {useEffect, useState} from 'react';
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
import Modal from "../../../../app/components/modal/modal";
import img from "../../../../assets/images/mansory.png";
import Rating from "@material-ui/lab/Rating";
import Button from "../../../../app/components/buttons/button/button";
import LoaderIcon from "react-loader-icon";


const ProductItem = (props) => {
    const history = useHistory();
    const [selectProduct, setSelectProduct] = useState([])
    const [select, setSelect] = useState(false)
    const [star, setStar] = useState(0);
    const [getStar, setgetStar] = useState(0);
    const [like, setLike] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(()=>{
        getStarProduct();
    }, [])

    const getStarProduct=()=>{
        axios.post(config.baseUrl+'/rate/product', {id: props.id})
            .then(response=>{
                setgetStar(response.data.message)
            })
            .catch(error=>{
                console.log(error)
            })
    }

    const goToCart = (event) => {
        event.preventDefault();
        setSelectProduct(null);
        setSelect(false)
        const token = getToken();
        if (token === null){
            history.push("/login");
            return
        }
        axios.post(config.baseUrl+"/user/cart/product/register", {id: props.id})
            .then((response)=>{
            })
            .catch((error)=>{
                notify(error)
            })
    }

    const saveNote=()=>{
        setLoading(true)
        axios.post(config.baseUrl+'/user/like/register',
            {like: like, rating: star, product_id: props.id})
            .then(response=>{
                console.log(response.data.message)
                getStarProduct();
                setLoading(false)
            })
            .catch(error=>{
                notify(error)
                setLoading(false)
            })
    }

    const notify = (err) => toast.error(err);

    return (
        <div className="product-item">
            <ToastContainer/>
            <div className="product-item__infos" onClick={(e)=> {e.preventDefault();
                setSelectProduct(props); setSelect(true)
            }}>
                <div className="head">
                    <p className="discount">{props.discount}% OFF</p>
                    {<div className="like"><img src={heart} alt=""/></div>}
                </div>
                <img className="product-image" src={cils} alt="" />
                <div className="product-infos">
                    <h4 className="name">{props.name}</h4>
                    <p className="price">{props.price} XAF</p>
                    <div className="stars">
                        <Rating readOnly size="small" precision={0.5} value={getStar}/>
                    </div>
                </div>
            </div>
            <div className="foot">
                <div onClick={goToCart} className="cart"><img src={cart} alt="" /></div>
            </div>
            {
                selectProduct && select &&
                <Modal hide={() => {
                    setSelectProduct(null)
                }}>
                    <div className="cart-modal-service">
                        <div className="section-title-product">
                            <h2>Notez ce Produit</h2>
                        </div>
                        <div style={{display: "flex", justifyContent: "space-between"}}>
                            <h1 className="name-service">{selectProduct.name}</h1>
                            <div className="like" onClick={(e)=> {e.preventDefault();
                                setLike(!like)
                            }}><img src={heart} alt="" style={{width: 22, height: 22}}/></div>
                        </div>
                        <img className="product-image-product" src={cils} alt=""/>
                        <div className="like-service">
                            <Rating name="half-rating" precision={0.5} size="large"
                                    onChange={(e, newValue)=>{e.preventDefault();
                                        setStar(newValue)}} value={star}/>
                        </div>
                        <Button size="sm" onClick={(e) => {e.preventDefault();
                            setSelectProduct(null); saveNote()
                        }}>Enregistrer</Button>
                    </div>
                </Modal>
            }
            {
                !selectProduct && loading &&
                <Modal>
                    <LoaderIcon type="cylon" color="#6B0C72"/>
                </Modal>
            }

        </div>
    )

}

export default ProductItem;
