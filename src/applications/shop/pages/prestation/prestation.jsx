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
import chignon from "../../../../assets/images/prestations/dsBuffer.bmp.png"

import {isMobile} from "../../../../config/helpers"

const Prestation = () => {

    const prestationTab = [
        {
            id : 1,
            name : 'Chignon',
            prix : '10000F',
            image : [
                require( "../../../../assets/images/prestations/dsBuffer.bmp.png").default,
                require( "../../../../assets/images/prestations/pexels-garon-piceli-557843.jpg").default
            ]
        },
        {
            id : 2,
            name : 'Defrissage',
            prix : '10000F',
            image : [
                require( "../../../../assets/images/prestations/pexels-polina-tankilevitch-3738339.jpg").default,
                require( "../../../../assets/images/prestations/Hair-straightener.jpg").default
            ]
        },
        {
            id : 3,
            name : 'Tissage Naturel',
            prix : '10000F',
            image : [
                require( "../../../../assets/images/prestations/pexels-garon-piceli-557843.jpg").default,
                require( "../../../../assets/images/prestations/12xu5i2z8w75.jpg").default
            ]
        },
        {
            id : 4,
            name : 'Tissage Synthétique',
            prix : '10000F',
            image : [
                require( "../../../../assets/images/prestations/pexels-tima-miroshnichenko-7879908.jpg").default
            ]
        },
        {
            id : 5,
            name : 'Torsade',
            prix : '10000F',
            image : [
                require( "../../../../assets/images/prestations/cc1f4017ec4f815dee0e18c2dd5e0550.jpg").default,
                require( "../../../../assets/images/prestations/torsades-classe-225x300.jpg").default
            ]
        },
        {
            id : 6,
            name : 'Traitement des Cheveux',
            prix : '10000F',
            image : [
                require( "../../../../assets/images/prestations/Hair Care Female Having Hair Treated in a Croda Salon.jpg").default,
                require( "../../../../assets/images/prestations/istockphoto-878841420-612x612.jpg").default,
                require( "../../../../assets/images/prestations/BeFunky-collage-49.jpg").default
            ]
        },
        {
            id : 7,
            name : 'Rouleaux',
            prix : '10000F',
            image : [
                require( "../../../../assets/images/prestations/b35cc45c8f61819b11622b6b9856fe3f--hot-rollers-hair-care-products.jpg").default
            ]
        },
        
    ]

    const history = useHistory();
    const dispatch = useDispatch()
    const [allPrestation, setAllPrestation] = useState([]);
    const [allSearch, setAllSearch] = useState([]);
    const [leng, setLeng] = useState(0);
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(()=>{
        //getPrestation()
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


    return (
        <div id="search" className="product-search">
            <div className="search">
                {isMobile()&&<div className="search-prestation">
                    <img className="left-back" onClick={() => history.goBack()} src={require('../../../../../src/assets/icons/left_arrow_30px.png').default}/>
                    <h2>Prestations</h2>
                </div>}
                {!isMobile()&&<h2>Prestations</h2>}
                {/*<InputSearch placeholder="Entrez une prestation..." onFocus value={name} onChange={(event)=>{setName(event.target.value);
                searchFilter(event.target.value) }} name="name"/>*/}
                {<InputSearch placeholder="Entrez une prestation..." onFocus value={name} onChange={(event)=>{setName(event.target.value);
                }} name="name"/>}
            </div>
        

            <div className="section-title">
                {allSearch && leng!==0&&<h2>{leng} {leng < 2 ? "Expert trouvé":"Experts trouvés"}</h2>}
                {leng===0&&<h2>Recherchez une Prestation</h2>}
                <span></span>
            </div>
            {/*
                allPrestation && name.length===0 &&
                <div className="products-wrapper">
                    {Object.values(allPrestation).map((item, index)=>(

                        <div key={index}>
                            <PrestationItem name={item['name']} price={item['prix']} country={item['name']} id={item['id']}
                                image={item['image']}/>
                        </div>

                    ))}
                </div>
                    */}
            {
                
                <div className="products-wrapper">
                    {Object.values(prestationTab).map((item, index)=>(

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
