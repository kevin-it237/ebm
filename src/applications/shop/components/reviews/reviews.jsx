import React, { useState } from 'react';
import './reviews.scss'
import { ReactComponent as User } from "../../../../assets/icons/user.svg";
import InputText from '../../../../app/components/inputs/input.search/input.search';
import StarsRating from "../stars.rating/stars.rating"

const Reviews = () => {
    

    return (
        <div className="reviews">
           <div className="reviews-header">
                <User />
                <StarsRating stars={5} />
                <InputText name="query" placeholder="Write your review here..." />
           </div>
           <div className="text-reviews">
                <div className="review-item">
                    <div className="review-header">
                        <User />
                        <h4>Mike Moore</h4>
                        <StarsRating stars={5} />
                    </div>
                    <p className="content">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                </div>
                <div className="review-item">
                    <div className="review-header">
                        <User />
                        <h4>Mike Moore</h4>
                        <StarsRating stars={5} />
                    </div>
                    <p className="content">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                </div>
           </div>
        </div>
    )
  
}

export default Reviews;