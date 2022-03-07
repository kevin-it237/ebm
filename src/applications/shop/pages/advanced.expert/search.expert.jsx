import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import InputSearch from "../../../../app/components/inputs/input.search/input.search";
import './search.expert.scss'
import img from "../../../../assets/images/ebm.svg"
import config from '../../../../config/index'
import axios from "axios";
import {toast} from "react-toastify";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import ExpertItem from "../../components/expert.item/expert.item";
import LoaderIcon from "react-loader-icon";
import SwipeToDelete from 'react-swipe-to-delete-component';
import {useDispatch} from "react-redux";

const SearchExpert = () => {

    const history = useHistory();
    const dispatch = useDispatch()
    const [allSearch, setAllSearch] = useState([]);
    const [leng, setLeng] = useState(0);
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(()=>{
        searchFilter(name);
        dispatch({
            type: 'ADD_TO_PATH',
            payload: history.location.pathname
        })
    }, [name]);

    const searchFilter = useCallback((name)=>{
       if (name.length !== 0){
           setLoading(true)
            axios.post(config.baseUrl+'/expert/search', {name : name})
                .then(response=>{
                    console.log(response.data)
                    setLeng(response.data.message.length)
                    setAllSearch(response.data.message.data);
                    setLoading(false)
                })
                .catch(error=>{
                    setLoading(false)
                });
        }else {
            setAllSearch([]);
            setName("")
            setLeng(0)
        }
    }, [name]);

    console.log(allSearch)

    return (
        <div id="search" className="product-search">
            <div className="search">
                <h2>Experts</h2>
                <InputSearch placeholder="Entrez un service..." onFocus value={name} onChange={(event)=>{setName(event.target.value);
                searchFilter(event.target.value)}} name="name"/>
            </div>

            <div className="section-title">
                {allSearch && leng!==0&&<h2>{leng} {leng < 2 ? "Expert trouvé":"Experts trouvés"}</h2>}
                {leng===0&&<h2>Recherchez un Expert</h2>}
                <span></span>
            </div>
            {
                !loading && allSearch.length !==0 &&
                <div className="products-wrapper">
                    {Object.keys(allSearch).map((item,index)=>(

                        <div key={index}>
                            <ExpertItem firstname={allSearch[item]['firstname']} lastname={allSearch[item]['lastname']} country={allSearch[item]['country']}
                                        username={allSearch[item]['username']} id={allSearch[item]['id']} image={allSearch[item]['logo']} rate={allSearch[item]['rate']}/>
                        </div>

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
                        <p>{name.length !== 0 ? "Aucun resultat trouve" : "Rechercher un expert"}</p>
                    </center>
                </div>
            }


        </div>
    )
}

export default SearchExpert;
