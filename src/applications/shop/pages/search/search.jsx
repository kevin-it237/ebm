import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { Link } from "react-router-dom";
import { useHistory } from 'react-router-dom';
import InputSearch from "../../../../app/components/inputs/input.search/input.search";
import './search.scss' 
import img from "../../../../assets/images/ebm.svg"
import config from '../../../../config/index'
import axios from "axios";
import {toast} from "react-toastify";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";

const Search = () => {

    const dispatch = useDispatch();
    const selesct = useSelector((state)=>state.product.payload);
    const history = useHistory();
    const [allSearch, setAllSearch] = useState("");
    const [name, setName] = useState("");

    useEffect(()=>{
        searchFilter(name);
    }, []);

    const searchFilter = useCallback((name)=>{
        if (name.length !== 0){
            axios.post(config.baseUrl+'/institution/search', {name})
                .then(response=>{
                    setAllSearch(response.data);
                })
                .catch(error=>{
                });
        }else {
            setAllSearch("");
        }
    }, [name]);

    const onHandleClick = (event) =>{
        event.preventDefault();
        console.log(selesct)
    };

    const getIdentity = (name, id) =>{
        dispatch ({
            type: 'SEARCH_INSTITUTE',
            payload: {
                'name': name,
            'identity': id}
        });
    }

    const notifyFailed = (err)=>{
        toast.error(err)
    }
    return (
        <div id="search">
            <div className="search">
                <h2>Institutions</h2>
                <InputSearch placeholder="Recherchez une institution..." onFocus value={name} onChange={(event)=>{setName(event.target.value);
                searchFilter(event.target.value)}} name="name"/>
            </div>

            <div className="section-title">
                <h2>{allSearch.length} {allSearch.length < 2 ? "Institution trouvée":"Institutions trouvées"}</h2>
                <span></span>
            </div>
            {allSearch.length !==0 ?
            <div className="search-results">
                {Object.keys(allSearch).map((search, index)=>(
                    <Link to={"/institute/" + allSearch[search]['username']} key={index} className="result" >
                        <img src={allSearch[search]['logo']} alt={allSearch[search]['username']} />
                        <div>
                            <h4 className="name">{allSearch[search]['username']}</h4>
                            <p className="address">{allSearch[search]['address']}</p>
                        </div>
                    </Link>
                ))}
            </div>
                :<div className="spinner_load_search">
                    <Loader type="Circles" height={70} width={70} color="#6B0C72"/>
                </div>
            }
            
        </div>
    )
}

export default Search;