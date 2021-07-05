import React from 'react';
import InputSearch from "../../../../app/components/inputs/input.search/input.search";
import './search.scss' 
import img from "../../../../assets/images/ebm.svg"

const Search = () => {

    return (
        <div id="search">
            <div className="search">
                <h2>Instituts</h2>
                <InputSearch placeholder="Type something to search here..." />
            </div>

            <div className="section-title">
                <h2>2 Institutions trouvées</h2>
                <span></span>
            </div>

            <div className="search-results">
                <div className="result">
                    <img src={img} alt="" />
                    <div>
                        <h4 className="name"> Carimo Institute</h4>
                        <p className="address">Cradat, Yaoundé</p>
                    </div>
                </div>
                <div className="result">
                    <img src={img} alt="" />
                    <div>
                        <h4 className="name"> Carimo Institute</h4>
                        <p className="address">Cradat, Yaoundé</p>
                    </div>
                </div>
            </div>
            
        </div>
    )
}

export default Search;