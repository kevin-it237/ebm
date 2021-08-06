import React, {useEffect, useState} from 'react';
import './localization.scss'
import { ReactComponent as Location } from "../../../../assets/icons/location.svg"
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';


export const Localization = (props) => {

    const [location, setLocation] = useState(0);
    const [lat, long] = [0, 0];

    if (props.localization){
        setLocation(props.localization)
        [lat, long] = [location.split(",")[0], location.split(",")[1]];
    }




    useEffect(()=>{
        if ("geolocation" in navigator) {
            console.log("Available");
        } else {
            console.log("Not Available");
        }

        navigator.geolocation.getCurrentPosition(function(position) {
            console.log("Latitude is :", position.coords.latitude);
            console.log("Longitude is :", position.coords.longitude);
        });
    });
    const mapStyles = {
        width: '100%',
        height: '100%'
    };


    const onclick = ()=>{
        console.log("fdfdff")
    }
    return (
        <div className="localization">
            {location ?
            <Map
                google={props.google}
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
            <div className="position">
                <Location />
                <p>{props.address}</p>
            </div>
        </div>
    )
  
}

export default GoogleApiWrapper({
    apiKey: 'AIzaSyC2vEJrfaVeGpv_kYngHtWw7VMUM6yWssM'
})(Localization);

