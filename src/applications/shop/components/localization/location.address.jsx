import React, {useCallback, useState, useEffect} from 'react';
import {GoogleMap, InfoWindow, useJsApiLoader, Marker, LoadScript} from '@react-google-maps/api';
import Geocode from "react-geocode";
import img from "../../../../assets/images/mansory.png";
//import image from "../../../../assets/images/dot-in-a-circle-svgrepo-com.svg";
import image from "../../../../assets/images/marker_25px.png";
import config from "../../../../config";
import axios from "axios";

const LocationAddress=(props)=> {
    //const key = "AIzaSyAWwCv4eMvfP6L7vNB8eSG0LwHm7mwFdgs";
    const key = "AIzaSyC2vEJrfaVeGpv_kYngHtWw7VMUM6yWssM";
    const containerStyle={
        width: '100%',
        height: '60vh'
    }
    const zoom = 10;
    const center = {
        lat : 3.860704,
        lng : 11.5183101
    }

    const [location, setLocation] = useState([])
    const [coords, setCoords] = useState({lat: null, lng: null})
    const [notCoord, setNotCoord] = useState(false)
    const [disable, setDisable] = useState(false)
    const [address, setAddress] = useState("")
    const [position, setPosition] = useState([])
    const [allPosition, setAllPosition] = useState([])
    const [multiAddress, setMultiAddress] = useState([])

    const locationProps = props.location;

    let tab = []
    useEffect(() => {
        getLocation()
        if (locationProps.length !== 0) {
            setNotCoord(false)
            Object.keys(locationProps).map(location => (
                tab.push(props.location[location].location)
            ))
            if (tab.length!==0){
                setPosition(tab)
                setLocation(tab)
                setDisable(true)
                {location.map((loc, index) => (
                    getMultiAdress(parseFloat(location[index].split(",")[0]), parseFloat(location[index].split(",")[1]))
                ))}
            }

        } else {
            setNotCoord(true)
            navigator.geolocation.getCurrentPosition(function (position) {
                setCoords({...coords, lat: position.coords.latitude, lng: position.coords.longitude})
                getAddress(position.coords.latitude, position.coords.longitude)
            })
        }
    }, [locationProps])

    const getLocation = ()=>{
        axios.get(config.baseUrl + '/user/location')
            .then(response=>{
                setAllPosition(response.data.message)
            })
            .catch(error=>{
                console.log(error)
            })
    }

    console.log(allPosition)

    const getAddress = (lat, lng) => {
        Geocode.setApiKey(key);
        Geocode.setLanguage("fr");
        Geocode.setRegion("cm");
        Geocode.setLocationType("ROOFTOP");
        Geocode.enableDebug();
        Geocode.fromLatLng(lat, lng)
            .then((response) => {
                    const address = response.results[0].formatted_address;
                    setAddress(address)
                },
                (error) => {
                    console.error(error);
                }
            );
    }

    const getMultiAdress=(lat, lng)=> {
        setMultiAddress([]);
        Geocode.setApiKey(key);
        Geocode.setLanguage("fr");
        Geocode.setRegion("cm");
        Geocode.setLocationType("ROOFTOP");
        Geocode.enableDebug();
        Geocode.fromLatLng(lat, lng)
            .then((response) => {
                    const address = response.results[0].formatted_address;
                    multiAddress.push(address)
                    setMultiAddress(multiAddress)
                },
                (error) => {
                    console.error(error);
                }
            );
    }


    const [map, setMap] = useState(null)

    const onLoad = useCallback(function (map) {
        const google = window.google;
        const bounds = new google.maps.LatLngBounds();
        map.fitBounds(bounds)
        setMap(map)
    }, [])

    const onUnmount = useCallback(function (map) {
        setMap(map)
    }, [])
    return (
        <>
            {
                disable&&<LoadScript googleMapsApiKey={key}>
                    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={zoom}>
                        {Object.keys(locationProps).map((e, index) => (
                            <Marker key={index} icon={image}
                                    position={{
                                        lat: parseFloat(locationProps[index].location.split(",")[0]),
                                        lng: parseFloat(locationProps[index].location.split(",")[1])
                                    }}>
                                {<InfoWindow position={{
                                    lat: parseFloat(locationProps[index].location.split(",")[0]),
                                    lng: parseFloat(locationProps[index].location.split(",")[1])
                                }}>
                                    <div>{locationProps[index].institution_address}</div>
                                </InfoWindow>}
                            </Marker>
                        ))}

                    </GoogleMap>
                </LoadScript>
            }
            {!disable && 
            <LoadScript googleMapsApiKey={key}>
                <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={zoom}>
                    {Object.keys(allPosition).map((e, index) => (
                        <Marker key={index} icon={image}
                                position={{
                                    lat: parseFloat(allPosition[index].location.split(",")[0]),
                                    lng: parseFloat(allPosition[index].location.split(",")[1])
                                }}>
                            {<InfoWindow position={{
                                lat: parseFloat(allPosition[index].location.split(",")[0]),
                                lng: parseFloat(allPosition[index].location.split(",")[1])
                            }}>
                                <div>{allPosition[index].institution_address}</div>
                            </InfoWindow>}
                        </Marker>
                    ))}
                </GoogleMap>
            </LoadScript>}
        </>
    )
}

export default LocationAddress;