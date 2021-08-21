import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { ReactComponent as Back } from "../../../../assets/icons/back_arrow.svg";
import { ReactComponent as Camera } from "../../../../assets/icons/camera.svg";
import { ReactComponent as Send } from "../../../../assets/icons/send.svg";
import userImg from "../../../../assets/images/avatar.png";
import img from "../../../../assets/images/pic.jpg";
import './conversation.scss';
import axios from "axios";
import config from "../../../../config/index";
import dateFormat from 'dateformat';
import Pusher from 'pusher-js';
import BottomDrawer from "../../../../app/components/bottom.drawer/bottom.drawer";
import Slider from "@material-ui/core/Slider";
import Rating from "@material-ui/lab/Rating";
import Button from "../../../../app/components/buttons/button/button";

const Chat = () => {
    const history = useHistory();

    const app_key ='e5f7daf67a4335b5a2ea';
    const [messages, setMessages] = useState("");
    const [hours, setHours] = useState("");
    const [send, setSend] = useState("");
    const [file, setFile] = useState("");
    const [image, setImage] = useState("");
    const [showImage, setShowImage] = useState(false)

    useEffect(() => {
        getMessage();
    }, [])

    const onChange = (event)=>{
        setSend(event.target.value)
    }   
    
    const onChangeFile = (event)=>{
        if(event.target.files[0].length === 0){
            return;
        }
        const blob = new Blob([event.target.files[0]])
        setFile(event.target.files[0])
        const url = URL.createObjectURL(blob)
        setImage(url)
        setShowImage(true)
    }

    const getMessage=()=>{
        axios.get(config.baseUrl+'/chat/show')
        .then(response=>{
            setMessages(response.data.message);
        })
        .catch(error => {
            console.log(error)
        })
    }

    const onClick = (event)=>{
        event.preventDefault();
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
    
    const onKeyPress = (event)=>{
        if (event.key === 'Enter') {
            event.preventDefault();
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

    console.log(showImage)
    return (
       <div id="chat">
            <div className="header">
                <Back onClick={() => history.goBack()}/>
                <p>Conversation</p>
                <img className="avatar" src={userImg} alt="" />
            </div>

            <div className="conversation-content">
                {Object.keys(messages).map((message, index)=>(
                    <div key={index} className={"message "+(messages[message].user_id !== 1 ? "message--sent":"message--received")}>
                        <p>{messages[message].message}</p>
                        <span>{dateFormat(messages[message].created_at, "dddd dS mmmm yyyy, h:mm")}</span>
                    </div>
                ))}
            </div>
           {
               showImage && <img style={{height: 180, width: '100%'}} id="file" type="file" src={image} onChange={onChangeFile}
                                 accept="image/*"/>
           }
            <div className="keyboard-wrapper">
                <div className="image-picker">
                    <label htmlFor="file"><Camera /></label>
                    {/*<input className="inputFile" id="file" type="file" src={image} onChange={onChangeFile}
                           accept="image/*"/>*/}
                </div>
                <input className="input-text" type="text" placeholder="Entrez votre message ..." name="send"
                    rows="10" onChange={onChange} value={send} onKeyPress={onKeyPress}/>
                <Send onClick={onClick}/>
            </div>
       </div>
    )
}

export default Chat;