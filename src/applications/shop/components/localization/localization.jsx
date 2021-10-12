import React, {useEffect, useState} from 'react';
import './localization.scss'
import { ReactComponent as Location } from "../../../../assets/icons/location.svg"
//import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';
import {GoogleMap, InfoWindow, LoadScript, Marker} from '@react-google-maps/api';
import axios from "axios";
import config from "../../../../config";
import {useParams} from "react-router-dom";
import LoaderIcon from "react-loader-icon";
import image from '../../../../assets/images/marker_25px.png'
import img from "../../../../assets/images/ebm.svg";


export const Localization = (props) => {

    const key = 'AIzaSyAWwCv4eMvfP6L7vNB8eSG0LwHm7mwFdgs'
    const containerStyle={
        width: '100%',
        height: '50vh'
    }
    const zoom = 10;
    const center = {
        lat : 3.860704,
        lng : 11.5183101
    }
    const param = useParams()
    const select = param.slug
    const [lat, setLat] = useState(0);
    const [long, setLong] = useState(0)
    const [position, setPosition] = useState("")
    const [local, setLocal] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
    
        axios.get(config.baseUrl + "/institution/show/" + select)
            .then(response => {
                if (response.data.message.location){
                    setLocal(true)
                    setPosition(response.data.message.location)
                }else {
                    setMessage("Pas de Localisation")
                    setLocal(false)
                }
            })
            .catch(error => {
                console.log(error)
            })
    }, []);

    console.log(position)
    return (
        <div className="localization">
            {local&&
                /*{<Map google={props.google} zoom={17} style={mapStyles} onClick={onclick}
                    initialCenter={{lat: lat, lng: long}}>
                    <Marker onClick={onclick}/>
            </Map>}*/
            <LoadScript googleMapsApiKey={key}>
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={center}
                    zoom={zoom}
                >
                    <Marker icon={image} position={{
                                lat: parseFloat(position.split(",")[0]),
                                lng: parseFloat(position.split(",")[1])
                            }}>
                        {<InfoWindow position={{
                            lat: parseFloat(position.split(",")[0]),
                            lng: parseFloat(position.split(",")[1])
                        }}>
                            <div>{select}</div>
                        </InfoWindow>}
                    </Marker>
                </GoogleMap>
            </LoadScript>
            }

            {!message&&!local&&
                <div className="spinner_load_search">
                    <LoaderIcon type="cylon" color="#6B0C72"/>
                </div>
            }
            {/*message&&
                <center>
                    <br/>
                    <img src={require("../../../../assets/images/telescope.png").default}/>
                    <p>{message}</p>
                </center>

            */}
        </div>
    )


}

export default Localization

/*export default GoogleApiWrapper({
    apiKey: 'AIzaSyC2vEJrfaVeGpv_kYngHtWw7VMUM6yWssM'
})(Localization);
*/
