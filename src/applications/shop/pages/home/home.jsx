import React, { useState, useEffect, useCallback } from 'react';
import {Link, useHistory, useParams} from 'react-router-dom';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import InputSearch from "../../../../app/components/inputs/input.search/input.search";
import ProductItem from '../../components/product.item/product.item';
import Menu from "../../../../assets/icons/menu.svg"
import './home.scss'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import HomeDrawerContent from "../../components/home.drawer.content/home.drawer.content"
import axios from "axios";
import config from "../../../../config/index";
import LoaderIcon from "react-loader-icon";
import img from "../../../../assets/images/mansory.png";
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import Badge from '@material-ui/core/Badge';


const Home = () => {
    const history = useHistory();
    const [selectProduct, setSelectProduct] = useState([])
    const [showDrawerService, setShowDrawerService] = useState(false)
    const [products, setProduct] = useState("");
    const [services, setService] = useState("");
    const [parent_services, setParent_Service] = useState("");
    const [favorites, setFavorites] = useState([]);
    const [star, setStar] = useState(0);
    const [Qty, setQty] = useState(0);

    const StyleBadge = withStyles((theme)=>({
        badge: {
            fontSize: 11,
        },
    }))(Badge)

    const openDrawer = () => {
        if(window.setDrawerOpen){
            window.setDrawerOpen(true)
        }
    }

    useEffect(()=>{
        getAllProduct();
        getAllParentService();
        getFavorites();
        getCartQuantity();
    }, []);

    const getAllProduct = ()=> {
        axios.get(config.baseUrl + '/product/index')
            .then(response => {
                setProduct(Object.values(response.data.message));
            }).catch(err => {
            notifyFailed("Verifier votre connexion")
        })
    }

    const getAllParentService = ()=> {
        axios.get(config.baseUrl + '/parent_service/index')
            .then(response => {
                setParent_Service(Object.values(response.data.message));
            }).catch(err => {
            notifyFailed("Verifier votre connexion")
        })
    }

    const getFavorites = ()=> {
        axios.get(config.baseUrl + '/user/favorites')
            .then(response => {
                setFavorites(response.data.message);
            }).catch(err => {
            notifyFailed(err)
        })
    }

    const getCartQuantity = ()=> {
        axios.get(config.baseUrl + '/user/cart/quantity/somme')
            .then(response => {
                setQty(response.data.message);
            }).catch(err => {
            notifyFailed(err)
        })
    }

    const myProfile = ()=>{
        history.push('/profile')
    }

    const notifyFailed = (err)=>{
        toast.error(err)
    }

    return (
        <div id="home">
            <div id="header">
                <img onClick={openDrawer} className="menu" src={Menu} alt="" />
                <IconButton aria-label="cart">
                    <StyleBadge badgeContent={Qty} color="secondary">
                        <ShoppingCartIcon style={{width: 30, height: 30}} onClick={(e)=>{e.preventDefault();
                        history.push('/cart')}}/>
                    </StyleBadge>
                </IconButton>
            </div>
            <div className="search">
                <InputSearch onClick={() => history.push('/search')} placeholder="Recherchez une institution..." />
            </div>

            <ToastContainer/>
            <div className="section-title">
                <h2>Catégories de Services</h2>
                <span></span>
            </div>
            {parent_services.length !== 0 ?
            <div className="services-wrapper">
                {Object.keys(parent_services).map((parent_service, index)=>(
                    <div key={index} className="service-item service-item--1" onClick={()=>{setShowDrawerService(true); setService(parent_services[parent_service]['name'])}}>
                        <div className="service-title">
                            <h2>{parent_services[parent_service]['name']}</h2>
                            <span></span>
                        </div>
                    </div>
                ))}
            </div>
                :
                <div className="spinner_loader">
                    {/*<Loader type="Circles" height={70} width={70} color="#6B0C72"/>*/}
                    <LoaderIcon type="cylon" color="#6B0C72"/>
                </div>}

            <div className="section-title">
                <h2>Produits</h2>
                <span></span>
            </div>
            {products.length !== 0 ?
                <div className="products-wrapper">
                    {Object.keys(products).map((product, index)=>(
                        <div key={index}>
                            <ProductItem id={products[product]['id']}
                                         name={products[product]['name_fr']}
                                         price={products[product]['price']}
                                         discount={products[product]['discount']}/>
                        </div>
                    ))}
                </div>
                :
                <div className="spinner_loader">
                    {/*<Loader type="Circles" height={70} width={70} color="#6B0C72"/>*/}
                    <LoaderIcon type="cylon" color="#6B0C72"/>
                </div>
            }

            {showDrawerService&&<HomeDrawerContent onClose={() => setShowDrawerService(false) }
                                            name={services} />}
        </div>
    )

}

export default Home;
