import React, {useEffect, useState} from 'react';
import './works.scss'
import img from "../../../../assets/images/mansory.png";
import axios from "axios";
import config from '../../../../config/index'
import LoaderIcon from "react-loader-icon";
import imageLink from '../../../../config/image.link'
import Modal from "../../../../app/components/modal/modal";
import {TextArea} from "semantic-ui-react";
import Button from "../../../../app/components/buttons/button/button";

const Work = () => {
    const [artworks, setArtwork] = useState([]);
    const [time, setTime] = useState(0);
    const [selectArtwork, setSelectedArtwork] = useState([]);
    const [selectedWork, setSelectedWork] = useState(null);


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
                    <div className="artwork" style={{display: "flex", width: 110, height: 110, marginTop: '1vh', justifyContent: 'space-around'}}>
                        {/*<p>{artwork.title}</p>*/}
                        <img src={imageLink.link+artwork.image} alt={artwork.owner_type} onClick={e=>{setSelectedArtwork(artwork); setSelectedWork(true)}}/>
                    </div>
                ))}
            </div>: <div className="spinner_load_search" style={{marginTop: 30}}>
                    <LoaderIcon type="cylon" color="#6B0C72"/>
                </div>
            }
            {
                selectedWork &&
                <Modal hide={() => setSelectedWork(null)}>
                    <div className="cart-modal-content">
                        <h3>{selectArtwork.title}</h3>
                        <p style={{fontSize: 'small'}}>Image</p>
                        <img src={imageLink.link+selectArtwork.image} style={{width: "100%", backgroundColor: "#eee", height: 200}}
                             alt={selectArtwork.title}/>
                        <p style={{fontSize: 'small'}}>Description</p>
                        <div>{selectArtwork.description}</div>
                        <Button size="sm" onClick={() => {
                            setSelectedWork(null)
                        }}>Fermer</Button>
                    </div>
                </Modal>
            }
        </div>
    )

}

export default Work;