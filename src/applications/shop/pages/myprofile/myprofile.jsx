import React, {useEffect, useState, useRef, useCallback} from 'react';
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
import LoaderIcon from "react-loader-icon";
import logoLink from "../../../../config/logo.link";
import Modal from "../../../../app/components/modal/modal";
import ReactTimeAgo from 'react-time-ago'
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import ExpertDemand from "../../../shop/components/historique/expert.demand";
import ServiceDemand from "../../../shop/components/historique/service.demand";
import ProductDemand from "../../../shop/components/historique/product.demand";
import Select from "react-select";
import Slider from "react-slick";
import {confirmationPass, verifiedEmail, verifiedPassword, verifiedPhone} from "../../../../config/helpers";

const MyProfile = () => {

    const stateExpert = [
        {
            value: 0,
            label: "EN ATTENTE"
        },
        {
            value: 1,
            label: "ANNULÉ"
        }
    ]

    const stateService = [
        {
            value: 0,
            label: "ACCEPTÉ"
        },
        {
            value: 1,
            label: "COMPLETÉ"
        },
        {
            value: 3,
            label: "REJETÉ"
        }
    ]

    const settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 3,
    };

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
    const [phoneError, setPhone] = useState("");
    const [selectFile, setSelectFile] = useState("");//get selecte image
    const [image, setImage] = useState("");//store url selected image
    const [created, setCreated] = useState(0);
    const [comment, setComment] = useState("");
    const [message, setMessage] = useState(false);
    const [loaderProf, setLoaderProf] = useState("");
    const [error, setError] = useState(false);
    const [imageProfile, setImageProfile] = useState("");
    const [loader, setLoader] = useState(false);
    const [editProf, setEditProf] = useState(false);
    const [passTrue, setPasstrue] = useState(false);
    const [expertOrder, setExpertOrder] = useState([]);//get expert order
    const [cart, setCart] = useState(false);//get expert order
    const [orderExpertState, setOrderExpertState] = useState("");//get expert order
    const [orderExpertId, setOrderExpertId] = useState(null);//get order id
    const [loaderState, setloaderState] = useState(false);//loader for state
    const [order, setOrder] = useState(1);//load order to show
    const [activ, setActiv] = useState(false);//load order to show

    const [serviceOrder, setServiceOrder] = useState([]);//loader for state
    const [serviceLoader, setServiceLoader] = useState(false);//loader for state
    const [productOrder, setProductOrder] = useState([]);//loader for state
    const [productLoader, setProductLoader] = useState(false);//loader for state
    const [expertLoader, setExpertLoader] = useState(false);//loader for state

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
                        console.log(res.data.message)
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
        getOrderExpert();
        setLoader(true)

    }, []);

    const onSelect = (event) => {
        setOrderExpertState(event.label)
    }

    const changeOrderExpertState = (e) => {
        e.preventDefault();
        setCart(false)
        setloaderState(true)
        let url;
        if (content === "Demandes d'expert") {
            url = '/institution/expert/changestate'
        } else if (content === "Commandes de service") {
            url = '/user/service/order/changestate'
        } else {
            url = '/user/product/order/changestate'
        }
        axios.post(config.baseUrl + url, {
            order_id: orderExpertId,
            state: orderExpertState,
            comment: comment
        })
            .then(res => {
                if (content === "Demandes d'expert") {
                    getOrderExpert()
                } else if (content === "Commandes de service") {
                    console.log(res.data.message)
                    getOrderService()
                } else {
                    console.log(res.data.message)
                    getOrderProduct()
                }
                setloaderState(false)
            })
            .catch(err => {
                console.log(err)
                setloaderState(false)
            })
    }

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
                    if (response.data.message.role === 'EXPERT') {
                        axios.get(config.baseUrl + '/institution/info')
                            .then(response => {
                                setImageProfile(response.data.message.logo)
                            })
                    }
                    setLoader(false)
                }
                getOrderService()
                getOrderProduct()
                getOrderExpert()
            })
            .catch(error => {
                console.log(error)
            })
    }

    const getJoinedDate = () => {
        axios.get(config.baseUrl + '/user/show')
            .then(res => {
                setCreated(res.data.message.created_at)
            })
            .catch(err => {
                console.log(err)
            })
    }

    const editProfile = (event) => {
        event.preventDefault();
        setEditProf(false)
        setLoaderProf(true)
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
                    setLoaderProf(false)
                    setMessage("Modification Enregistrée")
                })
                .catch(error => {
                    console.log(error)
                    setLoaderProf(false)
                    setMessage("Erreur d'enregistrement")
                })
        } else {
            user['address'] = infoForm.address;
            user['phone'] = infoForm.phone;
            axios.put(config.baseUrl + '/user/update', {...user})
                .then(response => {
                    setLoaderProf(false)
                    setMessage("Modification Enregistrée")
                })
                .catch(error => {
                    setLoaderProf(false)
                    setMessage("Erreur d'enregistrement")
                    console.log(error)
                })
        }
    }

    const editProfilePassword = (event) => {
        event.preventDefault();
        setEditProf(false)
        setLoaderProf(true)
        const user = {
            password: infoForm2.password,
            confirmation: infoForm2.confirmation
        }
        axios.put(config.baseUrl + '/user/password/edit', {...user})
            .then(response => {
                setLoaderProf(false)
                setMessage("Modification Enregistrée")
            })
            .catch(error => {
                console.log(error)
                setLoaderProf(false)
                setMessage("Erreur d'enregistrement")
            })
    }

    const confirmEdit = (e) => {
        e.preventDefault();
        if (!emailError&&!phoneError){
            setEditProf(true)
        }
    }


    const confirmEditPass = (e) => {
        e.preventDefault();
        if (infoForm2.password) {
            if (!passwordError && !confirmationError){
                //setEditProf(true)
                setPasstrue(true)
            }
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

    const getOrderExpert = () => {
        setExpertLoader(true)
        axios.get(config.baseUrl + '/institution/expert/order/index')
            .then(res => {
                setExpertOrder(res.data.message)
                setExpertLoader(false)
            })
            .catch(err => {
                console.log(err)
                setExpertLoader(false)
            })
    }
    const getOrderService = () => {
        setServiceLoader(true)
        axios.get(config.baseUrl + '/user/service/order/index')
            .then(res => {
                setServiceOrder(res.data.message)
                setServiceLoader(false)
            })
            .catch(err => {
                console.log(err)
                setServiceLoader(false)
            })
    }
    const getOrderProduct = () => {
        setProductLoader(true)
        axios.get(config.baseUrl + '/user/product/order/index')
            .then(res => {
                setProductOrder(res.data.message)
                setProductLoader(false)
            })
            .catch(err => {
                console.log(err)
                setProductLoader(false)
            })
    }

    const onBlur = (e) => {
        if (e.target.name === 'email') {
            const email = e.target.value;
            if (!verifiedEmail(email)) {
                setEmail("Doit etre un email valide")
                setError(true)
            } else {
                setEmail("")
                setError(false)
            }
        } else if (e.target.name === 'password') {
            const password = e.target.value;
            if (!verifiedPassword(password)) {
                setError(true)
                setErrorPassword("Doit contenir au moins 6 caractéres")
            } else {
                setErrorPassword("")
                setError(false)
            }
        } else if (e.target.name === 'confirmation' && infoForm2.password) {
            const confirmation = e.target.value;
            const password = infoForm2.password;
            if (!confirmationPass(password, confirmation)) {
                setError(true)
                setConfirmation("Doit correspondre au mot de passe");
            } else {
                setError(false)
                setConfirmation("")
            }
        }else if (e.target.name === 'password' && infoForm2.confirmation){
            const confirmation = e.target.value;
            const password = infoForm2.confirmation;
            console.log(password)
            if (!confirmationPass(password, confirmation)) {
                setError(true)
                setConfirmation("Doit correspondre au mot de passe de confirmation");
            } else {
                setError(false)
                setConfirmation("")
            }
        }
        else if (e.target.name === 'phone' || e.target.name === 'institution_phone') {
            const phone = e.target.value;
            setPhone(verifiedPhone(phone))
            if (verifiedPhone(phone) === "Doit contenir 9 chiffres" || verifiedPhone(phone) === "Doit etre un numero"){
                setError(true)
            }else {
                setError(false)
            }
        }
    }

    const MENU_ITEMS_USER = ["Information", "Mot de passe", "Commandes de service", "Commandes de produit"];
    const MENU_ITEMS_EXPERT = ["Information", "Mot de passe", "Services", "Oeuvres", "Demandes d'expert", "Commandes de produit"];
    const MENU_ITEMS = ["Information", "Mot de passe", "Services", "Oeuvres", "Demandes d'expert", "Commandes de service", "Commandes de produit"];

    const changeContent = (contentName) => {
        setContent(contentName);
    }
    // Change form input values.
    const onChange = (e) => {
        e.preventDefault()
        if (e.target.name === 'phone' || e.target.name === 'institution_phone'){
            setPhone(verifiedPhone(e.target.value))
            if (verifiedPhone(e.target.value) === "Doit contenir 9 chiffres" || verifiedPhone(e.target.value) === "Doit etre un numero"){
                setError(true)
            }else {
                setError(false)
            }
        }
        setInfoForm({...infoForm, [e.target.name]: e.target.value});
    }

    // Change form input values.
    const onChange2 = (e) => {
        e.preventDefault()
        setInfoForm2({...infoForm2, [e.target.name]: e.target.value});
    }

    const commentChange = (e) => {
        e.preventDefault();
        setComment(e.target.value)
    }

    let bottomContent;
    if (content === "Information") {
        bottomContent = (<div className={"signup-container"} style={{width: "100%"}}>
            {infoForm ? <form className="auth-container">
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
                            {<p className="errorMessage">{input === 'phone' ? <div>{phoneError}</div> : ""}</p>}

                        </div>
                    ))}

                    <Button onClick={confirmEdit}
                            variant="primary"
                            type="submit"
                            loading={loaderProf}
                            disabled={error}
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
            <form className="auth-container">
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
                    loading={loader}
                    disabled={error}
                    size="lg">Editer
                </Button>


            </form>


        </div>);
    } else if (content === "Services") {
        bottomContent = (<Services/>);
    } else if (content === "Oeuvres") {
        bottomContent = (<Works/>);
    } else if (content === "Demandes d'expert") {
        {
            bottomContent = (expertOrder.length!==0&&!expertLoader&&<div style={{marginTop: -10}}>
                {Object.keys(expertOrder).map((e, index) => (
                    <div key={index} onClick={(event) => {
                        event.preventDefault();
                        setCart(true);
                        setOrderExpertId(expertOrder[e].id);
                        setComment(expertOrder[e].comment)
                    }}
                         className={(infoUser.role === 'EXPERT' && expertOrder[e].state === 'ANNULÉ') || (infoUser.role === 'INSTITUTION' && expertOrder[e].state === 'COMPLETÉ')
                         || (infoUser.role === 'INSTITUTION' && expertOrder[e].state === 'REJETÉ') ? "disable" : ""}>
                        <ExpertDemand name={expertOrder[e].name} date={expertOrder[e].date}
                                      state={expertOrder[e].state} id={index + 1}/>
                    </div>))}
            </div>)|| (
                expertOrder.length===0&&!expertLoader&&
                    <div><br/>
                        <center>
                            <img src={require("../../../../assets/images/telescope.png").default}/>
                            <p>{infoUser.role === 'INSTITUTION' ? "Aucune demande d'expert éffectuée" : "Aucune demande d'expert reçue"}</p>
                        </center>
                    </div>)||(
                        expertOrder.length===0&&expertLoader&&
                        <div>
                            <LoaderIcon type="cylon" color="#6B0C72"/>
                        </div>
            )
        }
    } else if (content === "Commandes de service") {
            bottomContent = (!serviceLoader&&serviceOrder.length!==0&&<div>
                {Object.keys(serviceOrder).map((e, index) => (
                    <div key={index} onClick={(event) => {
                        event.preventDefault();
                        setCart(true);
                        setOrderExpertId(serviceOrder[e].id);
                        setComment(serviceOrder[e].comment)
                    }}
                         className={(infoUser.role === 'user' && serviceOrder[e].state === 'COMPLETÉ') || (infoUser.role === 'INSTITUTION' && serviceOrder[e].state === 'ANNULÉ') ? "disable" : ""}>
                        <ServiceDemand services={serviceOrder[e].service} name={serviceOrder[e].name}
                                       date={serviceOrder[e].date}
                                       state={serviceOrder[e].state} id={index + 1}/></div>
                ))}
            </div>) || (!serviceLoader&&serviceOrder.length===0&&
                <div>
                    <br/>
                    <center>
                        <img src={require("../../../../assets/images/telescope.png").default}/>
                        <p>{infoUser.role === 'INSTITUTION' ? "Aucune demande de service reçue" : infoUser.role === 'EXPERT' ? "Aucune demande de service" : "Aucune demande de service éffectuée"}</p>
                    </center>
                </div>) || (serviceLoader&&serviceOrder.length===0&&
                <div>
                    <LoaderIcon type="cylon" color="#6B0C72"/>
                </div>
            )
    } else if (content === "Commandes de produit") {
        {
            bottomContent = (
                !productLoader&&productOrder.length !==0&&
                <div>
                    {Object.keys(productOrder).map((e, index) => (
                        <div key={index} onClick={event => {
                            event.preventDefault();
                            history.push('/order/product/' + productOrder[e].id)
                            /*setCart(true); setOrderExpertId(productOrder[e].id); setComment(productOrder[e].comment)*/
                        }}
                             className={((infoUser.role === 'EXPERT' || infoUser.role === 'INSTITUTION' || infoUser.role === 'user') && productOrder[e].state === 'COMPLETÉ') ? "disable" : ""}>
                            <ProductDemand amount={productOrder[e].price} date={productOrder[e].date}
                                           state={productOrder[e].state} id={index + 1}/>
                        </div>))}
                </div>
            )||
            (productLoader&&productOrder.length === 0&&
            <div>
                <LoaderIcon type="cylon" color="#6B0C72"/>
            </div>)||
                (!productLoader&&productOrder.length===0&&
                    <div>
                        <br/>
                        <center>
                            <img src={require("../../../../assets/images/telescope.png").default}/>
                            <p>Aucune commande de produits éffectuées</p>
                        </center>
                    </div>
                    )
        }
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
                        {/*<p>Joined <ReactTimeAgo date={created} locale="fr-FR" timeStyle="round"/></p>*/}
                        {<p>Compte crée le {created.split(" ")[0]}</p>}
                    </div>
                </div>
                {infoUser.role === 'user' &&
                <Slider {...settings} className='menu'>
                    {
                        MENU_ITEMS_USER.map(item => (
                            <div>
                                <h2 key={item} onClick={() => changeContent(item)} className={`menu ${content === item ? "actived" : ""}`}>{item}</h2>
                                {content === item && <span className="span-bottom"></span>}
                            </div>
                        ))
                    }
                </Slider>
                }
                {infoUser.role === 'EXPERT' &&
                <Slider {...settings} className='menu'>
                    {
                        MENU_ITEMS_EXPERT.map(item => (
                            <div>
                                <h2 key={item} onClick={() => changeContent(item)} className={`menu ${content === item ? "actived" : ""}`}>{item}</h2>
                                {content === item && <span className="span-bottom"></span>}
                            </div>
                        ))
                    }
                </Slider>
                }
                {infoUser.role === 'INSTITUTION' &&
                <Slider {...settings} className='menu'>
                    {
                        MENU_ITEMS.map(item => (
                            <div>
                                <h2 key={item} onClick={() => changeContent(item)} className={`menu ${content === item ? "actived" : ""}`}>{item}</h2>
                                {content === item && <span className="span-bottom"></span>}
                            </div>
                        ))
                    }
                </Slider>
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
                            {selectFile && <Button size="sm" style={{background: "green", marginLeft: 5}} onClick={(event) => {
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
                    <center><h2 style={{fontSize: 'small', marginTop: 10}}>Enregistrez vos modifications ?</h2></center>
                    <br/>
                    <div style={{display: "flex", justifyContent: "space-between"}}>
                        <Button onClick={(e) => {
                            e.preventDefault();
                            setEditProf(false);
                            getUserData();
                            setLoader(true)
                        }}>Annuler</Button>
                        <Button onClick={passTrue ? editProfilePassword : editProfile}
                                style={{background: "green", marginLeft: 10}}>Oui</Button>
                    </div>
                </Modal>
            }
            {/*
                loaderProf &&
                <Modal>
                    <LoaderIcon type="cylon" color="#6B0C72"/>
                </Modal>
            */}
            {
                !loaderProf && message &&
                <Modal hide={() => setMessage(false)}>
                    <center><h2 style={{fontSize: "small"}}>{message}</h2></center>
                </Modal>
            }
            {
                cart &&
                <Modal hide={() => {
                    setCart(false)
                }}>
                    <div>
                        <h1 style={{fontSize: 'medium', color: '#6B0C72', marginTop: -6, marginBottom: 5}}>Modifier la
                            commande</h1>
                        <br/>
                        {infoUser.role === 'INSTITUTION' &&
                        <Select
                            options={content === "Demandes d'expert" ? stateExpert : content === "Commandes de service" ? stateService : stateExpert}
                            placeholder="Changer l'etat..." onChange={onSelect}/>
                        }
                        {(infoUser.role === 'INSTITUTION' && content === "Commandes de produit") || (infoUser.role === 'INSTITUTION' && content === "Demandes d'expert") &&
                        <textarea onChange={commentChange} value={comment} rows="10"
                                  placeholder="Entrez un commentaire ..."
                                  style={{
                                      padding: 10,
                                      fontSize: "small",
                                      width: '100%',
                                      border: "none",
                                      marginTop: 5,
                                      marginBottom: 5
                                  }}/>}
                        {
                            (infoUser.role === 'INSTITUTION' && content === "Commandes de service") &&
                            <h2 style={{
                                fontSize: "small",
                                wordWrap: "break-word",
                                marginTop: 10,
                                marginBottom: 10
                            }}>{comment}</h2>
                        }
                        {
                            infoUser.role === 'user' &&
                            <div>
                                <Select
                                    options={stateExpert} placeholder="Changer l'etat..." onChange={onSelect}/>
                                <textarea onChange={commentChange} value={comment} rows="10"
                                          placeholder="Entrez un commentaire ..."
                                          style={{
                                              padding: 10,
                                              fontSize: "small",
                                              width: '100%',
                                              border: "none",
                                              marginTop: 5,
                                              marginBottom: 5
                                          }}/>
                            </div>
                        }
                        {
                            infoUser.role === 'EXPERT' &&
                            <Select
                                options={content === "Demandes d'expert" ? stateService : stateExpert}
                                placeholder="Changer l'etat..." onChange={onSelect}/>
                        }
                        <br/>
                        {
                            infoUser.role === 'EXPERT' && content === "Commandes de produit" ?
                                <textarea onChange={commentChange} value={comment} rows="10"
                                          placeholder="Entrez un commentaire ..."
                                          style={{padding: 10, fontSize: "small", width: '100%', border: "none",
                                              marginTop: 5, marginBottom: 5}}/>
                                : content === "Demandes d'expert" ? <h2 style={{
                                    fontSize: "small",
                                    wordWrap: "break-word",
                                    marginTop: 10,
                                    marginBottom: 10
                                }}>{comment}</h2> : ""
                        }
                        <br/>
                        <Button
                            onClick={changeOrderExpertState}>Enregistrer</Button>
                    </div>

                </Modal>
            }
            {//loader pour sauvegarder l'etat de la demande
                loaderState &&
                <Modal hide={() => {
                    setCart(false)
                }}>
                    <div className="spinner_load_search">
                        <LoaderIcon type="cylon" color="#6B0C72"/>
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
