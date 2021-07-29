import React, { useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import InputSearch from "../../../../app/components/inputs/input.search/input.search";
import ProductItem from '../../components/product.item/product.item';
import Menu from "../../../../assets/icons/menu.svg"
import avatar from "../../../../assets/images/avatar.png"
import './home.scss'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";
import HomeDrawerContent from "../../components/home.drawer.content/home.drawer.content"
import axios from "axios";
import config from "../../../../config/index";
import { SnackbarProvider } from 'material-ui-toast';


const Home = () => {
    const history = useHistory();
    const [showDrawer, setShowDrawer] = useState(false)
    const [products, setProduct] = useState("");
    const [services, setService] = useState("");
    const [parent_services, setParent_Service] = useState("");

    const openDrawer = () => {
        setShowDrawer(!showDrawer)
    }

    useEffect(()=>{
        getAllProduct();
        getAllParentService();
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

    const notifyFailed = (err)=>{
        toast.error(err)
    }

    return (
        <div id="home">
            <div id="header">
                <img onClick={openDrawer} className="menu" src={Menu} alt="" />
                <img className="avatar" src={avatar} alt="" />
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
                    <div key={index} className="service-item service-item--1" onClick={()=>{openDrawer(); setService(parent_services[parent_service]['name'])}}>
                        <div className="service-title">
                            <h2>{parent_services[parent_service]['name']}</h2>
                            <span></span>
                        </div>
                    </div>
                ))}
            </div>
                :
            <div className="services-wrapper">
                <div className="service-item service-item--2">
                    <div className="service-title">
                        <h2>Cheveux</h2>
                        <span></span>
                    </div>
                </div>
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
                    <Loader type="Circles" height={70} width={70} color="#6B0C72"/>
                </div>
            }
        
            {showDrawer&&<HomeDrawerContent onClose={() => openDrawer(false) }
                                            name={services} />}
        </div>
    )
  
}

export default Home;