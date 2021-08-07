import React, {useCallback, useState, useRef, useEffect} from 'react';
import InputSearch from "../../../../app/components/inputs/input.search/input.search";

import { ReactComponent as Close } from "../../../../assets/icons/close.svg";
import { ReactComponent as Filter } from "../../../../assets/icons/filter.svg";
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Region from "../../../../assets/icons/region.svg"
import './advanced.search.scss'
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import Select from 'react-select'
import { ToastContainer, toast } from 'material-react-toastify';
import 'material-react-toastify/dist/ReactToastify.css';
import MapIcon from "../../../../assets/icons/map.svg";
import List from "../../../../assets/icons/list.svg";
import Telescope from "../../../../assets/images/telescope.png"
import BottomDrawer from "../../../../app/components/bottom.drawer/bottom.drawer"
import img from "../../../../assets/images/cils.jpg"
import { useHistory } from 'react-router-dom';
import Rating from "@material-ui/lab/Rating";
import axios from "axios";
import config from "../../../../config";
import Button from "../../../../app/components/buttons/button/button"
import Slider from '@material-ui/core/Slider';
import {MapGoogle} from "../../../../app/components/map/map.google";


const AdvancedSearch = () => {

    useEffect(() => {
        getAllservice();
    }, []);

    const colourStyles = {
        fontweight: 'bold',
    }

    const [display, setDisplay] = useState("LIST");
    const [recherche, setRecherche] = useState("");
    const [star, setStar] = useState(0);
    const [price, setPrice] = useState(0);
    const [distance, setDistance] = useState(0);
    const [unit, setUnit] = useState('M');
    const [lat, setLat] = useState(0);
    const [long, setLong] = useState(0);
    const [allServices, setAllServices] = useState(false); //for all services in database
    const [allsearch, setAllSearch] = useState([]);  //for the select service
    const [allInstitutLocation, setAllInstitutLocation] = useState(""); //for the service with location and name
    const [allInstitut, setAllInstitut] = useState(""); //for the service with location
    const [serviceByAllParameter, setServiceByAllParameter] = useState([]); //for the service with location, name and around
    const [rateSearch, setRateSearch] = useState([]); //for the filter institution by like
    const [serviceAround, setServiceAround] = useState([]); //for the filter institution by distance
    const [search, setSearch] = useState([]); //for the filter institution by distance
    const [showFilter, setShowFilter] = useState(false)
    const history = useHistory()

    const changeView = (view) => {
        setDisplay(view)
    }

    const openFilterMenu = () => {
        setShowFilter(!showFilter)
    }

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(function (position) {
                //resultLocation(position.coords.latitude, position.coords.longitude);
                setLat(position.coords.latitude)
                setLong(position.coords.longitude)
            })
        } else {
            confirmAlert({
                title: 'Localisation',
                message: 'Activer votre localisation ?',
                buttons: [
                    {
                        label: 'Oui',
                        onClick: () => alert('Oui')
                    },
                    {
                        label: 'Non',
                        onClick: () => alert('Non')
                    }
                ]
            })
        }
    }, [])

    const RangeSlider = withStyles({
        thumb: {
            height: 20,
            width: 20,
            backgroundColor: '#fff',
            marginTop: -8,
            marginLeft: -12,
            boxShadow: '-1px 1px #d4d4d4'
        },
        track: {
            height: 6,
            borderRadius: 4,
        },
        rail: {
            height: 6,
            borderRadius: 4,
            backgroundColor: 'gray',
        },
    })(Slider);

    /*const getPosition=()=>{
        if ("geolocation" in navigator){
            navigator.geolocation.getCurrentPosition(function (position){
                resultLocation(position.coords.latitude, position.coords.longitude);
                setLat(position.coords.latitude)
                setLong(position.coords.longitude)
            })
        }else {
            confirmAlert({
                title: 'Localisation',
                message: 'Activer votre localisation ?',
                buttons: [
                    {
                        label: 'Oui',
                        onClick: ()=>alert('Oui')
                    },
                    {
                        label: 'Non',
                        onClick: ()=>alert('Non')
                    }
                ]
            })
        }
    }

     */

    const resultLocation = (lat, long) => {
        let location = [lat, long];
        location = location.join(",")
        if (recherche === "") {
            axios.post(config.baseUrl + '/user/service/search', {location: location})
                .then(response => {
                    setAllSearch("");
                    setAllInstitutLocation("");
                    setRateSearch("");
                    setAllInstitut(response.data.message)
                    console.log(response.data.message)
                })
                .catch(error => {
                    console.log(error)
                })
        } else {
            axios.post(config.baseUrl + '/user/service/search', {location: location, name: recherche})
                .then(response => {
                    setAllSearch("");
                    setAllInstitut("");
                    setRateSearch("");
                    setAllInstitutLocation(response.data.message)
                })
                .catch(error => {
                    console.log(error)
                })
        }
    }

    const getAllservice = () => {
        let tab = []
        axios.get(config.baseUrl + '/user/service/index')
            .then(response => {
                Object.keys(response.data.message).map((search, index) => (
                    tab[index] = {
                        value: response.data.message[search].id,
                        label: response.data.message[search].name_fr,
                    }
                ))
                setAllServices(tab)
            })
            .catch(error => {
                console.log(error)
            })
    }

    const getSelectService = (name) => {
        setSearch([]);
        axios.post(config.baseUrl + '/user/service/search', {name: name})
            .then(response => {
                console.log(response.data.message);
                setSearch(response.data.message);
            })
            .catch(error => {
                console.log(error)
            });
    }

    const getServiceAround = () => {
        let location = [lat, long];
        location = location.join(",")
        if (distance !== 0) {
            axios.post(config.baseUrl + '/user/service/search',
                {around: distance, location: location})
                .then(response => {
                    //console.log(response.data)
                    setSearch(response.data.message)
                })
                .catch(error => {
                    console.log(error)
                })
        }
    }

    const getServiceByNameDistance = () => {
        let location = [lat, long];
        location = location.join(",")
        if (distance !== 0) {
            axios.post(config.baseUrl + '/user/service/search',
                {around: distance, location: location})
                .then(response => {
                    setServiceAround(response.data.message)
                    setSearch(response.data.message)
                })
                .catch(error => {
                    console.log(error)
                })
        }
    }

    const getServiceByAllParameter = () => {
        let location = [lat, long];
        location = location.join(",")
        setServiceAround("");
        axios.post(config.baseUrl + '/user/service/search',
            {around: distance, name: recherche, location: location})
            .then(response => {
                setServiceByAllParameter(response.data.message)
                setSearch(response.data.message)
            })
            .catch(error => {
                console.log(error)
            })
    }

    const getRate = (event) => {
        event.preventDefault();
    }
    const onSelect = (event) => {
        getSelectService(event.label);
        setRecherche(event.label)
    }

    const getServiceByLike = () => {
        setSearch([]);
        axios.post(config.baseUrl + '/institution/rate/show', {rating: star})
            .then(response => {
                setRateSearch(response.data.message)
                setSearch(response.data.message)
                console.log(response.data.message)
            })
            .catch(error => {
                console.log(error)
            })
    }

    const getServiceByDistanceLike = () => {
        let location = [lat, long];
        location = location.join(",")
        axios.post(config.baseUrl + '/institution/rate/around/show', {rating: star, around: distance, location: location})
            .then(response => {
                setSearch(response.data.message)
            })
            .catch(error => {
                console.log(error)
            })
    }

    console.log(star)
    const saveCommand = (event) => {
        event.preventDefault();
        setSearch([])
        if (distance !== 0 && recherche !== "" && star !== null) {
            console.log('1')
            getServiceByAllParameter();
        } else if (distance !== 0 && recherche === "" && star !== null) {
            console.log('2')
            getServiceByDistanceLike();
        } else if (distance !== 0 && star===null && recherche ==="") {
            console.log('uhjfkenfeifek')
            getServiceAround();
        }else if (star !== null && distance === 0 && recherche === ""){
            getServiceByLike();
        }else if (star === null && distance === 0 && recherche !== ""){
            getSelectService();
        }else if (star === 0 && distance !== 0 && recherche !== ""){
            getSelectService();
        }
        setShowFilter(false);
    }

    console.log(search)

    return (
        <>
            <div id="advanced-search">
                <div className="top">
                    <Close onClick={() => history.goBack()}/>
                    <h2>Recherche</h2>
                </div>

                <div className="search">
                    <Select options={allServices} placeholder="Recherchez un service..."
                            styles={colourStyles} onChange={onSelect}/>

                    <div className="actual-position">
                        <img src={Region} alt=""/>
                        <p>Ma position actuelle</p>
                    </div>
                    <div className="filter-box">
                        <div className="filter">
                            <div onClick={openFilterMenu}>
                                <Filter/>
                                <h5>Filtrer par ...</h5>
                            </div>
                        </div>
                        <div className="view-settings">
                            {
                                display === "LIST" ?
                                    <div onClick={() => changeView("MAP")}><img src={MapIcon} alt=""/><h5>Map </h5>
                                    </div> :
                                    <div onClick={() => changeView("LIST")}><img src={List} alt=""/><h5>List </h5></div>
                            }
                        </div>
                    </div>
                </div>

                {
                    display === "LIST" ?
                        <div className="search-results">
                            {Object.keys(search).map((sear, index) => (
                                <div key={index} className="result">
                                    <img src={img} alt=""/>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <div style={{display: 'flex', flexDirection: 'column'}}>
                                            {search[sear].username ? <h4 className="name"> {search[sear].username}</h4> :
                                                search[sear].institution.username ? <h4 className="name"> {search[sear].institution.username}</h4>: ""}
                                            {search[sear].institution_address ? <p className="address">{search[sear].institution_address}</p> :
                                                search[sear].institution.address ? <p className="address">{search[sear].institution.address}</p>:""}
                                        </div>
                                        {search[sear].distance_f ? <p className="address">{search[sear].distance_f} {unit}</p> :
                                            search[sear].rating ? <Rating value={search[sear].rating} precision={0.5}/> : ""}
                                    </div>
                                </div>
                            ))}
                            {/*Object.keys(serviceByAllParameter).map((search, index) => (
                                <div key={index} className="result">
                                    <img src={img} alt=""/>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <div style={{display: 'flex', flexDirection: 'column'}}>
                                            <h4 className="name"> {serviceByAllParameter[search].username}</h4>
                                            <p className="address">{serviceByAllParameter[search].institution_address}</p>
                                        </div>
                                        <p className="address">{serviceByAllParameter[search].distance_f} {unit}</p>
                                    </div>
                                </div>
                            ))*/}
                        </div>
                        :
                        <div>
                            <h1>MAP</h1>
                            <MapGoogle/>
                        </div>

                }

            </div>

            {
                showFilter &&
                <BottomDrawer onClose={() => setShowFilter(false)}>
                    <div className="section-title">
                        <h2>Trier par :</h2>
                        <span></span>
                    </div>
                    <div className="options" style={{
                        fontSize: '2vh', display: 'flex', flexDirection: 'column',
                        justifyContent: 'space-between', marginTop: '3vh'
                    }}>
                        <div className="filters" style={{display: 'flex', flexDirection: 'column', height: '10vh'}}>
                            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                <div style={{display: 'flex', alignItems: 'center'}}>
                                    <img src={Map} alt=""/>
                                    <div className="option" style={{marginLeft: '2vh'}}>Distance</div>
                                </div>
                                <p className="option" style={{color: '#6B0C72'}}>{distance} {unit}</p>
                            </div>
                            <Slider
                                value={distance} step={25} max={10000}
                                onChange={(event, newValue) => {
                                    setDistance(newValue)
                                }}
                                aria-label="pretto slider"
                                style={{color: '#6B0C72'}}
                            />
                        </div>
                        <div className="filter" style={{
                            display: 'flex',
                            height: '8vh',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                            <div style={{display: 'flex'}}>
                                <Rating disabled max={1} size="large"/>
                                <p className="option" style={{marginLeft: '2vh'}}>Like</p>
                            </div>
                            <div>
                                <Rating size="large" precision={0.5} onChange={(event, newValue) => {
                                    event.preventDefault();
                                    setStar(newValue)
                                }} value={star}/>
                            </div>

                        </div>
                    </div>
                    <Button size="sm" style={{height: '8vh'}} onClick={saveCommand}>Commencer la Recherche</Button>
                </BottomDrawer>
            }
        </>
    )
}

export default AdvancedSearch;