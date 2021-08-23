import React, {useCallback, useEffect, useState} from 'react';
import {useSelector} from "react-redux";
import {useHistory} from 'react-router-dom';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import InputSearch from "../../../../app/components/inputs/input.search/input.search";
import ProductItem from '../../components/product.item/product.item';
import './favorites.scss'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import axios from "axios";
import config from "../../../../config/index";
import LoaderIcon from "react-loader-icon";
import Modal from "../../../../app/components/modal/modal";
import img from "../../../../assets/images/mansory.png";


const Favorites = () => {
    const like = useSelector(state => state.product.payload)
    const addCart = useSelector(state => state.cart.loader)
    const addCartMessage = useSelector((state) => state.cart.message)
    useEffect(() => {
        searchFilter(name);
        getFavorites();
        if (favorites.length !== like) {
            getFavorites();
        }
    }, [like])

    const [favorites, setFavorites] = useState([]);
    //const [addCart, setAddCart] = useState(false);
    const [loading, setLoading] = useState(false);
    const [allSearch, setAllSearch] = useState([]);
    const [sect, setSect] = useState(false);
    const [name, setName] = useState([]);

    const getFavorites = () => {
        setLoading(true)
        axios.get(config.baseUrl + '/user/favorites/product')
            .then(response => {
                setFavorites(response.data.message);
                setLoading(false)
            }).catch(err => {
            notifyFailed(err)
            setLoading(false)
        })
    }

    const searchFilter = useCallback((name) => {
        if (name.length !== 0) {
            setLoading(true)
            setSect(true)
            axios.post(config.baseUrl + '/user/product/favorites/search', {name})
                .then(response => {
                    setAllSearch(response.data.message)
                    setLoading(false)
                })
                .catch(error => {
                    setLoading(false)
                });
        } else {
            setAllSearch("");
            setSect(false)
        }
    }, [name]);

    const notifyFailed = (err) => toast.error(err);

    return (
        <div id="search" className="product-search">
            <ToastContainer/>
            <div className="search">
                <h2>Vos Favoris</h2>
                {/*<InputSearch placeholder="Recherchez un produit..." onFocus name="name" onChange={(event) => {
                    setName(event.target.value);
                    searchFilter(event.target.value)
                }}/>*/}
            </div>

            {<div className="section-title">
                <h2>{favorites.length} {favorites.length === 0 ? "Aucun Favoris" : "Favoris"}</h2>
                <span></span>
            </div>}
            {
                !loading && favorites && !sect &&
                <div className="products-wrapper">
                    {Object.keys(favorites).map((item, index) => (
                        <div key={index}>
                            <ProductItem price={favorites[item]['price']} discount={favorites[item]['discount']}
                                         name={favorites[item]['name_fr']} id={favorites[item]['id']}/></div>
                    ))}
                </div>
            }
            {
                addCart && <Modal>
                    <LoaderIcon type="cylon" color="#6B0C72"/>
                </Modal>
            }
            {/*
                !addCart&&addCartMessage&&<Modal>
                    <center>{addCartMessage}</center>
                </Modal>
            */}
            {/*
                name && allSearch &&sect&&
                <div className="products-wrapper">
                    {Object.keys(allSearch).map((item,index)=>(
                        <div key={index}>
                            <ProductItem price={allSearch[item]['price']} discount={allSearch[item]['discount']}
                                         name={allSearch[item]['name_fr']} id={allSearch[item]['id']}/></div>
                    ))}
                </div>
            */}
            {
                loading &&
                <div className="spinner_load_search">
                    <LoaderIcon type="cylon" color="#6B0C72"/>
                </div>
            }
            {
                !loading && favorites.length === 0 &&
                <div>
                    <center>
                        <br/>
                        <img src={require("../../../../assets/images/telescope.png").default}/>
                        <p>Aucun Favoris</p>
                    </center>
                </div>
            }
            {
                !loading && sect && allSearch.length === 0 && favorites.length !== 0 &&
                <div>
                    <center>
                        <br/>
                        <img src={require("../../../../assets/images/telescope.png").default}/>
                        <p>Pas de favoris avec ce nom</p>
                    </center>
                </div>
            }


        </div>
    )

}

export default Favorites;
