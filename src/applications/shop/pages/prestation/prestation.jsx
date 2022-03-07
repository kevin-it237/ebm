import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import InputSearch from "../../../../app/components/inputs/input.search/input.search";
import './prestation.scss'
import config from '../../../../config/index'
import axios from "axios";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import PrestationItem from "../../components/prestation.item/prestation.item";
import LoaderIcon from "react-loader-icon";
import {useDispatch} from "react-redux";

import {isMobile} from "../../../../config/helpers"

const Prestation = () => {

    const history = useHistory();
    const dispatch = useDispatch()
    const [allPrestation, setAllPrestation] = useState([]);
    const [allSearch, setAllSearch] = useState([]);
    const [leng, setLeng] = useState(0);
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(()=>{
        getPrestation()
        dispatch({
            type: 'ADD_TO_PATH',
            payload: history.location.pathname
        })
    }, [name]);

    const getPrestation = ()=>{
        setLoading(true)
        axios.get(config.baseUrl +'/prestations')
        .then(res=>{
            console.log(res.data.message)
            setAllPrestation(res.data.message)
            setLoading(false)
        })
        .catch(err=>{
            console.log(err)
            setLoading(false)
        })
    }

    const searchFilter = useCallback((name)=>{
       if (name.length !== 0){
           setLoading(true)
            axios.post(config.baseUrl+'/prestations/search', {name : name})
                .then(response=>{
                    console.log(response.data.message)
                    setAllSearch(response.data.message);
                    setLoading(false)
                })
                .catch(error=>{
                    setLoading(false)
                });
        }else {
            setAllSearch([]);
            setName("")
        }
    }, [name]);

    console.log(allSearch)

    return (
        <div id="search" className="product-search">
            <div className="search">
                {isMobile()&&<div className="search-prestation">
                    <img className="left-back" onClick={() => history.goBack()} src={require('../../../../../src/assets/icons/left_arrow_30px.png').default}/>
                    <h2>Prestations</h2>
                </div>}
                {!isMobile()&&<h2>Prestations</h2>}
                <InputSearch placeholder="Entrez une prestation..." onFocus value={name} onChange={(event)=>{setName(event.target.value);
                searchFilter(event.target.value)}} name="name"/>
            </div>

            <div className="section-title">
                {allSearch && leng!==0&&<h2>{leng} {leng < 2 ? "Expert trouvé":"Experts trouvés"}</h2>}
                {leng===0&&<h2>Recherchez une Prestation</h2>}
                <span></span>
            </div>
            {
                allPrestation && name.length===0 &&
                <div className="products-wrapper">
                    {Object.values(allPrestation).map((item, index)=>(

                        <div key={index}>
                            <PrestationItem name={item['name']} price={item['prix']} country={item['name']} id={item['id']}
                                image={item['image']}/>
                        </div>

                    ))}
                </div>
            }
            {
                allSearch && name.length !==0 &&
                <div className="products-wrapper">
                    {Object.values(allSearch).map((item, index)=>(

                        <div key={index}>
                            <PrestationItem name={item['name']} price={item['prix']} country={item['name']} id={item['id']}
                                image={item['image']}/>
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
                !allPrestation &&
                <div>
                    <center>
                        <br/>
                        <img src={require("../../../../assets/images/telescope.png").default}/>
                        <p>{name.length !== 0 ? "Aucune Prestation trouve" : "Rechercher une Prestation"}</p>
                    </center>
                </div>
            }

        </div>
    )
}

export default Prestation;
