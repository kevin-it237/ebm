import React, {useEffect, useState} from 'react';
import './localization.scss'
import { ReactComponent as Location } from "../../../../assets/icons/location.svg"
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';
import axios from "axios";
import config from "../../../../config";
import {useParams} from "react-router-dom";
import LoaderIcon from "react-loader-icon";


export const Localization = (props) => {

    const param = useParams()
    const select = param.slug
    const [location, setLocation] = useState(0);
    const [lat, setLat] = useState(0);
    const [long, setLong] = useState(0)
    const [local, setLocal] = useState(false);

    useEffect(() => {
        setLocal(true)
        axios.get(config.baseUrl + "/institution/show/" + select)
            .then(response => {
                setLat(response.data.message.location.split(",")[0]);
                setLong(response.data.message.location.split(",")[1]);
                setLocal(false)
            })
            .catch(error => {
                setLocal(false)
            })
    });


    console.log(location)

    console.log(location)
    const mapStyles = {
        width: '100%',
        height: '100%'
    };


    const onclick = () => {
        console.log("fdfdff")
    }
    return (
        <div className="localization">
            {lat && long ?
                <Map
                    google={props.google} zoom={17} style={mapStyles} onClick={onclick}
                    initialCenter={
                        {
                            lat: lat,
                            lng: long
                        }
                    }
                >
                    <Marker onClick={onclick}/>
                </Map> : ""}

            {local &&
            <div className="spinner_load_search">
                <LoaderIcon type="cylon" color="#6B0C72"/>
            </div>
            }
        </div>
    )


}
export default GoogleApiWrapper({
    apiKey: 'AIzaSyC2vEJrfaVeGpv_kYngHtWw7VMUM6yWssM'
})(Localization);

