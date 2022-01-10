import React, {useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
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
    const history = useHistory()
    const dispatch = useDispatch()
    const like = useSelector(state => state.product.payload)
    const fav = useSelector(state => state.cart.favorite)
    console.log(fav)
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
    const [loading, setLoading] = useState(false);
    const [allSearch, setAllSearch] = useState([]);
    const [sect, setSect] = useState(false);
    const [name, setName] = useState([]);

    const getFavorites = () => {
        setLoading(true)
        axios.get(config.baseUrl + '/user/favorites/product')
            .then(response => {
                setFavorites(response.data.message);
                dispatch({
                    type: 'ALL_FAVORITE_PRODUCT',
                    favorite : response.data.message
                })
                setLoading(false)
            }).catch(err => {
            notifyFailed(err)
            setLoading(false)
        })
    }

    console.log(favorites)
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
            <div className="search-favorites">
                <img className="left-back" onClick={() => history.goBack()} src={require('../../../../../src/assets/icons/left_arrow_30px.png').default}/>
                <h2>Vos Favoris</h2>
            </div>

            {<div className="section-title">
                <h2>{fav.length} {fav.length === 0 ? "Aucun Favoris" : "Favoris"}</h2>
                <span></span>
            </div>}
            {
                fav.length !==0 && !sect &&
                <div className="products-wrapper">
                    {Object.keys(fav).map((item, index) => (
                        <div key={index}>
                            <ProductItem price={fav[item]['price']} discount={fav[item]['discount']}
                                         name={fav[item]['name_fr']} id={fav[item]['id']} image={fav[item]['image']}/></div>
                    ))}
                </div>
            }
            {
                addCart && <Modal>
                    <LoaderIcon type="cylon" color="#6B0C72"/>
                </Modal>
            }
            {
                loading && fav.length===0&&
                <div className="spinner_load_search">
                    <LoaderIcon type="cylon" color="#6B0C72"/>
                </div>
            }
            {
                !loading && fav.length === 0 &&
                <div>
                    <center>
                        <br/>
                        <img src={require("../../../../assets/images/telescope.png").default}/>
                        <p>Aucun Favoris</p>
                    </center>
                </div>
            }


        </div>
    )

}

export default Favorites;
