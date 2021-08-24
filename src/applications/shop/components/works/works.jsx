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

const Work = ({name}) => {
    const [artworks, setArtwork] = useState([]);
    const [loader, setLoader] = useState(false);
    const [selectArtwork, setSelectedArtwork] = useState([]);
    const [selectedWork, setSelectedWork] = useState(null);


    useEffect(()=>{
        setLoader(true)
        axios.get(config.baseUrl+'/institution/artwork/user/show/'+name)
            .then(response=>{
                console.log(response.data.message)
                setArtwork(response.data.message)
                setLoader(false)
            })
            .catch(error=>{
                console.log(error)
                setLoader(false)
            })
    }, []);

    return (
        <div>
            {!loader&&artworks.length !== 0 && <div className="works">
                {artworks.map(artwork => (
                    <div className="artwork" style={{display: "flex", width: 110, height: 110, marginTop: '1vh', justifyContent: 'space-around'}}>
                        <img src={imageLink.link + artwork.image} alt={artwork.owner_type} onClick={e => {
                            setSelectedArtwork(artwork);
                            setSelectedWork(true)
                        }}/>
                    </div>
                ))}
            </div>
            }
            {loader&&artworks.length===0&&
                    <LoaderIcon type="cylon" color="#6B0C72"/>
            }
            {!loader&&artworks.length===0&&
                    <center>
                        <br/>
                        <img src={require("../../../../assets/images/telescope.png").default}/>
                        <p>Aucune Oeuvres</p>
                    </center>
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