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

    const select = params.slug;
    const [reviews, setReviews] = useState([]);
    const [star, setStar] = useState(0);
    const [loader, setLoader] = useState(false);

    useEffect(() => {
        setLoader(true)
        getReviews()
    }, [])

    const getReviews=()=>{
        axios.get(config.baseUrl + '/institution/review/show/' + select)
            .then(response => {
                setReviews(response.data.message);
                setLoader(false)
            })
            .catch(error => {
                console.log(error)
                setLoader(false)
            })
    }

    const storeReviews=(value)=>{
        axios.post(config.baseUrl + '/institution/review/store/' + select, {review: value, rating: star})
            .then(response => {
                console.log(response.data.message)
            })
            .catch(error => {
                console.log(error)
            })
    }

    const onKeyPress = (event) => {
        const value = event.target.value;
        if (event.key === 'Enter') {
            storeReviews(value)
            event.target.value = "";
            setStar(0);
            getReviews()
        }
    }

    const onClick = (event) => {
        event.preventDefault();
    }
    return (
        <div className="reviews">
            <div className="reviews-header">
                <User/>
                <Rating name="half-rating" precision={0.25} size="large" onChange={(event, newValue) => {
                    setStar(newValue)
                }} value={star}/>
                <InputSearch name="query" onClick={onClick}
                             placeholder="Entrez votre commentaire..." onKeyPress={onKeyPress} rows="8" column="8"/>
            </div>
            {reviews.length!==0 && !loader &&
            <div className="text-reviews">
                {Object.keys(reviews).map((review, index) => (
                    <div key={index} className="review-item">
                        <div className="review-item">
                            <div className="review-header">
                                <User/>
                                <h4>{reviews[review].username}</h4>
                                <Rating readOnly disabled name="half-rating" precision={0.25}
                                        value={reviews[review].rating}/>
                            </div>
                            <p className="content">{reviews[review].review}</p>
                        </div>
                    </div>
                ))}
            </div>
            }
            {
                reviews.length===0 && loader &&
                <div>
                    <LoaderIcon type={"cylon"} color={"#6B0C72"}/>
                </div>
            }
            {
                reviews.length===0 && !loader && <center>
                    <br/>
                    <img src={require("../../../../assets/images/telescope.png").default}/>
                    <p>Aucun Commentaires</p>
                </center>

            }

        </div>
    )

}

export default Reviews;