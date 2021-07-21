import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import InputSearch from "../../../../app/components/inputs/input.search/input.search";
import ProductItem from '../../components/product.item/product.item';
import Menu from "../../../../assets/icons/menu.svg"
import avatar from "../../../../assets/images/avatar.png"
import './home.scss' 
import HomeDrawerContent from "../../components/home.drawer.content/home.drawer.content"
import axios from "axios";
import config from "../../../../config/index";


const Home = () => {
    const history = useHistory();
    const [showDrawer, setShowDrawer] = useState(false)
    const [products, setProduct] = useState("");
    const [services, setService] = useState("");

    const openDrawer = () => {
        setShowDrawer(!showDrawer)
    }

    useEffect(()=>{
        getAllProduct();
        getAllService();
    }, []);

    const getAllProduct = ()=> {
        axios.get(config.baseUrl + '/product/index')
            .then(response => {
                setProduct(Object.values(response.data.message));
            }).catch(err => {
            notifyFailed("Verifier votre connexion")
        })
    }

    const getAllService = ()=> {
        axios.get(config.baseUrl + '/service/index')
            .then(response => {
                setService(Object.values(response.data.message));
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
                <InputSearch onClick={() => history.push('/search')} placeholder="Type something to search here..." />
            </div>

            <ToastContainer/>
            <div className="section-title">
                <h2>Services</h2>
                <span></span>
            </div>
            
            <div className="services-wrapper">
                {Object.keys(services).map((service, index)=>(
                    <div key={index} className="service-item service-item--1">
                        <div className="service-title">
                            <h2>{services[service]['name_fr']}</h2>
                            <span></span>
                        </div>
                    </div>
                ))}
                <div className="service-item service-item--2">
                    <div className="service-title">
                        <h2>Cheveux</h2>
                        <span></span>
                    </div>
                </div>
            </div>

            <div className="section-title">
                <h2>Produits</h2>
                <span></span>
            </div>
            
            <div className="products-wrapper">
                {Object.keys(products).map((product, index)=>(
                    <div key={index}>
                        <ProductItem name={products[product]['name_fr']} price={products[product]['price']} discount={products[product]['discount']}/>
                    </div>
                ))}
            </div>
        
            {showDrawer&&<HomeDrawerContent onClose={() => openDrawer(false)} />}
        </div>
    )
  
}

export default Home;