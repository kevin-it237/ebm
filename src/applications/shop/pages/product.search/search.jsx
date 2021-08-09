import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import InputSearch from "../../../../app/components/inputs/input.search/input.search";
import './search.scss'
import img from "../../../../assets/images/ebm.svg"
import config from '../../../../config/index'
import axios from "axios";
import {toast} from "react-toastify";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import ProductItem from "../../components/product.item/product.item";
import LoaderIcon from "react-loader-icon";

const Search = () => {

    const history = useHistory();
    const [allSearch, setAllSearch] = useState([]);
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(()=>{
        searchFilter(name);
    }, [name]);

    const searchFilter = useCallback((name)=>{
       if (name.length !== 0){
           setLoading(true)
            axios.post(config.baseUrl+'/user/product/search', {name})
                .then(response=>{
                    setAllSearch(response.data.message);
                    setLoading(false)
                })
                .catch(error=>{
                    setLoading(false)
                });
        }else {
            setAllSearch("");
        }
    }, [name]);

    return (
        <div id="search" className="product-search">
            <div className="search">
                <h2>Produits</h2>
                <InputSearch placeholder="Recherchez un produit..." onFocus value={name} onChange={(event)=>{setName(event.target.value);
                searchFilter(event.target.value)}} name="name"/>
            </div>

            <div className="section-title">
                <h2>{allSearch.length} {allSearch.length < 2 ? "Produit trouvé":"Produits trouvés"}</h2>
                <span></span>
            </div>
            {
                !loading && allSearch.length !==0 &&
                <div className="products-wrapper">
                    {Object.keys(allSearch).map((item,index)=>(
                        <div key={index}>
                            <ProductItem price={allSearch[item]['price']} discount={allSearch[item]['discount']}
                                         name={allSearch[item]['name_fr']} id={allSearch[item]['id']}/></div>
                    ))}
                </div>
            }
            {
                loading &&
                <div className="spinner_load_search">
                    <LoaderIcon type="cylon" color="#6B0C72"/>
                </div>
            }
            {
                !loading && allSearch.length === 0 &&
                <div>
                    <center>
                        <br/>
                        <img src={require("../../../../assets/images/telescope.png").default}/>
                        <p>{name.length !== 0 ? "Aucun resultat trouve" : "Rechercher un produit"}</p>
                    </center>
                </div>
            }


        </div>
    )
}

export default Search;
