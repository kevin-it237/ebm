import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux'
import {Link, useHistory} from "react-router-dom";
import InputSearch from "../../../../app/components/inputs/input.search/input.search";
import './search.scss' 
import img from "../../../../assets/images/ebm.svg"
import config from '../../../../config/index'
import axios from "axios";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import logoLink from "../../../../config/logo.link";
import LoaderIcon from "react-loader-icon";
import {ReactComponent as Back} from "../../../../assets/icons/back.svg";
const Search = () => {

    const history = useHistory();
    const [allSearch, setAllSearch] = useState("");
    const [loading,setLoading] =useState(false);
    const [name, setName] = useState("");
    const user = useSelector((state)=>state.user.payload)

    console.log(allSearch)

    useEffect(()=>{
    }, []);
    const searchFilter = useCallback((name)=>{
        setLoading(true)
        if (name.length !== 0){
            if (user.role !== 'INSTITUTION'){
                axios.post(config.baseUrl+'/institution/search', {name})
                    .then(response=>{
                        setAllSearch(response.data);
                        setLoading(false);
                    })
                    .catch(error=>{
                        setLoading(false);
                    });
            }
            else{
                axios.post(config.baseUrl+'/expert/search', {name})
                    .then(response=>{
                        setAllSearch(response.data);
                        setLoading(false);
                    })
                    .catch(error=>{
                        setLoading(false);
                    });
            }
        }else {
            setAllSearch("");
        }
    }, [name]);

    return (
        <div id="search">
            <div className="search">
                <div className="header-title">
                    <Back onClick={() => history.goBack()}/>
                    <h2>{user.role !== 'INSTITUTION' ? 'Institutions': 'Experts'}</h2>
                </div>
                <InputSearch placeholder={"Recherchez "+ (user.role==='INSTITUTION' ? "un expert..." : "une institution...")} onFocus value={name} onChange={(event)=>{setName(event.target.value);
                searchFilter(event.target.value)}} name="name"/>
            </div>

            <div className="section-title">
                {user.role !== 'INSTITUTION' ? <h2>{allSearch.length} {allSearch.length < 2 ? "Institution trouvée" : "Institutions trouvées"}</h2>
                : <h2>{allSearch.length} {allSearch.length < 2 ? "Expert trouvé" : "Experts trouvés"}</h2>}
                <span></span>
            </div>
            {!loading && allSearch.length !==0 && name &&
                <div className="search-results">
                    {Object.keys(allSearch).map((search, index)=>(
                        <Link to={user.role !=='INSTITUTION' ? "/institute/" + allSearch[search]['username']: "/expert/" + allSearch[search]['username']} key={index} className="result" >
                            <img src={logoLink.link+allSearch[search]['logo']} alt={allSearch[search]['username']} />
                            <div>
                                <h4 className="name">{allSearch[search]['username']}</h4>
                                <p className="address">{allSearch[search]['address']}</p>
                            </div>
                        </Link>
                    ))}
                </div>}

            {!loading && allSearch.length===0 && <div>
                <center>
                    <br/>
                    <img src={require("../../../../assets/images/telescope.png").default}/>
                    {user.role === 'INSTITUTION' ?<p>{name !== "" ? "Aucun resultat trouvé" : "Rechercher un expert"}</p>:
                        <p>{name !== "" ? "Aucun resultat trouvé" : "Rechercher une institution"}</p>}
                </center>
            </div>}
            {loading && <div>
                <center>
                    <br/>
                    <LoaderIcon type={"cylon"} color={"#6B0C72"}/>
                </center>
            </div>}

        </div>
    )
}

export default Search;