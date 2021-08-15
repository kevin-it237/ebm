import React, {useEffect, useRef, useState} from 'react';
import './works.profile.scss'
import img from "../../../../assets/images/mansory.png";
import axios from "axios";
import config from '../../../../config/index'
import imageLink from '../../../../config/image.link'
import LoaderIcon from "react-loader-icon";
import Modal from "../../../../app/components/modal/modal";
import Button from "../../../../app/components/buttons/button/button";
import {TextArea} from "semantic-ui-react";

import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

const Work = () => {
    const inputFile = useRef(null);
    const [artworks, setArtwork] = useState([]);
    const [selectArtwork, setSelectedArtwork] = useState([]);
    const [del, setDel] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedWork, setSelectedWork] = useState(null);
    const [form, setForm] = useState({title: "", description: ""});
    const [image, setImage] = useState("")
    const [message, setMessage] = useState("")
    const [loader, setLoader] = useState(false)
    const [selectFile, setSelectFile] = useState("")
    const [error, setError] = useState(false)

    const [crop, setCrop] = useState({aspect: 1, width: 220, height: 220});
    const [croppedImageUrl, setCroppedImageUrl] = useState(null);
    const [imageRef, setImageRef] = useState(null);
    const onImageLoad = (image)=>{
        setImageRef(image)
    }

    const onCropComplet = (crop, pixelCrop)=>{
        if (imageRef && crop.width && crop.height) {
            console.log(getCroppedImg(imageRef, crop))
            const croppedImageUrl = getCroppedImg(imageRef, crop)
            setCroppedImageUrl(croppedImageUrl)
        }
    }

    const getCroppedImg=(image, crop)=>{
        const canvas = document.createElement("canvas");
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext("2d");

        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height
        )

        const reader = new FileReader()
        canvas.toBlob(blob => {
            reader.readAsDataURL(blob)
            reader.onloadend = () => {
                dataURLtoFile(reader.result, selectFile.name)
            }
        })
    }

    const dataURLtoFile = (dataurl, filename) => {
        let arr = dataurl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);

        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        let croppedImage = new File([u8arr], filename, {type:mime});
        setCroppedImageUrl(croppedImage)
    }

    useEffect(() => {
        getDataFile()
    }, []);

    const getDataFile = () => {
        setLoader(true)
        axios.get(config.baseUrl + '/institution/artwork/show')
            .then(response => {
                setArtwork(response.data.message)
                setLoader(false)
            })
            .catch(error => {
                console.log(error)
                setLoader(false)
            })
    }

    const onFile = (event) => {
        if (event.target.files[0].length === 0) {
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
        if (!selectFile) {
            return;
        }
        const formData = new FormData();
        if (!form.description){
            setMessage("Entrez une description")
            setError(true)
            return;
        }
        if (!form.title){
            setMessage("Entrez un titre")
            setError(true)
            return;
        }
        formData.append("image", croppedImageUrl)
        formData.append("description", form.description)
        formData.append("title", form.title)
        axios.post(config.baseUrl + '/institution/artwork/register',
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then(response => {
                console.log(response)
                setCroppedImageUrl("")
                setImage("")
                setForm("")
                getDataFile()
            })
            .catch(error => {
                console.log(error)
            })
        setShowModal(false);
    }

    const delArtwork = () => {
        axios.post(config.baseUrl + '/institution/artwork/delete', {id: selectArtwork.id})
            .then(res => {
                console.log(res.data)
                setMessage("Oeuvre supprimée");
                getDataFile();
            })
            .catch(error => {
                setMessage("Erreur")
            })
    }

    const onButtonClick = (e) => {
        e.preventDefault();
        inputFile.current.click()
    }

    return (
        <div>
            {
                showModal &&
                <Modal hide={() => {
                    setShowModal(false);
                }}>
                    <div className="cart-modal-content">
                        <h3>Ajouter l'oeuvre</h3>
                        <p style={{fontSize: 'small'}}>Titre</p>
                        <TextArea rows={1} name="title" onChange={changeDescription} value={form.title}
                                  placeholder="Entrez le titre..."/>
                        <p style={{fontSize: 'small'}}>Image</p>
                        <input id="inputFile" type="file" accept="image/*" ref={inputFile} onChange={onFile}
                               style={{display: "none"}}/>
                        {image ?
                            <ReactCrop src={image} crop={crop} onChange={(newCrop) => {setCrop(newCrop)}}
                                       minWidth="10" minHeight="10" locked
                                       onImageLoaded={onImageLoad} onComplete={onCropComplet} onClick={onButtonClick}/>

                            : <div style={{width: "100%", height: 200, backgroundColor: "#eee"}} src={image}
                                   onClick={onButtonClick}>
                            </div>}
                        <p style={{fontSize: 'small'}}>Description</p>
                        <TextArea rows={10} placeholder="Entrez la description..." name="description"
                                  onChange={changeDescription}
                                  value={form.description}/>
                        <Button size="sm" onClick={(event) => {
                            saveArtwork(event)
                        }}>Enregistrer</Button>
                    </div>
                </Modal>
            }
            {
                selectedWork &&
                <Modal hide={() => setSelectedWork(null)}>
                    <div className="cart-modal-content">
                        <h3>{selectArtwork.title}</h3>
                        <p style={{fontSize: 'medium'}}>Image</p>
                        <img src={imageLink.link + selectArtwork.image}
                             style={{width: "100%", backgroundColor: "#eee", height: 200}}
                             alt={selectArtwork.title}/>
                        <p style={{fontSize: 'medium'}}>Description</p>
                        <div style={{fontSize: 'small'}}>{selectArtwork.description}</div>
                        <Button size="sm" style={{backgroundColor: 'red'}} onClick={() => {
                            setDel(true)
                        }}>Supprimer</Button>
                    </div>
                </Modal>
            }
            {!loader && artworks.length !== 0 &&
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
                    <div className="artwork" style={{
                        justifyContent: 'space-around',
                        display: "flex",
                        width: 130,
                        height: 110,
                        marginTop: '1vh'
                    }} onClick={e => {
                        setSelectedArtwork(artwork);
                        setSelectedWork(true)
                    }}>
                        {/*<p>{artwork.title}</p>*/}
                        <img src={imageLink.link + artwork.image} alt={artwork.owner_type}/>
                    </div>
                ))}
            </div>
            }
            {loader && <div className="spinner_load_search">
                <LoaderIcon type="cylon" color="#6B0C72"/>
            </div>}
            {
                del && <Modal hide={() => setSelectedWork(null)}>
                    <center><h2>Voulez vous vraiment supprimer ?</h2></center>
                    <div style={{display: "flex", justifyContent: "space-between", marginTop: 20}}>
                        <Button size="sm" onClick={() => {
                            setSelectedWork(null);
                            setDel(false)
                        }}>Annuler</Button>
                        <Button size="sm" style={{backgroundColor: 'red'}}
                                onClick={() => {
                                    delArtwork();
                                    setSelectedWork(null);
                                    setDel(false)
                                }}>Confirmer</Button>
                    </div>

                </Modal>
            }
            {
                !loader&&artworks.length===0&&<div style={{
                    backgroundColor: "#eee",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: 100,
                    width: "25%"
                }} className={"artwork"} onClick={e => {
                    setShowModal(true)
                }}>
                    <strong style={{color: "white", fontSize: 34}}>+</strong>
                </div>
            }
            {
                error && <Modal hide={()=> {
                    setError(false); setShowModal(true)
                }}>
                    <center><h2>{message}</h2></center>
                    <Button size="sm" style={{backgroundColor: 'red'}}
                    onClick={()=> {
                        setError(false); setShowModal(true)
                    }}>Ok</Button>

                </Modal>
            }
        </div>
    )

}

export default Work;
