import React, {useEffect, useState} from 'react';
import './works.scss'
import img from "../../../../assets/images/mansory.png";
import axios from "axios";
import config from '../../../../config/index'
import Loader from "react-loader-spinner";

const Work = () => {
    const [artworks, setArtwork] = useState([]);
    const [time, setTime] = useState(0);


    useEffect(()=>{
        axios.get(config.baseUrl+'/institution/artwork/show')
            .then(response=>{
                setArtwork(response.data.message)
                console.log(response)
            })
            .catch(error=>{
                console.log(error)
            })
    }, []);

    return (
        <div>
            {artworks.length !==0?
            <div className="works">
                { artworks.map(artwork=>(
                    <div className="artwork">
                        <p>{artwork.title}</p>
                        <img src={artwork.image} alt={artwork.owner_type} />
                    </div>
                ))}
            </div>: <div className="spinner_load_search">
                    <Loader type="Circles" height={70} width={70} color="#6B0C72"/>
                </div>
            }
        </div>
    )
  
}

export default Work;