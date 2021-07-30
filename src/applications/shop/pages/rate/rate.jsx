import React from 'react';
import { useHistory } from 'react-router-dom';
import InputText from "../../../../app/components/inputs/input.text/input.text"
import { ReactComponent as Close } from "../../../../assets/icons/close24.svg";
import { ReactComponent as Check } from "../../../../assets/icons/check.svg";
import StarsRating from '../../components/stars.rating/stars.rating';
import './rate.scss';

const Chat = () => {
    const history = useHistory();

    return (
       <div id="rate-expert">
            <div className="header">
                <div className="top">
                    <Close className="close" onClick={() => history.goBack()}/>
                    <p className="title">Rate an expert</p>
                    <Check className="check-icon" />
                </div>
                <InputText className="idInput" placeholder="Enter expert id" />
            </div>

            <div className="rate-content">
                <div className="box text-box">
                    <h5>Your comment</h5>
                    <textarea rows={4} className="input-comment" placeholder="Type in your comment"></textarea>
                </div>

                <div className="box rating-box">
                    <h5>Your rating</h5>
                    <StarsRating stars={5} votes={4} />
                </div>
            </div>
           
       </div>
    )
}

export default Chat;