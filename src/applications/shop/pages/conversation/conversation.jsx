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

const Chat = () => {
    const history = useHistory();

    const app_key ='e5f7daf67a4335b5a2ea';
    const [messages, setMessages] = useState("");
    const [hours, setHours] = useState("");
    const [send, setSend] = useState("");
    const [file, setFile] = useState("");
    const [datas, setData] = useState([]);

    useEffect(() => {
        const pusher = new Pusher(app_key, {
            cluster: 'eu'
        });
        const channel = pusher.subscribe('ebm-chat');
          channel.bind('chat', function(data) {
            setData(JSON.stringify(data));
        });
        getMessage();
    }, [])

    const onChange = (event)=>{
        setSend(event.target.value)
    }   
    
    const onChangeFile = (event)=>{
        setFile(event.target.value)
    }


    console.log(messages)

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
        setSend("");
        setFile("");
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
    
            getMessage();

            setSend("");
            setFile("");
        }
    
    }

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

            <div className="keyboard-wrapper">
                <div className="image-picker">
                    <label htmlFor="file"><Camera /></label>
                    <input className="inputFile" id="file" type="file" onChange={onChangeFile}/>
                </div>
                <input className="input-text" type="text" placeholder="Entrez votre message ..." 
                    rows="10" onChange={onChange} value={send} onKeyPress={onKeyPress}/>
                <Send onClick={onClick}/>
            </div>
       </div>
    )
}

export default Chat;