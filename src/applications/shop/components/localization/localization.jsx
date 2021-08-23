import React, {useEffect, useState} from 'react';
import './localization.scss'
import { ReactComponent as Location } from "../../../../assets/icons/location.svg"
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';
import axios from "axios";
import config from "../../../../config";
import {useParams} from "react-router-dom";
import LoaderIcon from "react-loader-icon";
import img from "../../../../assets/images/ebm.svg";


export const Localization = (props) => {

    const param = useParams()
    const select = param.slug
    const [lat, setLat] = useState(0);
    const [long, setLong] = useState(0)
    const [local, setLocal] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        axios.get(config.baseUrl + "/institution/show/" + select)
            .then(response => {
                if (response.data.message.location){
                    setLocal(true)
                    setLat(response.data.message.location.split(",")[0]);
                    setLong(response.data.message.location.split(",")[1]);
                }else {
                    setMessage("Pas de Localisation")
                    setLocal(false)
                }
            })
            .catch(error => {
                console.log(error)
            })
    }, []);

    console.log(message)
    const mapStyles = {
        width: '100%',
        height: '100%'
    };


    const onclick = () => {
        console.log("fdfdff")
    }
    return (
        <div className="localization">
            {local&&
                <Map google={props.google} zoom={17} style={mapStyles} onClick={onclick}
                    initialCenter={{lat: lat, lng: long}}>
                    <Marker onClick={onclick}/>
                </Map>
            }

            {!message&&
                <div className="spinner_load_search">
                    <LoaderIcon type="cylon" color="#6B0C72"/>
                </div>
            }
            {message&&
                <center>
                    <br/>
                    <img src={require("../../../../assets/images/telescope.png").default}/>
                    <p>{message}</p>
                </center>

            }
        </div>
    )


}
export default GoogleApiWrapper({
    apiKey: 'AIzaSyC2vEJrfaVeGpv_kYngHtWw7VMUM6yWssM'
})(Localization);

