import React, {useState} from 'react';
import { useHistory } from 'react-router-dom';
import InputText from "../../../../app/components/inputs/input.text/input.text"
import { ReactComponent as Close } from "../../../../assets/icons/close24.svg";
import { ReactComponent as Check } from "../../../../assets/icons/check.svg";
import Rating from "@material-ui/lab/Rating";
import './rate.scss';
import axios from "axios";
import config from "../../../../config/index";

const Chat = () => {
    const history = useHistory();


    const [star, setStar] = useState(0);
    const [review, setReview] = useState("");
    const [name, setName] = useState("");

    const onChange = (event)=>{
        setReview(event.target.value);
    } 
    
    const onChangeName = (event)=>{
        setName(event.target.value);
    }

    const onClick = (event)=>{
        event.preventDefault();
        axios.post(config.baseUrl+'/expert/review/store/'+name, {review: review, rating: star})
        .then(res =>{
            console.log(res.data.message);
            setReview("");
            setStar(0);
        })
        .catch(err=>{
            console.log(err)
        })
    }


    console.log(star)

    return (
       <div id="rate-expert">
            <div className="header">
                <div className="top">
                    <Close className="close" onClick={() => history.goBack()}/>
                    <p className="title">Notez un Expert</p>
                    <Check className="check-icon" onClick={onClick}/>
                </div>
                <InputText className="idInput" required placeholder="Enter expert id" onChange={onChangeName} value={name}/>
            </div>

            <div className="rate-content">
                <div className="box text-box">
                    <h5>Votre Commentaire</h5>
                    <textarea rows={4} className="input-comment" onChange={onChange} value={review} placeholder="Entrez votre commenatire..."></textarea>
                </div>

                <div className="box rating-box">
                    <h5>Votre Note</h5>
                    <Rating name="half-rating" precision={0.5} size="large" onChange={(event, newValue) => {
                        setStar(newValue)}} value={star}/>
                </div>
            </div>
           
       </div>
    )
}

export default Chat;