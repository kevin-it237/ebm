import React, {useEffect, useState, useRef} from 'react';
import TimeAgo from 'javascript-time-ago'
import fr from 'javascript-time-ago/locale/en'
import './myprofile.scss'
import {useHistory} from 'react-router';
import {ReactComponent as Back} from "../../../../assets/icons/back.svg"
import Services from "../../components/services.profile/services.profile"
import Works from "../../components/works.profile/works.profile"
import img from "../../../../assets/images/mansory.png";
import {ReactComponent as Uneye} from "../../../../assets/icons/uneye.svg";
import {ReactComponent as Eye} from "../../../../assets/icons/eye.svg";
import Button from "../../../../app/components/buttons/button/button";
import config from "../../../../config/index";
import axios from "axios";
import Slider from '@material-ui/core/Slider'
import LoaderIcon from "react-loader-icon";
import logoLink from "../../../../config/logo.link";
import Modal from "../../../../app/components/modal/modal";
import ReactTimeAgo from 'react-time-ago'
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import ExpertDemand from "../../../shop/components/historique/expert.demand";
import ServiceDemand from "../../../shop/components/historique/service.demand";
import ProductDemand from "../../../shop/components/historique/product.demand";
import {TextArea} from "semantic-ui-react";

const MyProfile = () => {

    TimeAgo.addLocale(fr)
    const timeAgo = new TimeAgo('fr-CA')
    const history = useHistory()
    const inputFile = useRef(null);
    const [showPassword, setPassword] = useState(false);
    const [content, setContent] = useState("Information");
    const [infoForm, setInfoForm] = useState({name: "", surname: "", email: "", address: "", phone: ""});
    const [infoUser, setInfoUser] = useState([]);
    const [infoForm2, setInfoForm2] = useState({password: "", confirmation: ""});
    const [emailError, setEmail] = useState("");
    const [passwordError, setErrorPassword] = useState("");
    const [confirmationError, setConfirmation] = useState("");
    const [selectFile, setSelectFile] = useState("");
    const [image, setImage] = useState("");
    const [created, setCreated] = useState(0);
    const [join, setJoined] = useState("");
    const [imageProfile, setImageProfile] = useState("");
    const [loader, setLoader] = useState(false);
    const [editProf, setEditProf] = useState(false);
    const [passTrue, setPasstrue] = useState(false);

    const [crop, setCrop] = useState({aspect: 1, width: 150, height: 150});
    const [changePhotoProfile, setChangeProfilPhoto] = useState(false);
    const [croppedImageUrl, setCroppedImageUrl] = useState(null);
    const [imageRef, setImageRef] = useState(null);

    const onImageLoad = (image) => {
        setImageRef(image)
    }

    const onCropComplet = (crop, pixelCrop) => {
        if (imageRef && crop.width && crop.height) {
            const croppedImageUrl = getCroppedImg(imageRef, crop)
            setCroppedImageUrl(croppedImageUrl)
        }
    }

    const getCroppedImg = (image, crop) => {
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

        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        let croppedImage = new File([u8arr], filename, {type: mime});
        setCroppedImageUrl(croppedImage)
    }

    const handleFileUpload = (event) => {
        if (!event.target.files[0]) {
            return;
        }
        if (event.target.files[0].length === 0) {
            return;
        }
        const blob = new Blob([event.target.files[0]])
        setSelectFile(event.target.files[0])
        const url = URL.createObjectURL(blob)
        setImage(url)
    }

    const savePhotoProfile = () => {
        setChangeProfilPhoto(false)
        setLoader(true)
        const formData = new FormData();
        formData.append("logo", croppedImageUrl)
        axios.post(config.baseUrl + '/user/edit/profile/photo', formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then(res => {
                axios.get(config.baseUrl + '/user/profile/photo')
                    .then(res => {
                        setImageProfile(res.data.message)
                        setLoader(false)
                    })
                    .catch(error => {
                        console.log(error)
                        setLoader(false)
                    })
            })
            .catch(error => {
                console.log(error)
            })
        setSelectFile("")
    }


    useEffect(() => {
        getUserData()
        getJoinedDate();
        setLoader(true)

    }, []);

    const getUserData = () => {
        axios.get(config.baseUrl + '/user/show')
            .then(response => {
                setInfoUser(response.data.message)
                if (response.data.message.role === 'INSTITUTION') {
                    axios.get(config.baseUrl + '/institution/info')
                        .then(response => {
                            setInfoForm({
                                name: response.data.message.name,
                                surname: response.data.message.surname,
                                email: response.data.message.email,
                                address: response.data.message.address,
                                phone: response.data.message.phone,
                            })
                            setImageProfile(response.data.message.logo)
                            setLoader(false)
                        })
                        .catch(error => {
                            console.log(error)
                        })
                } else {
                    setInfoForm({
                        name: response.data.message.firstname,
                        surname: response.data.message.lastname,
                        email: response.data.message.email,
                        address: response.data.message.address,
                        phone: response.data.message.phone
                    })
                    console.log(response.data.message.role)
                    if (response.data.message.role === 'EXPERT') {
                        axios.get(config.baseUrl + '/institution/info')
                            .then(response => {
                                setImageProfile(response.data.message.logo)
                                console.log(response.data.message)
                            })
                    }
                    setLoader(false)
                }
            })
            .catch(error => {
                console.log(error)
            })
    }

    const getJoinedDate = () => {
        axios.get(config.baseUrl + '/user/show')
            .then(res => {
                setCreated(res.data.message.created_at)
                const time = timeAgo.format(Date.now() - Date.parse(res.data.message.created_at));
                setJoined(time)
                console.log(time)
            })
            .catch(err => {
                console.log(err)
            })
    }

    const editProfile = (event) => {
        event.preventDefault();
        let user = {
            firstname: infoForm.name,
            lastname: infoForm.surname,
            email: infoForm.email
        }
        if (infoUser.role === 'INSTITUTION') {
            user['institution_address'] = infoForm.address;
            user['institution_phone'] = infoForm.phone;
            axios.put(config.baseUrl + '/institution/update', {...user})
                .then(response => {
                })
                .catch(error => {
                    console.log(error)
                })
        } else {
            user['address'] = infoForm.address;
            user['phone'] = infoForm.phone;
            axios.put(config.baseUrl + '/user/update', {...user})
                .then(response => {
                })
                .catch(error => {
                    console.log(error)
                })
        }
    }

    const editProfilePassword = (event) => {
        event.preventDefault();
        const user = {
            password: infoForm2.password,
            confirmation: infoForm2.confirmation
        }
        axios.put(config.baseUrl + '/user/password/edit', {...user})
            .then(response => {
            })
            .catch(error => {
                console.log(error)
            })
    }

    const confirmEdit = (e) => {
        e.preventDefault();
        setEditProf(true)
    }

    const confirmEditPass = (e) => {
        if (infoForm2.password) {
            e.preventDefault();
            setEditProf(true)
            setPasstrue(true)
        }
    }


    const clickChange = (e) => {
        e.preventDefault();
        setChangeProfilPhoto(true)
    }

    const onButtonClick = (e) => {
        e.preventDefault();
        inputFile.current.click()
    }

    const MENU_ITEMS_USER = ["Information", "Mot de passe", "Historique des Commandes", "Demandes d'expert", "Demandes de service", "Demandes de produit"];
    const MENU_ITEMS = ["Information", "Mot de passe", "Services", "Oeuvres", "Demandes d'expert", "Demandes de service", "Demandes de produit"];

    const changeContent = (contentName) => {
        setContent(contentName);
    }
    // Change form input values.
    const onChange = (e) => {
        setInfoForm({...infoForm, [e.target.name]: e.target.value});
    }

    // Change form input values.
    const onChange2 = (e) => {
        setInfoForm2({...infoForm2, [e.target.name]: e.target.value});
    }

    const onSubmit = () => {

    }

    const onBlur = (e) => {

    }

    let bottomContent;
    if (content === "Information") {
        bottomContent = (<div className={"signup-container"} style={{width: "100%"}}>
            {infoForm ? <form onSubmit={onSubmit} className="auth-container">
                    {Object.keys(infoForm).map((input, index) => (
                        <div key={index} className="auth-container__input-container">
                            <input
                                name={input}
                                onChange={onChange}
                                onBlur={onBlur}
                                value={infoForm[input]}
                                type={'text'}
                                autoComplete={"off"}
                                required
                                className={`auth-container__input`}
                            />
                            {<p className="errorMessage">{input === 'email' ? <div>{emailError}</div> : ""}</p>}

                        </div>
                    ))}

                    <Button onClick={confirmEdit}
                            variant="primary"
                            type="submit"
                            size="lg">Editer
                    </Button>
                </form> :
                <div className="spinner_load_search">
                    <LoaderIcon type="cylon" color="#6B0C72"/>
                </div>
            }
        </div>);
    } else if (content === "Mot de passe") {
        bottomContent = (<div className={"signup-container"} style={{width: "100%"}}>
            <form onSubmit={onSubmit} className="auth-container">
                {Object.keys(infoForm2).map((input, index) => (
                    <div key={index} className="auth-container__input-container">
                        <input
                            name={input}
                            onChange={onChange2}
                            onBlur={onBlur}
                            value={infoForm2[input]}
                            placeholder={`${input}`}
                            type={(input === 'password' || input === 'confirmation') ? showPassword ? 'text' : 'password' : 'text'}
                            autoComplete={"off"}
                            required
                            className={`auth-container__input ${(input === 'password' || input === 'confirmation') ? 'password' : ''}`}
                        />{<p className="errorMessage">{input === 'password' ? <div>{passwordError}</div> : ""}</p>}
                        {<p className="errorMessage">{input === 'email' ? <div>{emailError}</div> : ""}</p>}
                        {<p className="errorMessage">{input === 'confirmation' ?
                            <div>{confirmationError}</div> : ""}</p>}
                        {input === 'password' ? showPassword ? <Uneye onClick={() => setPassword(!showPassword)}/> :
                            <Eye onClick={() => setPassword(!showPassword)}/> : ''}
                    </div>
                ))}
                <Button
                    onClick={confirmEditPass}
                    variant="primary"
                    type="submit"
                    size="lg">Editer
                </Button>


            </form>


        </div>);
    } else if (content === "Services") {
        bottomContent = (<Services/>);
    } else if (content === "Oeuvres") {
        bottomContent = (<Works/>);
    } else if (content === "Demandes d'expert") {
        bottomContent = (<div style={{marginTop: -20}}>
            {[1, 2, 3, 4, 4, 5, 5, 6, 7, 7].map(e => (<ExpertDemand onClick={e => {
                alert("hi")
            }} name={"Himalayas Insititute of beauty"} date={"24/07/2021"} state={"EN ATTENTE"} id={e}/>))}
        </div>);
    } else if (content === "Demandes de service") {
        bottomContent = (<div style={{marginTop: -20}}>
            {[1, 2, 3, 4, 4, 5, 5, 6, 7, 7].map(e => (<ServiceDemand onClick={e => {
                alert("hi")
            }} services={"Manicure,Pedicure,Pieds,Jambes"} name={"Himalayas Insititute of beauty"} date={"24/07/2021"}
                                                                     state={"EN ATTENTE"} id={e}/>))}
        </div>);
    } else if (content === "Demandes de produit") {
        bottomContent = (<div style={{marginTop: -20}}>
            {[1, 2, 3, 4, 4, 5, 5, 6, 7, 7].map(e => (<ProductDemand onClick={e => {
                alert("hi")
            }} amount={"135, 000 XAF"} date={"24/07/2021"} state={"EN ATTENTE"} id={e}/>))}
        </div>);
    }

    return (
        <div id="institute">
            <div className="header">
                <div className="header-title">
                    <Back onClick={() => history.goBack()}/>
                    <h4>{infoUser.firstname} {infoUser.lastname}</h4>
                </div>
            </div>

            {!loader && <div className="institute-content">
                <div className="owner-infos">
                    {infoUser.role !== 'user' ?
                        <div>
                            {imageProfile ?
                                <img className="avatar"
                                     style={{width: 80, height: 80, borderRadius: '50%', marginRight: 10}}
                                     src={logoLink.link + imageProfile} alt={infoUser.username} onClick={clickChange}/>
                                : <div onClick={clickChange} style={{
                                    backgroundColor: "#eee",
                                    opacity: 0.8,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    height: 75,
                                    width: 75,
                                    marginRight: 10,
                                    borderRadius: '50%',
                                    boxShadow: '0 2px 15px rgba(#000, .35)'
                                }}>
                                    <strong style={{color: "white", fontSize: 34}}>+</strong>
                                </div>
                            }
                        </div>
                        :
                        ""
                    }
                    <div className={infoUser.role === 'user' ? "marge" : ""}>
                        <h3 className="name">{infoUser.firstname} {infoUser.lastname}</h3>
                        {<p>Joined <ReactTimeAgo date={created} locale="en-US" timeStyle="round"/></p>}
                    </div>
                </div>
                {infoUser.role === 'user' ?
                    <div style={{overflowX:"auto",overflowY:"hidden"}}>
                        <div className="menu">
                            {
                                MENU_ITEMS_USER.map(item => (
                                    <h2 key={item} onClick={() => changeContent(item)}
                                        className={`menu-item ${content === item ? "actived" : ""}`}>{item}</h2>
                                ))
                            }
                        </div>
                    </div>
                    : <div style={{overflowX:"auto",overflowY:"hidden"}}>
                        <div className="menu">
                            {
                                MENU_ITEMS.map(item => (
                                    <h2 key={item} onClick={() => changeContent(item)}
                                        className={`menu-item ${content === item ? "actived" : ""}`}>{item}</h2>
                                ))
                            }
                        </div>
                    </div>
                }
                <div className="bottom-content">
                    {bottomContent}
                </div>
            </div>}
            {
                changePhotoProfile &&
                <Modal hide={() => {
                    setChangeProfilPhoto(false);
                }}>
                    <div className="cart-modal-content" style={{marginTop: 12}}>
                        <input id="inputFile" ref={inputFile} accept='image/*' onChange={handleFileUpload} type="file"
                               style={{display: 'none'}}/>
                        {imageProfile && !selectFile &&
                        <img src={logoLink.link + imageProfile}
                             style={{width: "100%", height: 200}}/>
                        }
                        {!imageProfile && !selectFile &&
                        <div style={{width: "100%", height: 200, backgroundColor: "#eee"}} src={image}
                             onClick={onButtonClick}>
                        </div>}
                        {
                            selectFile && <ReactCrop src={image} crop={crop} onChange={(newCrop) => {
                                setCrop(newCrop)
                            }}
                                                     circularCrop locked minWidth="20" maxHeight="20"
                                                     onImageLoaded={onImageLoad} onComplete={onCropComplet}/>
                        }
                        <div style={{display: "flex"}}>
                            <Button size="sm" onClick={(event) => {
                                onButtonClick(event)
                            }}>Editer</Button>
                            {selectFile && <Button size="sm" style={{background: "green"}} onClick={(event) => {
                                event.preventDefault();
                                savePhotoProfile()
                            }}>Ok</Button>}
                        </div>

                    </div>
                </Modal>
            }
            {
                editProf &&
                <Modal hide={() => {
                    setEditProf(false)
                }}>
                    <div>
                        <center>
                            <h2>Enregistrez vos modifications ?</h2>
                        </center>
                        <div style={{display: "flex", justifyContent: "space-between"}}>
                            <Button onClick={(e) => {
                                e.preventDefault();
                                setEditProf(false);
                                getUserData();
                                setLoader(true)
                            }}>Annuler</Button>
                            <Button onClick={passTrue ? editProfilePassword : editProfile}
                                    style={{background: "green"}}>Oui</Button>
                        </div>
                    </div>

                </Modal>
            }
            {loader && <div className="spinner_load_search">
                <LoaderIcon type="cylon" color="#6B0C72"/>
            </div>}
        </div>
    )

}

export default MyProfile;
