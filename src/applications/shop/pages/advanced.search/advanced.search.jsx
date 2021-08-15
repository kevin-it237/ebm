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
    const [distance, setDistance] = useState(0);
    const [unit, setUnit] = useState('M');
    const [lat, setLat] = useState(0);
    const [address, setAddress] = useState("");
    const [long, setLong] = useState(0);
    const [allServices, setAllServices] = useState(false); //for all services in database
    const [allsearch, setAllSearch] = useState([]);  //for the select service
    const [allInstitutLocation, setAllInstitutLocation] = useState(""); //for the service with location and name
    const [allInstitut, setAllInstitut] = useState(""); //for the service with location
    const [rateSearch, setRateSearch] = useState([]); //for the filter institution by like
    const [serviceAround, setServiceAround] = useState([]); //for the filter institution by distance
    const [randInstitut, setRandInstitut] = useState([]); //for random institution
    const [search, setSearch] = useState([]); //for the filter institution by distance
    const [loading, setLoading] = useState(false); //for the loader
    const [showFilter, setShowFilter] = useState(false)
    const history = useHistory()

    const changeView = (view) => {
        setDisplay(view)
    }

    const openFilterMenu = () => {
        setShowFilter(!showFilter)
    }

    const onPosition=(e)=>{
        e.preventDefault()
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
                    console.log(address);
                },
                (error) => {
                    console.error(error);
                }
            );
        })
    }
    console.log(address)


    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(function (position) {
                setLat(position.coords.latitude)
                setLong(position.coords.longitude)
            })
        }
        axios.get(config.baseUrl + '/rand')
            .then(response => {
                console.log(response.data.message)
                setRandInstitut(response.data.message)
            })
            .catch(error => {
                console.log(error)
            })
    }, [])

    console.log(search)

    /*const resultLocation = (lat, long) => {
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
     */

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
        setSearch([]);
        setLoading(true)
        axios.post(config.baseUrl + '/user/service/search', {name: name})
            .then(response => {
                console.log(response.data.message);
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
        getServiceByName(event.label);
        setRecherche(event.label)
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

    console.log(search)

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
        setSearch([])
        console.log(search)
        if (star === null) {
            setStar(0)
        }
        if (recherche === "") {
            if (distance !== 0 && star === 0) {
                console.log('5')
                getServiceAround();
            } else if (distance === 0 && star !== 0) {
                console.log('6')
                getServiceByLike();
            } else if (distance !== 0 && star !== 0) {
                console.log('7')
                console.log(star)
                getServiceByDistanceLike();
            }
        } else {
            if (distance !== 0 && star === 0) {
                console.log('1')
                getServiceByNameDistance()
            } else if (distance === 0 && star !== 0) {
                console.log('2')
                getServiceByNameLike()
            } else if (distance !== 0 && star !== 0) {
                console.log('3')
                getServiceByNameDistanceLike()
            } else if (distance === 0 && star === 0) {
                console.log("4")
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
                        <p>{address ? address : "Votre posiion"}</p>
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
                                                    <p className="address">{search[sear].institution.address}</p> : ""}
                                        </div>
                                        {search[sear].distance_f ?
                                            <p className="address">{search[sear].distance_f} {unit}</p> :
                                            search[sear].rating ?
                                                <Rating value={search[sear].rating} precision={0.25}/> : ""}
                                    </div>
                                </Link>
                            ))}
                            {!loading && search.length === 0 && randInstitut.map((sear, index) => (
                                <Link className="result" to={"/institute/" + (sear['username'])}>
                                    <img src={img} alt=""/>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <div style={{display: 'flex', flexDirection: "column"}}>
                                            <h4 className="name"> {sear['username']}</h4>
                                            <h4 className="name"> {sear['firstname']}</h4>
                                            <p className="address">{sear['email']}</p>
                                        </div>
                                    </div>
                                </Link>
                            ))
                            }
                            {loading && <div>
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