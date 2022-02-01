import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { ReactComponent as Back } from "../../../../assets/icons/back_arrow.svg";
import { ReactComponent as Camera } from "../../../../assets/icons/camera.svg";
import { ReactComponent as Send } from "../../../../assets/icons/send.svg";
import img from "../../../../assets/images/pic.jpg";
import './conversation.scss';
import axios from "axios";
import config from "../../../../config/index";
import chatLink from '../../../../config/chat.link'
import productLink from "../../../../config/product.link";
import {useDispatch, useSelector} from "react-redux";
import LoaderIcon from "react-loader-icon";
import {isMobile} from "../../../../config/helpers";
import {toast} from "react-toastify";

const Chat = () => {
    const history = useHistory();
    const messagesNew = useSelector(state=>state.message.payload);
    const dispatch = useDispatch()
    const user = useSelector(state=>state.user.payload)


    const app_key ='e5f7daf67a4335b5a2ea';
    const [messages, setMessages] = useState([]);
    const [send, setSend] = useState("");
    const [file, setFile] = useState("");
    const [image, setImage] = useState("");
    const [showImage, setShowImage] = useState(false)
    const [loader, setLoader] = useState(false)
    const [disable, setDisable] = useState(false)
    const [charge, setCharge] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)


    useEffect(() => {
        getMessage();
    }, [])

    const onChange = (event)=>{
        event.preventDefault()
        setSend(event.target.value)
        if (event.target.value.length === 0){
            setDisable(false)
        }else {
            setDisable(true)
        }
    }  


    const onChangeFile = (event)=>{
        event.preventDefault()
        if(event.target.files[0].length === 0){
            setDisable(false)
            return;
        }
        setDisable(true)
        const formData = new FormData();
        const blob = new Blob([event.target.files[0]])
        setFile(event.target.files[0])
        const url = URL.createObjectURL(blob)
        formData.append('attachment', event.target.files[0])
        setImage(url)
        setShowImage(true)
        axios.post(config.baseUrl + '/chat/register', formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then(response => {
                getMessage();
            })
            .catch(error => {
                console.log(error)
            })

    }


    const getMessage=()=>{
        setLoader(true)
        setMessages([])
        setCharge(true)
        axios.get(config.baseUrl+'/chat/show')
        .then(response=>{
            //setMessages(response.data.message);
            dispatch({
                type: 'ADD_TO_MESSAGE',
                payload: response.data.message
            })
            setCharge(false)
            setLoader(false)
            setDisable(false)
        })
        .catch(error => {
            setCharge(false)
            setDisable(false)
            setLoader(false)

            if (error.response) {
                // Request made and server responded
                console.log(error.response.data);
                console.log(error.response.data.message);
                if(error.response.data.message.startsWith("Attempt to read property \"email_verified_at\" on null")){
                    console.log("Ce compte n'existe pas !")
                }else if (error.response.data.message.startsWith("Mot de passe ne correspond pas")){
                    console.log("Mot passe ou Role incorrect !")
                }
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                console.log(error.request);
                setErrorMessage("Erreur de connexion !")

            } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
            }
        })
    }


    const onClick = (event)=>{
        event.preventDefault();
        if (send !== " ") {
            setMessages([])
            setLoader(true)
            axios.post(config.baseUrl + '/chat/register', {message: send})
                .then(response => {
                    getMessage();
                    setSend("")
                    setFile("")
                })
                .catch(error => {
                    if(error.request){
                        notifyFailed("Vérifier votre connexion !")
                    }else if(error.response.data){
                        console.log(error.response.data)
                    }
                    setLoader(false)
                })
        }else {
            setSend("")
            setFile("")
        }

    
    }

    const notifyFailed = (err) => {
        toast.error(err)
    }

    console.log(messagesNew)
    console.log(loader)

    const onKeyPress = (event)=>{
        if (event.key === 'Enter' && send.length!==0) {
            if (send !== " "){
                event.preventDefault();
                setMessages([])
                setLoader(true)
                axios.post(config.baseUrl+'/chat/register', {message: send, attachment: file})
                    .then(response=>{
                        dispatch({
                            type: 'ADD_TO_MESSAGE',
                            payload: []
                        })
                        getMessage();
                    })
                    .catch(error => {
                        console.log(error)
                        setLoader(false)
                    })
                setSend("")
                setFile("")
            }else{
                setSend("")
                setFile("")
            }
        }
    
    }

    return (
       <div id="chat">
            <div className="header">
                <Back onClick={() => history.goBack()}/>
                <p>Conversation</p>
            </div>

           {/*isMobile()&&
               <div>{messagesNew !== 0 &&<div className="conversation-content">
                   {Object.keys(messagesNew).map((message, index) => (
                       <div key={index}
                            className={messagesNew[message].message ? ("message " + (messagesNew[message].role_id !== 1 ? "message--sent" : "message--received"))
                                : ("attachment " + (messagesNew[message].role_id !== 1 ? "attachment--sent" : "attachment--received"))}>
                           {messagesNew[message].message && <p>{messagesNew[message].message}</p>}
                           {messagesNew[message].attachment && <img
                               src={messagesNew[message].role_id !== 1 ? chatLink.link + messagesNew[message].attachment : productLink.link + messagesNew[message].attachment}/>}
                           <span>{messagesNew[message].created_at}</span>
                       </div>
                   ))}
               </div>}
           </div>*/}

           {/*isMobile()&&
           <div>{messagesNew.length !== 0 && !loader && <div className="conversation-content">
               {Object.keys(messagesNew).map((message, index) => (
                   <div key={index}
                        className={messagesNew[message].message ? ("message " + (messagesNew[message].role_id !== 1 ? "message--sent" : "message--received"))
                            : ("attachment " + (messagesNew[message].role_id !== 1 ? "attachment--sent" : "attachment--received"))}>
                       {messagesNew[message].message && <p>{messagesNew[message].message}</p>}
                       {messagesNew[message].attachment && <img
                           src={messagesNew[message].role_id !== 1 ? chatLink.link + messagesNew[message].attachment : productLink.link + messagesNew[message].attachment}/>}
                       <span>{messagesNew[message].created_at}</span>
                   </div>
               ))}
           </div>}
           </div>
           */}
           {/*!isMobile()&&
               <div>{messages.length !== 0 && !loader && <div className="conversation-content-web">
                   {Object.keys(messages).map((message, index) => (
                       <div key={index}
                            className={messages[message].message ? ("message " + (messages[message].role_id !== 1 ? "message--sent" : "message--received"))
                                : ("attachment " + (messages[message].role_id !== 1 ? "attachment--sent" : "attachment--received"))}>
                           {messages[message].message && <p>{messages[message].message}</p>}
                           {messages[message].attachment && <img
                               src={messages[message].role_id !== 1 ? chatLink.link + messages[message].attachment : productLink.link + messages[message].attachment}/>}
                           <span>{messages[message].created_at}</span>
                       </div>
                   ))}
               </div>}
           </div>
           */}
           {/*!isMobile()&&
               <div>{messagesNew !== 0 && <div className="conversation-content-web">
                   {Object.keys(messagesNew).map((message, index) => (
                       <div key={index}
                            className={messagesNew[message].message ? ("message " + (messagesNew[message].role_id !== 1 ? "message--sent" : "message--received"))
                                : ("attachment " + (messagesNew[message].role_id !== 1 ? "attachment--sent" : "attachment--received"))}>
                           {messagesNew[message].message && <p>{messagesNew[message].message}</p>}
                           {messagesNew[message].attachment && <img
                               src={messagesNew[message].role_id !== 1 ? chatLink.link + messagesNew[message].attachment : productLink.link + messagesNew[message].attachment}/>}
                           <span>{messagesNew[message].created_at}</span>
                       </div>
                   ))}
               </div>}
           </div>
           */}
           {isMobile()&& <div>{messagesNew.length !== 0 && <div className={messagesNew!==0 ? "conversation-content-mobile" : ""}>
               {Object.keys(messagesNew).map((message, index) => (
                   <div key={index}>
                       {messagesNew[message].role_id!==1&&<div className="send">
                           {messagesNew[message].message &&
                               <div className="message--sent">
                                   <p>{messagesNew[message].message}</p>
                               </div>}
                           {messagesNew[message].attachment &&
                               <div className="attachment--sent">
                                   <img
                                       src={chatLink.link + messagesNew[message].attachment}/>
                               </div>}
                           <span style={{marginTop: '5px'}}>{messagesNew[message].created_at}</span>
                       </div>}

                       {messagesNew[message].role_id===1&&<div className="received">
                           {messagesNew[message].message &&
                               <div className="message--received">
                                   <p>{messagesNew[message].message}</p>
                               </div>}
                           {messagesNew[message].attachment &&
                               <div className="attachment--received">
                                   <img src={productLink.link + messagesNew[message].attachment}/>/>
                               </div>}
                           <span style={{marginTop: '5px'}}>{messagesNew[message].created_at}</span>
                       </div>}
                   </div>
               ))}
           </div>}
           </div>
           }
           {!isMobile()&&
               <div>{messagesNew.length !== 0 && <div className={messagesNew!==0 ? "conversation-content-web-new" : ""}>
                   {Object.keys(messagesNew).map((message, index) => (
                       <div key={index}>
                           {messagesNew[message].role_id!==1&&<div className="send">
                               {messagesNew[message].message &&
                                    <div className="message--sent">
                                        <p>{messagesNew[message].message}</p>
                                    </div>}
                               {messagesNew[message].attachment &&
                                   <div className="attachment--sent">
                                       <img
                                           src={chatLink.link + messagesNew[message].attachment}/>
                                   </div>}
                               <span style={{marginTop: '5px'}}>{messagesNew[message].created_at}</span>
                           </div>}
                           {messagesNew[message].role_id===1&&<div className="received">
                               {messagesNew[message].message &&
                               <div className="message--received">
                                   <p>{messagesNew[message].message}</p>
                               </div>}
                               {messagesNew[message].attachment &&
                               <div className="attachment--received">
                                   <img src={productLink.link + messagesNew[message].attachment}/>/>
                               </div>}
                               <span style={{marginTop: '5px'}}>{messagesNew[message].created_at}</span>
                           </div>}
                       </div>
                   ))}
               </div>}
           </div>
           }

           {isMobile()&&<div className="keyboard-wrapper">
               <div className="image-picker">
                   <label htmlFor="file"><Camera/></label>
                   {<input className="inputFile" id="file" type="file" src={image} onChange={onChangeFile}
                           accept="image/*"/>}
               </div>
               <input className="input-text" type="text" placeholder="Entrez votre message ..." name="send"
                      onChange={onChange} value={send} onKeyPress={onKeyPress}/>
               {disable && !loader && <Send onClick={onClick}/>}
               {loader &&
               <svg width="20" height="20" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                   <circle cx="12.5" cy="12.5" r="11" stroke="#6B0C72" strokeWidth="3" strokeLinecap="round"
                           strokeLinejoin="round"/>
               </svg>}
           </div>}
           {!isMobile()&&<div className="keyboard-wrapper-web">
               <div className="image-picker">
                   <label htmlFor="file"><Camera/></label>
                   {<input className="inputFile" id="file" type="file" src={image} onChange={onChangeFile}
                           accept="image/*"/>}
               </div>
               <input className="input-text" type="text" placeholder="Entrez votre message ..." name="send"
                      onChange={onChange} value={send} onKeyPress={onKeyPress}/>
               {disable && !loader && <Send onClick={onClick}/>}
               {loader &&
               <svg width="20" height="20" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                   <circle cx="12.5" cy="12.5" r="11" stroke="#6B0C72" strokeWidth="3" strokeLinecap="round"
                           strokeLinejoin="round"/>
               </svg>}
           </div>}
           {!isMobile()&&messagesNew.length ===0&&loader&&<div style={{position: 'absolute', top: '40%', left: '55%'}}>{
               <div>
                   <LoaderIcon type="cylon" color="#6B0C72"/>
               </div>
           }</div>}
           {isMobile()&&messagesNew.length ===0&&loader&&<div>{
               <div>
                   <LoaderIcon type="cylon" color="#6B0C72"/>
               </div>
           }</div>}

            {!isMobile()&&messagesNew.length ===0&&!loader&&<div style={{position: 'absolute', top: '40%', left: '55%'}}>{
               <center>
                    <br/>
                    <img src={require("../../../../assets/images/telescope.png").default}/>
                    <p>Vous n'avez pas de message</p>
                </center>
           }</div>}
           {isMobile()&&messagesNew.length ===0&&!loader&&<div>{
               <center>
                    <br/>
                    <img src={require("../../../../assets/images/telescope.png").default}/>
                    <p>Vous n'avez pas de message</p>
                </center>
           }</div>}

           {isMobile()&&errorMessage&&!loader&&<div>{
               <center>
                   <br/>
                   <img src={require("../../../../assets/images/telescope.png").default}/>
                   <p>{errorMessage}</p>
               </center>
           }</div>}
           {!isMobile()&&errorMessage&&!loader&&<div style={{position: 'absolute', top: '40%', left: '55%'}}>{
               <center>
                   <br/>
                   <img src={require("../../../../assets/images/telescope.png").default}/>
                   <p>{errorMessage}</p>
               </center>
           }</div>}
       </div>
    )
}

export default Chat;