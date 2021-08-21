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
import LoaderIcon from "react-loader-icon";
import img from "../../../../assets/images/ebm.svg";

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
    const [reviews, setReviews] = useState([]);
    const [loader, setLoader] = useState(false);

    useEffect(()=>{
        setLoader(true)
        axios.get(config.baseUrl+'/expert/review/show/'+identity)
            .then(response=>{
                setReviews(response.data.message);
                setLoader(false)
            })
            .catch(error=>{
                console.log(error)
                setLoader(false)
            })
    }, [])


    return (
        <div className="reviews_expert">
            {!loader&&reviews.length !==0&&
                <div className="text-reviews">
                   {Object.keys(reviews).map((review, index) => (
                       <div key={index} className="review-item">
                           <div className="review-item">
                               <div className="review-header">
                                   <User/>
                                   <h4>{reviews[review].username}</h4>
                                   <Rating name="half-rating" readOnly disabled precision={0.5}
                                           value={reviews[review].rating}/>
                               </div>
                               <p className="content">{reviews[review].review}</p>
                           </div>
                       </div>
                   ))}
               </div>
            }
            {
                reviews.length ===0&&loader&&<center>
                    <br/>
                    <LoaderIcon type={"cylon"} color={"#6B0C72"}/>
                </center>
            }
            {
                reviews.length ===0&&!loader&&
                    <center>
                        <br/>
                        <img src={require("../../../../assets/images/telescope.png").default}/>
                        <p>Aucun Commentaires</p>
                    </center>

            }
        </div>
    )

}

export default Reviews;