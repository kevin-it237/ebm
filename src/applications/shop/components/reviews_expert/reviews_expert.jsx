import React, {useEffect, useState} from 'react';
import './reviews_expert.scss'
import { ReactComponent as User } from "../../../../assets/icons/user.svg";
import InputSearch from '../../../../app/components/inputs/input.search/input.search';
import Rating from "@material-ui/lab/Rating";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import config from "../../../../config/index";
import {useSelector} from "react-redux";
import Loader from "react-loader-spinner";
import {useParams} from "react-router-dom";

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

    const identity = params.slug;
    //const identity = useSelector((state)=>state.product.payload.identity);
    const [reviews, setReviews] = useState([]);
    const [star, setStar] = useState(0);

    useEffect(()=>{
        axios.get(config.baseUrl+'/expert/review/show/'+identity)
            .then(response=>{
                setReviews(response.data.message);
            })
            .catch(error=>{
                console.log(error)
            })
    }, [])


    return (
        <div className="reviews_expert">
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
                    <Loader type="Circles" height={70} width={70} color="#6B0C72"/>
                </div>
            }
        </div>
    )
  
}

export default Reviews;