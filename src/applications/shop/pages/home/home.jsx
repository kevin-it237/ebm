import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import InputSearch from "../../../../app/components/inputs/input.search/input.search";
import ProductItem from '../../components/product.item/product.item';
import Menu from "../../../../assets/icons/menu.svg"
import avatar from "../../../../assets/images/avatar.png"
import './home.scss' 
import HomeDrawerContent from "../../components/home.drawer.content/home.drawer.content"


const Home = () => {
    const history = useHistory()
    const [showDrawer, setShowDrawer] = useState(false)

    const openDrawer = () => {
        setShowDrawer(!showDrawer)
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

            <div className="section-title">
                <h2>Services</h2>
                <span></span>
            </div>
            
            <div className="services-wrapper">
                <div className="service-item service-item--1">
                    <div className="service-title">
                        <h2>Produits</h2>
                        <span></span>
                    </div>
                </div>
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
                <ProductItem />
                <ProductItem />
                <ProductItem />
                <ProductItem />
                <ProductItem />
                <ProductItem />
            </div>
        
            {showDrawer&&<HomeDrawerContent onClose={() => openDrawer(false)} />}
        </div>
    )
  
}

export default Home;