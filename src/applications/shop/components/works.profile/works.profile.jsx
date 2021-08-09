import React, {useEffect, useState} from 'react';
import './works.profile.scss'
import img from "../../../../assets/images/mansory.png";
import useFileDialog from "use-file-dialog";
import {DropzoneArea} from 'material-ui-dropzone'
import {DropzoneDialog} from 'material-ui-dropzone'
import axios from "axios";
import config from '../../../../config/index'
import imageLink from '../../../../config/image.link'
import LoaderIcon from "react-loader-icon";
import Loader from "react-loader-spinner";
import Modal from "../../../../app/components/modal/modal";
import Button from "../../../../app/components/buttons/button/button";
import {TextArea} from "semantic-ui-react";

const Work = () => {
    const [artworks, setArtwork] = useState([]);
    const [selectArtwork, setSelectedArtwork] = useState([]);
    const [time, setTime] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [selectedWork, setSelectedWork] = useState(null);
    const [form, setForm] = useState({title: "", description: ""});
    const [image, setImage] = useState("")
    const [selectFile, setSelectFile] = useState("")


    useEffect(() => {
        getDataFile()
    }, []);

    const getDataFile = ()=>{
        axios.get(config.baseUrl+'/institution/artwork/show')
            .then(response=>{
                setArtwork(response.data.message)
            })
            .catch(error=>{
                console.log(error)
            })
    }

    const onFile = (event) => {
        if(event.target.files[0].length===0){
            return;
        }
        const blob = new Blob([event.target.files[0]])
        setSelectFile(event.target.files[0])
        const url = URL.createObjectURL(blob)
        setImage(url)
    }

    const changeDescription = (event) => {
        setForm({...form, [event.target.name]: event.target.value})
    }

    const saveArtwork = (event) => {
        event.preventDefault()
        if(!selectFile){
            return;
        }
        const formData = new FormData();
        formData.append("image", selectFile)
        formData.append("description",form.description)
        formData.append("title",form.title)
        console.log(formData)
        axios.post(config.baseUrl + '/institution/artwork/register',
            formData,
            {
                headers:{
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then(response => {
                //console.log(response.data.message)
                getDataFile()
            })
            .catch(error => {
                console.log(error)
            })
    }

    console.log(config.name)
    console.log(artworks)

    return (
        <div>
            {
                showModal &&
                <Modal hide={() => {
                    setShowModal(false);
                    setImage("")
                }}>
                    <div className="cart-modal-content">
                        <h3>Ajouter l'oeuvre</h3>
                        <p style={{fontSize: 'small'}}>Titre</p>
                        <TextArea rows={1} name="title" onChange={changeDescription} value={form.title}
                                  placeholder="Entrez le titre..."/>
                        <p style={{fontSize: 'small'}}>Image</p>
                        <input type="file" accept="image/*" onChange={onFile}/>
                        {image ? <img style={{width: "100%", height: 200, backgroundColor: "#eee"}} src={image}>
                            </img>
                            : <div style={{width: "100%", height: 130, backgroundColor: "#eee"}} src={image}>
                            </div>}
                        <p style={{fontSize: 'small'}}>Description</p>
                        <TextArea rows={10} placeholder="Entrez la description..." name="description"
                                  onChange={changeDescription}
                                  value={form.description}/>
                        <Button size="sm" onClick={(event) => {
                            setShowModal(false);
                            saveArtwork(event)
                        }}>Completer</Button>
                    </div>
                </Modal>
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
                        <TextArea rows={12}
                                  value={selectArtwork.description}/>
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
                    }} className={"artwork"} onClick={e => {
                        setShowModal(true)
                    }}>

                        <strong style={{color: "white", fontSize: 34}}>+</strong>

                    </div>
                    {artworks.map(artwork => (
                        <div className="artwork" style={{justifyContent: 'space-around', display: "flex", width: 110, height: 110, marginTop: '1vh'}} onClick={e => {
                            setSelectedArtwork(artwork); setSelectedWork(true)
                        }}>
                            {/*<p>{artwork.title}</p>*/}
                            <img src={imageLink.link+artwork.image} alt={artwork.owner_type}/>
                        </div>
                    ))}
                </div> : <div className="spinner_load_search">
                    {/*<Loader type="ThreeDots" height={70} width={70} color="#6B0C72"/>*/}
                    <LoaderIcon type="cylon" color="#6B0C72"/>
                </div>
            }
        </div>
    )

}

export default Work;
