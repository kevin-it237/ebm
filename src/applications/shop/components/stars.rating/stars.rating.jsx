import React, { useState } from 'react';
import './stars.rating.scss'
import { ReactComponent as StarFill } from "../../../../assets/icons/star_fill.svg"
import { ReactComponent as StarEmpty } from "../../../../assets/icons/star.svg"

const StarsRating = (props) => {
    console.log(props.votes)
    const [average, setAverage] = useState(props.votes);
    const [totalVotes, setTotalVotes] = useState(props.votes)

    const vote = (stars) => {
        console.log(`Voted ${stars}`);
        setAverage(stars); // To update. Calculate the average and set It here.
    }

    return (
        <div className="stars-line">
            <div className="stars">
                {[...Array(props.stars).keys()].map(i => (<StarFill onClick={() => vote(i+1)} key={i} className="star" />))}
            </div>
            {props.showProgresBar&&<div className="line" style={{ width: `${(props.votes/props.total)*100}px` }}></div>}
            {props.showNumberOfVotes&&<p className="number">{props.votes}</p>}
        </div>
    )
  
}

export default StarsRating;