import React, {useEffect, useState} from 'react';
import './reviews.scss'
import { ReactComponent as User } from "../../../../assets/icons/user.svg";
import InputSearch from '../../../../app/components/inputs/input.search/input.search';
import {useParams} from "react-router-dom";
import Rating from "@material-ui/lab/Rating";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import config from "../../../../config/index";
import Loader from "react-loader-spinner";

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        flexDirection: "column",
        "& > * + *": {
            marginTop: theme.spacing(1)
        }
    }
}));

const Reviews = () => {
    const params = useParams();

    const select = params.slug;
    const [reviews, setReviews] = useState([]);
    const [star, setStar] = useState(0);

    useEffect(()=>{
        axios.get(config.baseUrl+'/institution/review/show/'+select)
            .then(response=>{
                setReviews(response.data.message);
            })
            .catch(error=>{
                console.log(error)
            })
    }, [])

    const onKeyPress = (event)=>{
        const value = event.target.value;
        if (event.key === 'Enter'){
            axios.post(config.baseUrl+'/institution/review/store/'+select, {review: value, rating: star})
                .then(response=>{
                    console.log("err "+response.data.message)
                })
                .catch(error=>{
                    console.log(error)
                })
            axios.get(config.baseUrl+'/institution/review/show/'+select)
                .then(response=>{
                    setReviews(response.data.message);
                    console.log("err "+response.data.message)
                })
                .catch(error=>{
                    console.log(error)
                })

            event.target.value = "";
            setStar(0);
        }
    }

    const onClick = (event)=>{
        event.preventDefault();
    }

    return (
        <div className="reviews">
           <div className="reviews-header">
                <User />
                <Rating name="half-rating" precision={0.5} size="large" onChange={(event, newValue) => {
                setStar(newValue)}} value={star}/>
                <InputSearch name="query" onClick={onClick}
                              placeholder="Entrez votre commentaire..." onKeyPress={onKeyPress} rows="8" column="8"/>
           </div>
            {reviews.length ?
           <div className="text-reviews">
               {Object.keys(reviews).map((review, index)=>(
                   <div key={index} className="review-item">
                        <div className="review-item">
                            <div className="review-header">
                                <User />
                                <h4>{reviews[review].username}</h4>
                                <Rating name="half-rating" precision={0.5} value={reviews[review].rating}/>
                            </div>
                            <p className="content">{reviews[review].review}</p>
                        </div>
                   </div>
               ))}
           </div>
                : <div className="spinner_load_search">
                    <Loader type="Circles" height={70} width={70} timeout={5000} color="#6B0C72"/>
                </div>
            }
        </div>
    )
  
}

export default Reviews;