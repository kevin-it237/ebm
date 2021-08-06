import React, {useCallback, useEffect, useState} from 'react';
import './map.google.scss'
//import { ReactComponent as Location } from "../../../../assets/icons/location.svg"
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';


export const MapGoogle = () => {

    const [location, setLocation] = useState(0);
    const [lat, long] = [0, 0];




    useEffect(()=>{
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(function(position) {
                console.log("Latitude is :", position.coords.latitude);
                console.log("Longitude is :", position.coords.longitude);
            });
        }
    }, [])
    const mapStyles = {
        width: '100%',
        height: '100%'
    };


    const onclick = ()=>{
        console.log("fdfdff")
    }
    return (
        <div className="map">
            {location ?
                <Map
                    zoom={17}
                    style={mapStyles}
                    initialCenter={
                        {
                            lat: lat,
                            lng: long
                        }
                    }
                    onClick={onclick}
                >
                    <Marker onClick={onclick}/>
                </Map>
                : ""}
        </div>
    )

}

export default GoogleApiWrapper({
    apiKey: 'AIzaSyC2vEJrfaVeGpv_kYngHtWw7VMUM6yWssM'
})(MapGoogle);

