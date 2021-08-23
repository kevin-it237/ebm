import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { ReactComponent as Back } from "../../../../assets/icons/back_arrow.svg";
import { ReactComponent as Camera } from "../../../../assets/icons/camera.svg";
import { ReactComponent as Send } from "../../../../assets/icons/send.svg";
import SwipeToDelete from 'react-swipe-to-delete-ios'
import img from "../../../../assets/images/pic.jpg";
import './conversation.scss';
import axios from "axios";
import config from "../../../../config/index";
import dateFormat from 'dateformat';
import chatLink from '../../../../config/chat.link'
import {useSelector} from "react-redux";

const Chat = () => {
    const history = useHistory();
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
    const [imageSend, setImageSend] = useState(false)

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
    console.log(send.length)
    console.log(file)

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
        console.log(formData)
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

    console.log(messages)
    const getMessage=()=>{
        axios.get(config.baseUrl+'/chat/show')
        .then(response=>{
            setMessages(response.data.message);
            setLoader(false)
            setDisable(false)
        })
        .catch(error => {
            console.log(error)
            setLoader(false)
            setDisable(false)
        })
    }

    console.log(send)

    const onClick = (event)=>{
        event.preventDefault();
        setLoader(true)
        if (send) {
            axios.post(config.baseUrl + '/chat/register', {message: send})
                .then(response => {
                    console.log(response.data.message)
                })
                .catch(error => {
                    console.log(error)
                })
            setSend("")
            setFile("")
            getMessage();
        }
    
    }    
    
    const onKeyPress = (event)=>{
        if (event.key === 'Enter' && send.length!==0) {
            event.preventDefault();
            setLoader(true)
            axios.post(config.baseUrl+'/chat/register', {message: send, attachment: file})
            .then(response=>{
                console.log(response.data.message)
            })
            .catch(error => {
                console.log(error)
            })
            setSend("")
            setFile("")
            getMessage();
        }
    
    }

    console.log(disable)
    return (
       <div id="chat">
            <div className="header">
                <Back onClick={() => history.goBack()}/>
                <p>Conversation</p>
            </div>

            <div className="conversation-content">
                {Object.keys(messages).map((message, index)=>(
                    <div key={index} className={messages[message].message ? ("message "+(messages[message].user_id !== 0 ? "message--sent":"message--received"))
                    : ("attachment "+(messages[message].user_id !== 0 ? "attachment--sent":"attachment--received"))}>
                        {messages[message].message && <p>{messages[message].message}</p>}
                        {messages[message].attachment && <img src={chatLink.link+messages[message].attachment}/>}
                        <span>{dateFormat(messages[message].created_at, "dddd dS mmmm yyyy, h:mm")}</span>
                    </div>
                ))}
            </div>
            <div className="keyboard-wrapper">
                <div className="image-picker">
                    <label htmlFor="file"><Camera /></label>
                    {<input className="inputFile" id="file" type="file" src={image} onChange={onChangeFile}
                           accept="image/*"/>}
                </div>
                <input className="input-text" type="text" placeholder="Entrez votre message ..." name="send"
                    rows="10" onChange={onChange} value={send} onKeyPress={onKeyPress}/>
                {!loader&&disable&&<Send onClick={onClick}/>}
                {loader&&<svg width="20" height="20" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12.5" cy="12.5" r="11" stroke="#6B0C72" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>}
            </div>
       </div>
    )
}

export default Chat;