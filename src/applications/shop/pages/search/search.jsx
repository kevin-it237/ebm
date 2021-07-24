import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import InputSearch from "../../../../app/components/inputs/input.search/input.search";
import './search.scss' 
import img from "../../../../assets/images/ebm.svg"
import config from '../../../../config/index'
import axios from "axios";
import {toast} from "react-toastify";

const Search = () => {

    const history = useHistory();
    const [allSearch, setAllSearch] = useState("");
    const [name, setName] = useState("");

    useEffect(()=>{
        searchFilter(name);
    }, [name]);

    const searchFilter = useCallback((name)=>{
        if (name.length !== 0){
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
        }
    }, [name]);

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
            <div className="search-results">
                {Object.keys(allSearch).map((search, index)=>(
                    <div key={index} className="result">
                        <img src={allSearch[search]['logo']} alt={allSearch[search]['username']} />
                        <div>
                            <h4 className="name">{allSearch[search]['username']}</h4>
                            <p className="address">{allSearch[search]['address']}</p>
                        </div>
                    </div>
                ))}
            </div>
            
        </div>
    )
}

export default Search;