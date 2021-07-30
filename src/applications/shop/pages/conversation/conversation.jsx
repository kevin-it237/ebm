import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { ReactComponent as Back } from "../../../../assets/icons/back_arrow.svg";
import { ReactComponent as Camera } from "../../../../assets/icons/camera.svg";
import { ReactComponent as Send } from "../../../../assets/icons/send.svg";
import userImg from "../../../../assets/images/avatar.png";
import img from "../../../../assets/images/pic.jpg";
import './conversation.scss';

const Chat = () => {
    const history = useHistory();

    return (
       <div id="chat">
            <div className="header">
                <Back onClick={() => history.goBack()}/>
                <p>Conversation</p>
                <img className="avatar" src={userImg} alt="" />
            </div>

            <div className="conversation-content">
                <div className="message message--sent">
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua</p>
                    <span>Thu 20, 15:00</span>
                </div>
                <div className="message message--received">
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua</p>
                    <span>Thu 20, 15:00</span>
                </div>
                <div className="message message--received">
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua</p>
                    <span>Thu 20, 15:00</span>
                </div>
                <div className="attachment attachment--received">
                    <img className="image" src={img} alt="" />
                    <span>Thu 20, 15:00</span>
                </div>
                <div className="attachment attachment--sent">
                    <img className="image" src={img} alt="" />
                    <span>Thu 20, 15:00</span>
                </div>
                <div className="message message--received">
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua</p>
                    <span>Thu 20, 15:00</span>
                </div>
            </div>

            <div className="keyboard-wrapper">
                <div className="image-picker">
                    <label htmlFor="file"><Camera /></label>
                    <input className="inputFile" id="file" type="file" />
                </div>
                <input className="input-text" type="text" placeholder="Type a message here" />
                <Send />
            </div>
       </div>
    )
}

export default Chat;