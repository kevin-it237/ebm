import React, { useState, useEffect } from 'react';
import { useHistory} from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
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
import Modal from "../../../../app/components/modal/modal";
import Charge from "../../../../app/components/charge/charge";
import { ReactComponent as Heart } from "../../../../assets/icons/heartClick.svg";
import Slider from "react-slick";
import Service from "./service.item";
import {getToken, getUser, isMobile} from "../../../../config/helpers";


const Home = () => {
    const history = useHistory();

    
    const dispatch = useDispatch()
    const drawer = useSelector(state=>state.drawer.payload)
    const user = useSelector((state) => state.user.payload)
    const parent_serv = useSelector((state) => state.service.service)
    const prods = useSelector((state) => state.service.product)
    const nbFavorites = useSelector((state) => state.product.payload)
    const nbCart = useSelector((state) => state.cart.payload)
    const addCart = useSelector((state) => state.cart.loader)
    const addFavorite = useSelector((state) => state.product.loader)
    const [showDrawerService, setShowDrawerService] = useState(false)
    const [products, setProduct] = useState("");
    const [services, setService] = useState("");
    const [parent_services, setParent_Service] = useState("");
    const [chargeService, setChargeService] = useState(false);
    const [chargeProduct, setChargeProduct] = useState(false);
    const [favorites, setFavorites] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null);

    const settings = {
        speed: 500,
        infinite: false,
        slidesToShow: isMobile()?1.3:2.6,
        slidesToScroll: 1,
        initialSlide: 0,
    };

    const StyleBadge = withStyles((theme) => ({
        badge: {
            fontSize: 11,
        },
    }))(Badge)

    const openDrawer = (e) => {
        e.preventDefault()
        if(window.setDrawerOpen){
            console.log('yujfddu')
            window.setDrawerOpen(true)
            dispatch({
                type: 'ADD_TO_REDUCER',
                payload: true
            })
        }
    }

    console.log(drawer)

    useEffect(() => {
        getAllProduct();
        getAllParentService();
        getFavorites();
        dispatch({
            type: 'ADD_TO_PATH',
            payload: history.location.pathname
        })
    }, []);

    const getAllProduct = () => {
        setChargeProduct(true)
        axios.get(config.baseUrl + '/product/index')
            .then(response => {
                setProduct(Object.values(response.data.message));
                setChargeProduct(false)
                dispatch({
                    type: 'ADD_ALL_PRODUCT',
                    product: response.data.message
                })
            }).catch(error => {
                if (error.response) {
                    // Request made and server responded
                    console.log(error.response.data);
                    console.log(error.response.data.message);
                    if(error.response.data.message.startsWith("Attempt to read property \"email_verified_at\" on null")){
                        console.log("Ce compte n'existe pas !")
                    }else if ("Mot de passe ne correspond pas"){
                        console.log("Mot passe ou Role incorrect !")
                    }
                    console.log(error.response.status);
                    console.log(error.response.headers);
                } else if (error.request) {
                    // The request was made but no response was received
                    console.log(error.request);
                    setErrorMessage("Erreur de connexion !");

                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log('Error', error.message);
                }
                notifyFailed("Verifier votre connexion")
                setChargeProduct(false)
        })
    }

    const getAllParentService = () => {
        setChargeService(true)
        axios.get(config.baseUrl + '/parent_service/index')
            .then(response => {
                setParent_Service(Object.values(response.data.message));
                dispatch({
                    type: 'ADD_ALL_PARENT_SERVICE',
                    service: response.data.message
                })
                setChargeService(false)
            }).catch(error => {
                notifyFailed("Verifier votre connexion")
                setChargeService(false)
                if (error.response) {
                    // Request made and server responded
                    console.log(error.response.data);
                    console.log(error.response.data.message);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                } else if (error.request) {
                    // The request was made but no response was received
                    console.log(error.request);
                    setErrorMessage("Erreur de connexion !");

                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log('Error', error.message);
                }
        })
    }

    const getFavorites = () => {
        axios.get(config.baseUrl + '/user/favorites')
            .then(response => {
                setFavorites(response.data.message);
            }).catch(err => {
                console.log(err)
        })
    }

    const notifyFailed = (err) => {
        toast.error(err)
    }

    return (
        <>
            <div id="home">
                <div id={isMobile() ? "header" : "header-web"}>
                    <img onClick={openDrawer} className="menu" src={Menu} alt="ok"/>
                    <div className="favorite-shop">
                        <IconButton>
                            <StyleBadge badgeContent={nbFavorites ? nbFavorites : 0} color="secondary">
                                <div onClick={(e) => {
                                    e.preventDefault();
                                    history.push('/favorites')
                                }}>
                                    <Heart style={{fill: '#6B0C72', width: 18, height: 16}}/>
                                </div>
                            </StyleBadge>
                        </IconButton>
                        <IconButton>
                            <StyleBadge badgeContent={nbCart ? nbCart : 0} color="secondary">
                                <ShoppingCartIcon style={{width: 25, height: 25}} onClick={(e) => {
                                    e.preventDefault();
                                    history.push('/cart')
                                }}/>
                            </StyleBadge>
                        </IconButton>
                    </div>
                </div>
                {!isMobile()&&<div className="search-web">
                    <InputSearch onClick={() => history.push('/search')}
                                 placeholder={user.roles === 'INSTITUTION' ? "Recherchez un expert..." : "Recherchez une institution..."}/>
                </div>}
                {isMobile()&&<div className="search">
                    <InputSearch onClick={() => history.push('/search')}
                                 placeholder={user.roles === 'INSTITUTION' ? "Recherchez un expert..." : "Recherchez une institution..."}/>
                </div>}

                <ToastContainer/>
                <div className="section-title">
                    <h2>Catégories de Services</h2>
                    <span></span>
                </div>
                {parent_serv.length !== 0 &&
                    <Slider {...settings} className="services-wrapper">
                        {Object.keys(parent_serv).map((parent_service, index) => (
                            <div key={index} onClick={() => {
                                setShowDrawerService(true);
                                setService(parent_serv[parent_service]['name'])
                            }}>
                                <Service name={parent_serv[parent_service].name}/>
                            </div>
                        ))}
                    </Slider>
                }
                {parent_serv.length === 0 && chargeService&&
                    <div className="spinner_loader">
                        <LoaderIcon type="cylon" color="#6B0C72"/>
                    </div>
                }
                {parent_serv.length === 0 && !chargeService&& !errorMessage&&
                    <center>
                        <br/>
                        <img src={require("../../../../assets/images/telescope.png").default}/>
                        <p>Aucun Service</p>
                    </center>
                }
                {parent_serv.length === 0 && !chargeService&&errorMessage&&
                    <center>
                        <br/>
                        <img src={require("../../../../assets/images/telescope.png").default}/>
                        <p>{errorMessage}</p>
                    </center>
                }

                <div className="section-title">
                    <h2>Produits</h2>
                    <span></span>
                </div>
                {prods.length !== 0 &&
                    <div className="products-wrapper">
                        {Object.keys(prods).map((product, index) => (
                            <div key={index}>
                                <ProductItem id={prods[product]['id']}
                                             name={prods[product]['name_fr']}
                                             price={prods[product]['price']}
                                             discount={prods[product]['discount']}
                                             description={prods[product]['description']}
                                             image={prods[product]['image']}/>
                            </div>
                        ))}
                    </div>
                }
                {prods.length===0&&chargeProduct&&
                    <div className="spinner_loader">
                        <LoaderIcon type="cylon" color="#6B0C72"/>
                    </div>
                }
                {prods.length===0&&!chargeProduct&& !errorMessage&&
                    <center>
                        <br/>
                        <img src={require("../../../../assets/images/telescope.png").default}/>
                        <p>Aucun Produit</p>
                    </center>
                }
                {prods.length===0&&!chargeProduct&& errorMessage&&
                    <center>
                        <br/>
                        <img src={require("../../../../assets/images/telescope.png").default}/>
                        <p>{errorMessage}</p>
                    </center>
                }
                {
                    addCart&& <Charge>
                        <LoaderIcon type="cylon" color="#6B0C72"/>
                    </Charge>
                }
                {
                    addFavorite && <Charge>
                        <LoaderIcon type="cylon" color="#6B0C72"/>
                    </Charge>
                }

                {showDrawerService && <HomeDrawerContent onClose={() => setShowDrawerService(false)}
                                                         name={services}/>}
            </div>
        </>
    )

}

export default Home;
