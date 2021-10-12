import React, {useCallback, useState, useRef, useEffect} from 'react';
import { Link } from "react-router-dom";
import { ReactComponent as Close } from "../../../../assets/icons/close.svg";
import { ReactComponent as Filter } from "../../../../assets/icons/filter.svg";
import Region from "../../../../assets/icons/region.svg"
import './advanced.search.scss'
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
import LoaderIcon from "react-loader-icon";
import logoLink from "../../../../config/logo.link";
import Geocode from "react-geocode";
import LocationAddress from "../../components/localization/location.address";
import {confirmAlert} from "react-confirm-alert";
import 'react-confirm-alert/src/react-confirm-alert.css'
import {useDispatch} from "react-redux";



const AdvancedSearch = () => {

    const dispatch = useDispatch()
    const history = useHistory()
    useEffect(() => {
        getAllservice();
        dispatch({
            type: 'ADD_TO_PATH',
            payload: history.location.pathname
        })
    }, []);

    const colourStyles = {
        fontweight: 'bold',
    }

    const [display, setDisplay] = useState("LIST");
    const [recherche, setRecherche] = useState("");
    const [star, setStar] = useState(0);
    const [distance, setDistance] = useState(0);
    const [unit, setUnit] = useState('M');
    const [lat, setLat] = useState(0);
    const [address, setAddress] = useState("");
    const [long, setLong] = useState(0);
    const [allServices, setAllServices] = useState(false); //for all services in database
    const [rateSearch, setRateSearch] = useState([]); //for the filter institution by like
    const [serviceAround, setServiceAround] = useState([]); //for the filter institution by distance
    const [randInstitut, setRandInstitut] = useState([]); //for random institution
    const [search, setSearch] = useState([]); //for the filter institution by distance
    const [loading, setLoading] = useState(false); //for the loader
    const [showFilter, setShowFilter] = useState(false)
    const [loaderRand, setRandLoader] = useState(false)
    const [location, setLocation] = useState(null)

    const changeView = (view) => {
        setDisplay(view)
    }

    const openFilterMenu = () => {
        setShowFilter(!showFilter)
    }

    const options = {
        title: 'Position',
        message: 'Activez votre localisation ?',
        buttons: [
            {
                label: 'Oui',
                onClick: () => {
                    navigator.geolocation.getCurrentPosition(function(position){
                        setLocation(position.coords)
                    })
                }
            },
            {
                label: 'Non'
            }
        ],
        closeOnEscape: true,
        closeOnClickOutside: true,
        willUnmount: () => {},
        afterClose: () => {},
        onClickOutside: () => {},
        onKeypressEscape: () => {},
        overlayClassName: "advanced.search.scss"
    };

    const onPosition=(e)=>{
        e.preventDefault()
        if ("geolocation" in navigator) {
            confirmAlert(options)
        } else {
        }
        navigator.geolocation.getCurrentPosition(function (position){
            Geocode.setApiKey("AIzaSyC2vEJrfaVeGpv_kYngHtWw7VMUM6yWssM");
            Geocode.setLanguage("fr");
            Geocode.setRegion("es");
            Geocode.setLocationType("ROOFTOP");
            Geocode.enableDebug();
            Geocode.fromLatLng(position.coords.latitude, position.coords.longitude).then(
                (response) => {
                    const address = response.results[0].formatted_address;
                    setAddress(address)
                },
                (error) => {
                    console.error(error);
                }
            );
        })
    }

    useEffect(() => {
        setRandLoader(true)
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(function (position) {
                setLat(position.coords.latitude)
                setLong(position.coords.longitude)
            })
        }
        axios.get(config.baseUrl + '/rand')
            .then(response => {
                setRandInstitut(response.data.message)
                setRandLoader(false)
            })
            .catch(error => {
                setRandLoader(false)
            })
    }, [])

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

    const getServiceByName = (name) => {
        setRandInstitut([])
        setSearch([]);
        setLoading(true)
        axios.post(config.baseUrl + '/user/service/search', {name: name})
            .then(response => {
                setSearch(response.data.message);
                setLoading(false)
            })
            .catch(error => {
                notify(error)
                setLoading(false)
            });
    }

    const getServiceAround = () => {
        let location = [lat, long];
        if (location){
            location = location.join(",")
            setLoading(true)
            if (distance !== 0) {
                axios.post(config.baseUrl + '/user/service/search',
                    {around: distance, location: location})
                    .then(response => {
                        setLoading(false)
                        setSearch(response.data.message)
                    })
                    .catch(error => {
                        notify(error)
                        setLoading(false)
                    })
            }
        }

    }

    const notify = (err) => toast.error(err);

    const getServiceByNameDistance = () => {
        setLoading(true)
        let location = [lat, long];
        location = location.join(",")
        if (distance !== 0) {
            axios.post(config.baseUrl + '/user/service/search',
                {around: distance, location: location})
                .then(response => {
                    setServiceAround(response.data.message)
                    setSearch(response.data.message)
                    setLoading(false)
                })
                .catch(error => {
                    console.log(error)
                    setLoading(false)
                })
        }
    }

    const onSelect = (event) => {
        if (event){
            getServiceByName(event.label);
            setRecherche(event.label)
        }
    }

    const getServiceByLike = () => {
        setLoading(true)
        setSearch([]);
        axios.post(config.baseUrl + '/institution/rate/show', {rating: star})
            .then(response => {
                setRateSearch(response.data.message)
                setSearch(response.data.message)
                setLoading(false)
            })
            .catch(error => {
                notify(error)
                setLoading(false)
            })
    }

    const getServiceByNameDistanceLike = () => {
        setLoading(true)
        let location = [lat, long];
        location = location.join(",")
        axios.post(config.baseUrl + '/institution/rate/around/show',
            {rating: star, around: distance, location: location, name: recherche})
            .then(response => {
                setSearch(response.data.message)
                setLoading(false)
            })
            .catch(error => {
                notify(error)
                setLoading(false)
            })
    }

    const getServiceByDistanceLike = () => {
        setLoading(true)
        let location = [lat, long];
        location = location.join(",")
        axios.post(config.baseUrl + '/institution/rate/around/show',
            {rating: star, around: distance, location: location})
            .then(response => {
                setSearch(response.data.message)
                setLoading(false)
            })
            .catch(error => {
                notify(error)
                setLoading(false)
            })
    }

    const getServiceByNameLike = () => {
        setLoading(true)
        axios.post(config.baseUrl + '/institution/rate/name/show',
            {rating: star, name: recherche})
            .then(response => {
                setSearch(response.data.message)
                setLoading(false)
            })
            .catch(error => {
                notify(error)
                setLoading(false)
            })
    }

    const saveCommand = (event) => {
        event.preventDefault();
        setRandInstitut([])
        setSearch([])
        if (star === null) {
            setStar(0)
        }
        if (recherche === "") {
            if (distance !== 0 && star === 0) {
                getServiceAround();
            } else if (distance === 0 && star !== 0) {
                getServiceByLike();
            } else if (distance !== 0 && star !== 0) {
                getServiceByDistanceLike();
            }
        } else {
            if (distance !== 0 && star === 0) {
                getServiceByNameDistance()
            } else if (distance === 0 && star !== 0) {
                getServiceByNameLike()
            } else if (distance !== 0 && star !== 0) {
                getServiceByNameDistanceLike()
            } else if (distance === 0 && star === 0) {
                getServiceByName();
            }
        }
        setShowFilter(false);
    }

    return (
        <>
            <div id="advanced-search">
                <div className="top">
                    <Close onClick={() => history.goBack()}/>
                    <h2>Recherche</h2>
                </div>

                <div className="search">
                    <Select options={allServices} placeholder="Recherchez un service..."
                            styles={colourStyles} onChange={onSelect} isClearable/>

                    <div className="actual-position" onClick={onPosition}>
                        <img src={Region} alt=""/>
                        <p>{address ? address : "Votre position"}</p>
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
                                <Link to={"/institute/" + (search[sear].institution ? search[sear].institution.username : search[sear].username)} key={index} className="result">
                                    <img src={logoLink.link +search[sear].logo} alt={search[sear].username}/>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <div style={{display: 'flex', flexDirection: 'column'}}>
                                            {search[sear].username ?
                                                <h4 className="name"> {search[sear].username}</h4> :
                                                search[sear].institution.username ?
                                                    <h4 className="name"> {search[sear].institution.username}</h4> : ""}
                                            {search[sear].institution_address ?
                                                <p className="address">{search[sear].institution_address}</p> :
                                                search[sear].institution.address ?
                                                    <p className="address">{search[sear].institution.address}</p> : search[sear].address ?
                                                    <p className="address">{search[sear].address}</p> : ""}
                                        </div>
                                        {search[sear].distance_f ?
                                            <p className="address">{search[sear].distance_f} {unit}</p> :
                                            search[sear].rating ?
                                                <Rating value={search[sear].rating} precision={0.25}/> : ""}
                                    </div>
                                </Link>
                            ))}
                            {!loaderRand && search.length === 0 && randInstitut && randInstitut.map((sear, index) => (
                                <Link className="result" to={"/institute/" + (sear['username'])}>
                                    <img src={logoLink.link+sear['logo']} alt=""/>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <div style={{display: 'flex', flexDirection: "column"}}>
                                            <h4 className="name"> {sear['username']}</h4>
                                            <p className="address">{sear['address']}</p>
                                        </div>
                                    </div>
                                </Link>
                            ))
                            }
                            {!loading && !loaderRand && search.length === 0 && randInstitut.length===0 &&
                                <center>
                                    <br/>
                                    <img src={require("../../../../assets/images/telescope.png").default}/>
                                    <p>Aucun Resultat</p>
                                </center>
                            }
                            {loading || loaderRand && <div>
                                <center>
                                    <br/>
                                    <LoaderIcon type={"cylon"} color={"#6B0C72"}/>
                                </center>
                            </div>}
                        </div>
                        :
                        <div>
                            <LocationAddress location={search}/>
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
                                    <div className="option" style={{marginLeft: '2vh'}}>Distance Max.</div>
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
                                <p className="option" style={{marginLeft: '2vh'}}>Like Min.</p>
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