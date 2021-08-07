import React, { useState, useEffect } from 'react';
import './stars.rating.scss'
import { ReactComponent as StarFill } from "../../../../assets/icons/star_fill.svg"
import { ReactComponent as StarEmpty } from "../../../../assets/icons/star.svg"

const StarsRating = (props) => {
    const [average, setAverage] = useState(props.votes);
    const [totalVotes, setTotalVotes] = useState(props.votes)
    const [vote, setVote] = useState(0);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        console.log("err "+props.votes)
        setVote(props.votes);
        setTotal(props.total);
    }, [])

    const voteStar = (stars) => {
        console.log(`Voted ${stars}`);
        setAverage(stars); // To update. Calculate the average and set It here.
    }


    return (
        <div className="stars-line">
            <div className="stars">
                {[...Array(props.stars).keys()].map(i => (<StarFill onClick={() => voteStar(i+1)} key={i} className="star" />))}
            </div>
            {props.showProgresBar&&<div className="line" style={{ width: `${(vote/total)*100}px` }}></div>}
            {props.showNumberOfVotes&&<p className="number">{vote}</p>}
        </div>
    )
  
}

export default StarsRating;