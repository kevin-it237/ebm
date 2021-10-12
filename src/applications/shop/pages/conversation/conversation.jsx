import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { ReactComponent as Back } from "../../../../assets/icons/back_arrow.svg";
import { ReactComponent as Camera } from "../../../../assets/icons/camera.svg";
import { ReactComponent as Send } from "../../../../assets/icons/send.svg";
import SwipeToDelete from 'react-swipe-to-delete-ios'
import img from "../../../../assets/images/pic.jpg";
import addMessage from "../../../../assets/icons/add_message_25px.png"
import './conversation.scss';
import axios from "axios";
import config from "../../../../config/index";
import dateFormat from 'dateformat';
import chatLink from '../../../../config/chat.link'
import productLink from "../../../../config/product.link";
import {useDispatch, useSelector} from "react-redux";
import LoaderIcon from "react-loader-icon";

const Chat = () => {
    const history = useHistory();
    const dispatch = useDispatch()
    const user = useSelector(state=>state.user.payload)

    console.log(user)


    const app_key ='e5f7daf67a4335b5a2ea';
    const [messages, setMessages] = useState("");
    const [send, setSend] = useState("");
    const [file, setFile] = useState("");
    const [image, setImage] = useState("");
    const [showImage, setShowImage] = useState(false)
    const [loader, setLoader] = useState(false)
    const [disable, setDisable] = useState(false)
    const [charge, setCharge] = useState(false)


    useEffect(() => {
        getMessage();
        /*dispatch({
            type: 'ADD_TO_PATH',
            payload: history.location.pathname
        })
        */
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
        setCharge(true)
        axios.get(config.baseUrl+'/chat/show')
        .then(response=>{
            setMessages(response.data.message);
            setCharge(false)
            setDisable(false)
        })
        .catch(error => {
            setCharge(false)
            setDisable(false)
        })
    }

    console.log(send)

    const onClick = (event)=>{
        event.preventDefault();
        if (send) {
            setMessages("")
            setLoader(true)
            axios.post(config.baseUrl + '/chat/register', {message: send})
                .then(response => {
                    getMessage();
                    setLoader(false)
                })
                .catch(error => {
                    setLoader(false)
                })
            setSend("")
            setFile("")
        }
    
    }   


    console.log("loader") 
    console.log(loader)
    
    const onKeyPress = (event)=>{
        if (event.key === 'Enter' && send.length!==0) {
            event.preventDefault();
            setMessages("")
            setLoader(true)
            axios.post(config.baseUrl+'/chat/register', {message: send, attachment: file})
            .then(response=>{
                getMessage();
                setLoader(false)
            })
            .catch(error => {
                console.log(error)
                setLoader(false)
            })
            setSend("")
            setFile("")
        }
    
    }

    console.log(messages)
    return (
       <div id="chat">
            <div className="header">
                <Back onClick={() => history.goBack()}/>
                <p>Conversation</p>
            </div>

           {messages && !loader &&<div className="conversation-content">
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
           {!charge&&<div className="keyboard-wrapper">
               <div className="image-picker">
                   <label htmlFor="file"><Camera/></label>
                   {<input className="inputFile" id="file" type="file" src={image} onChange={onChangeFile}
                           accept="image/*"/>}
               </div>
               <input className="input-text" type="text" placeholder="Entrez votre message ..." name="send"
                      onChange={onChange} value={send} onKeyPress={onKeyPress}/>
               {disable && !loader&& <Send onClick={onClick}/>}
               {loader &&
               <svg width="20" height="20" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                   <circle cx="12.5" cy="12.5" r="11" stroke="#6B0C72" strokeWidth="3" strokeLinecap="round"
                           strokeLinejoin="round"/>
               </svg>}
           </div>}
           {
               messages.length===0&&charge&&
               <div>
                   <LoaderIcon type="cylon" color="#6B0C72"/>
               </div>
           }
       </div>
    )
}

export default Chat;