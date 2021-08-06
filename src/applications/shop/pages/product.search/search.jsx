import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import InputSearch from "../../../../app/components/inputs/input.search/input.search";
import './search.scss'
import img from "../../../../assets/images/ebm.svg"
import config from '../../../../config/index'
import axios from "axios";
import {toast} from "react-toastify";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";
import ProductItem from "../../components/product.item/product.item";

const Search = () => {

    const history = useHistory();
    const [allSearch, setAllSearch] = useState([2,3,3,4,3,56,35]);
    const [name, setName] = useState("");

    useEffect(()=>{
        searchFilter(name);
    }, [name]);

    const searchFilter = useCallback((name)=>{
       /* if (name.length !== 0){
            axios.post(config.baseUrl+'/institution/search', {name})
                .then(response=>{
                    setAllSearch(response.data);
                    console.log(response.data)
                })
                .catch(error=>{
                    console.log("error "+error)
                });
        }else {
            setAllSearch("");
        }*/
    }, [name]);

    const notifyFailed = (err)=>{
        toast.error(err)
    }
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
            {allSearch.length !==0 ?
                <div className="products-wrapper">
                {[{
                    discount:20,
                    name:"Babayaga Product",
                    price:3000
                },{
                    discount:20,
                    name:"Babayaga Product",
                    price:3000
                },].map((item,index)=>(
                    <div key={index}>
                        <ProductItem {...item}/></div>
                ))}
            {/*    {Object.keys(allSearch).map((search, index)=>(
                    <div key={index} className="result">
                        <img src={allSearch[search]['logo']} alt={allSearch[search]['username']} />
                        <div>
                            <h4 className="name">{allSearch[search]['username']}</h4>
                            <p className="address">{allSearch[search]['address']}</p>
                        </div>
                    </div>
                ))}*/}
            </div>
                :<div className="spinner_load_search">
                    <Loader type="Circles" height={70} width={70} color="#6B0C72"/>
                </div>
            }

        </div>
    )
}

export default Search;
