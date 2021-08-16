import React, { useState, useEffect } from 'react';
import { useHistory} from 'react-router-dom';
import { useSelector } from 'react-redux';
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
import { ReactComponent as Heart } from "../../../../assets/icons/heartClick.svg";
import Slider from "react-slick";


const Home = () => {
    const history = useHistory();
    const nbFavorites = useSelector((state)=>state.product.payload)
    const nbCart= useSelector((state)=>state.cart.payload)
    const [showDrawerService, setShowDrawerService] = useState(false)
    const [products, setProduct] = useState("");
    const [services, setService] = useState("");
    const [parent_services, setParent_Service] = useState("");
    const [favorites, setFavorites] = useState([]);

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 2,
        slidesToScroll: 1,
        initialSlide: 0,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    initialSlide: 2
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    height: 60
                }
            }
        ]
    };

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
    }, []);

    const getAllProduct = ()=> {
        axios.get(config.baseUrl + '/product/index')
            .then(response => {
                setProduct(Object.values(response.data.message));
            }).catch(err => {
            notifyFailed("Verifier votre connexion")
        })
    }
    console.log(products)

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

    const notifyFailed = (err)=>{
        toast.error(err)
    }

    return (
        <div id="home">
            <div id="header">
                <img onClick={openDrawer} className="menu" src={Menu} alt="" />
                <div className="favorite-shop">
                    <IconButton >
                        <StyleBadge badgeContent={nbFavorites? nbFavorites: 0} color="secondary">
                            <div onClick={(e)=>{e.preventDefault();
                                history.push('/favorites')}}>
                                <Heart style={{fill: '#6B0C72', width: 18, height: 18}}/>
                            </div>
                        </StyleBadge>
                    </IconButton>
                    <IconButton>
                        <StyleBadge badgeContent={nbCart? nbCart: 0} color="secondary">
                            <ShoppingCartIcon style={{width: 25, height: 25}} onClick={(e)=>{e.preventDefault();
                            history.push('/cart')}}/>
                        </StyleBadge>
                    </IconButton>
                </div>
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
                                         discount={products[product]['discount']}
                                         description={products[product]['description']}/>
                        </div>
                    ))}
                </div>
                :
                <div className="spinner_loader">
                    <LoaderIcon type="cylon" color="#6B0C72"/>
                </div>
            }

            {showDrawerService&&<HomeDrawerContent onClose={() => setShowDrawerService(false) }
                                            name={services} />}
        </div>
    )

}

export default Home;
