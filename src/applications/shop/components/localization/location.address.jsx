import React, {useCallback, useState, useEffect} from 'react';
import {GoogleMap, InfoWindow, useJsApiLoader, Marker, LoadScript} from '@react-google-maps/api';
import Geocode from "react-geocode";

const containerStyle = {
    width: '100%',
    height: '400px'
};

const LocationAddress=(props)=> {
    const key = "AIzaSyC2vEJrfaVeGpv_kYngHtWw7VMUM6yWssM";
    const [location, setLocation] = useState([])
    const [coords, setCoords] = useState({lat: null, lng: null})
    const [notCoord, setNotCoord] = useState(false)
    const [address, setAddress] = useState("")
    const [multiAddress, setMultiAddress] = useState([])

    const locationProps = props.location;

    let tab = []
    let post = []
    useEffect(() => {
        console.log(multiAddress)
        if (locationProps.length !== 0) {
            setNotCoord(false)
            Object.keys(props.location).map(location => (
                tab.push(props.location[location].location)
            ))
            console.log(tab)
            setLocation(tab)
            {location.map((loc, index) => (
                getMultiAdress(parseFloat(location[index].split(",")[0]), parseFloat(location[index].split(",")[1]))

            ))}
        } else {
            setNotCoord(true)
            navigator.geolocation.getCurrentPosition(function (position) {
                setCoords({...coords, lat: position.coords.latitude, lng: position.coords.longitude})
                getAddress(position.coords.latitude, position.coords.longitude)
            })
        }
        console.log(notCoord)
    }, [locationProps])

    let j =0
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
                    console.log(address);
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
    console.log(multiAddress)

    const loader = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: key
    })

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
        <LoadScript googleMapsApiKey={key}>
            {!notCoord &&
            <GoogleMap onLoad={onLoad}
                       mapContainerStyle={containerStyle}
                       onUnmount={onUnmount}
                       zoom={16}>
                {location.map((loc, index) => (
                    <Marker key={index} position={{
                        lat: parseFloat(location[index].split(",")[0]),
                        lng: parseFloat(location[index].split(",")[1])
                    }}>
                        {/*Object.keys(multiAddress).map(add=>(
                            <InfoWindow>
                                <div>{multiAddress[index]}</div>
                            </InfoWindow>
                        ))*/}
                        {multiAddress.map(add=>(
                            <InfoWindow key={index}>
                                <div>{multiAddress[index]}</div>
                            </InfoWindow>
                        ))}
                    </Marker>
                ))}
            </GoogleMap>
            }
            {
                notCoord && <GoogleMap onLoad={onLoad}
                                       center={coords}
                                       mapContainerStyle={containerStyle}
                                       onUnmount={onUnmount}
                                       zoom={16}>
                    <Marker position={coords}>
                        <InfoWindow>
                            <div>{address}</div>
                        </InfoWindow>
                    </Marker>
                </GoogleMap>
            }
        </LoadScript>
    )
}

export default LocationAddress;