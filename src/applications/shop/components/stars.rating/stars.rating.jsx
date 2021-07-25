import React, { useState } from 'react';
import './stars.rating.scss'
import { ReactComponent as Star } from "../../../../assets/icons/star.svg"

const StarsRating = ({ 
    showProgresBar = false, 
    showNumberOfVotes = false,
    stars=5,
    votes=0
}) => {
    const [average, setAverage] = useState(votes);
    const [totalVotes, setTotalVotes] = useState(votes)

    const vote = (stars) => {
        console.log(`Voted ${stars}`);
        setAverage(stars); // To update. Calculate the average and set It here.
    }

    return (
        <div className="stars-line">
            <div className="stars">
                {[...Array(stars).keys()].map(i => (<Star onClick={() => vote(i+1)} key={i} className="star" />))}
            </div>
            {showProgresBar&&<div className="line" style={{ width: `${totalVotes*20}px` }}></div>}
            {showNumberOfVotes&&<p className="number">{totalVotes}</p>}
        </div>
    )
  
}

export default StarsRating;