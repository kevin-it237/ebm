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


const Home = () => {
    const history = useHistory();
    const dispatch = useDispatch()
    const user = useSelector((state) => state.user.payload)

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

    const settings = {
        speed: 500,
        infinite: false,
        slidesToShow: 1.15,
        slidesToScroll: 1,
        initialSlide: 0,
    };

    const StyleBadge = withStyles((theme) => ({
        badge: {
            fontSize: 11,
        },
    }))(Badge)

    const openDrawer = () => {
        if (window.setDrawerOpen) {
            window.setDrawerOpen(true)
        }
    }

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
            }).catch(err => {
            notifyFailed("Verifier votre connexion")
            setChargeProduct(false)
        })
    }

    const getAllParentService = () => {
        setChargeService(true)
        axios.get(config.baseUrl + '/parent_service/index')
            .then(response => {
                setParent_Service(Object.values(response.data.message));
                setChargeService(false)
            }).catch(err => {
            notifyFailed("Verifier votre connexion")
            setChargeService(false)
        })
    }

    const getFavorites = () => {
        axios.get(config.baseUrl + '/user/favorites')
            .then(response => {
                setFavorites(response.data.message);
            }).catch(err => {
            notifyFailed(err)
        })
    }

    const notifyFailed = (err) => {
        toast.error(err)
    }

    console.log(products)

    return (
        <>
            <div id="home">
                <div id="header">
                    <img onClick={openDrawer} className="menu" src={Menu} alt=""/>
                    <div className="favorite-shop">
                        <IconButton>
                            <StyleBadge badgeContent={nbFavorites ? nbFavorites : 0} color="secondary">
                                <div onClick={(e) => {
                                    e.preventDefault();
                                    history.push('/favorites')
                                }}>
                                    <Heart style={{fill: '#6B0C72', width: 18, height: 18}}/>
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
                <div className="search">
                    <InputSearch onClick={() => history.push('/search')}
                                 placeholder={user.roles === 'INSTITUTION' ? "Recherchez un expert..." : "Recherchez une institution..."}/>
                </div>

                <ToastContainer/>
                <div className="section-title">
                    <h2>Catégories de Services</h2>
                    <span></span>
                </div>
                {parent_services.length !== 0 && !chargeService &&
                    <Slider {...settings} className="services-wrapper">
                        {Object.keys(parent_services).map((parent_service, index) => (
                            <div key={index} onClick={() => {
                                setShowDrawerService(true);
                                setService(parent_services[parent_service]['name'])
                            }}>
                                <Service name={parent_services[parent_service].name}/>
                            </div>
                        ))}
                    </Slider>
                }
                {parent_services.length === 0 && chargeService&&
                    <div className="spinner_loader">
                        <LoaderIcon type="cylon" color="#6B0C72"/>
                    </div>
                }
                {parent_services.length === 0 && !chargeService&&
                    <center>
                        <br/>
                        <img src={require("../../../../assets/images/telescope.png").default}/>
                        <p>Aucun Service</p>
                    </center>
                }

                <div className="section-title">
                    <h2>Produits</h2>
                    <span></span>
                </div>
                {products.length !== 0 && !chargeProduct &&
                    <div className="products-wrapper">
                        {Object.keys(products).map((product, index) => (
                            <div key={index}>
                                <ProductItem id={products[product]['id']}
                                             name={products[product]['name_fr']}
                                             price={products[product]['price']}
                                             discount={products[product]['discount']}
                                             description={products[product]['description']}
                                             image={products[product]['image']}/>
                            </div>
                        ))}
                    </div>
                }
                {products.length===0&&chargeProduct&&
                    <div className="spinner_loader">
                        <LoaderIcon type="cylon" color="#6B0C72"/>
                    </div>
                }
                {products.length===0&&!chargeProduct&&
                    <div className="spinner_loader">
                        <br/>
                        <img src={require("../../../../assets/images/telescope.png").default}/>
                        <p>Aucun Produit</p>
                    </div>
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
