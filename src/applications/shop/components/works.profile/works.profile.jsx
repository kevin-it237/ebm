import React, {useEffect, useState} from 'react';
import './works.profile.scss'
import img from "../../../../assets/images/mansory.png";
import axios from "axios";
import config from '../../../../config/index'
import Loader from "react-loader-spinner";
import Modal from "../../../../app/components/modal/modal";
import Select from "react-select";
import Button from "../../../../app/components/buttons/button/button";
import {TextArea} from "semantic-ui-react";

const Work = () => {
    const [artworks, setArtwork] = useState([]);
    const [time, setTime] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [selectedWork, setSelectedWork] = useState(null);


    useEffect(() => {
        setArtwork([{
            title: "the work",
            image: require("../../../../assets/images/mansory.png").default,
            owner_type: "institution"
        }, {
            title: "the work2",
            image: require("../../../../assets/images/mansory.png").default,
            owner_type: "institution2"
        }])
        /*  axios.get(config.baseUrl+'/institution/artwork/show')
              .then(response=>{
                  setArtwork(response.data.message)
                  console.log(response)
              })
              .catch(error=>{
                  console.log(error)
              })*/
    }, []);

    return (
        <div>
            {
                showModal &&
                <Modal hide={() => setShowModal(false)}>
                    <div className="cart-modal-content">
                        <h3>Ajouter l'oeuvre</h3>
                        <p>Image</p>
                        <div style={{width:"100%",height:200,backgroundColor:"#eee"}}>

                        </div>
                        <p>Description</p>
                        <TextArea rows={12}
                            value={"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."}/>
                        <Button size="sm" onClick={() => {
                            setShowModal(false)
                        }}>Completer</Button>
                    </div>
                </Modal>
            }
            {
                selectedWork &&
                <Modal hide={() => setSelectedWork(null)}>
                    <div className="cart-modal-content">
                        <h3>{selectedWork.title}</h3>
                        <p>Image</p>
                        <img src={selectedWork.image} style={{width:"100%",backgroundColor:"#eee"}} alt={selectedWork.title}/>
                        <p>Description</p>
                        <TextArea rows={12}
                            value={selectedWork.description}/>
                        <Button size="sm" onClick={() => {
                            setSelectedWork(null)
                        }}>Fermer</Button>
                    </div>
                </Modal>
            }
            {artworks.length !== 0 ?
                <div className="works">
                    <div style={{
                        backgroundColor: "#eee",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }} className={"artwork"} onClick={e=>{setShowModal(true)}}>

                        <strong style={{color: "white", fontSize: 34}}>+</strong>

                    </div>
                    {artworks.map(artwork => (
                        <div className="artwork" onClick={e=>{setSelectedWork(artwork)}}>
                            {/*<p>{artwork.title}</p>*/}
                            <img src={artwork.image} alt={artwork.owner_type}/>
                        </div>
                    ))}
                </div> : <div className="spinner_load_search">
                    <Loader type="Circles" height={70} width={70} color="#6B0C72"/>
                </div>
            }
        </div>
    )

}

export default Work;
