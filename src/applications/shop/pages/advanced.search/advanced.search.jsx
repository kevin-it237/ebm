import React, { useState } from 'react';
import InputSearch from "../../../../app/components/inputs/input.search/input.search";

import { ReactComponent as Close } from "../../../../assets/icons/close.svg";
import { ReactComponent as Filter } from "../../../../assets/icons/filter.svg";
import Region from "../../../../assets/icons/region.svg"
import './advanced.search.scss' 
import Map from "../../../../assets/icons/map.svg";
import List from "../../../../assets/icons/list.svg";
import Telescope from "../../../../assets/images/telescope.png"
import BottomDrawer from "../../../../app/components/bottom.drawer/bottom.drawer"
import img from "../../../../assets/images/cils.jpg"
import { useHistory } from 'react-router-dom';

const AdvancedSearch = () => {
    const [display, setDisplay] = useState("LIST")
    const [showFilter, setShowFilter] = useState(false)
    const history = useHistory()

    const changeView = (view) => {
        setDisplay(view)
    }

    const openFilterMenu = () => {
        setShowFilter(!showFilter)
    }

    return (
        <>
        <div id="advanced-search">
            <div className="top">
                <Close onClick={() => history.goBack()} />
                <h2>Recherche</h2>
            </div>

            <div className="search">
                <InputSearch placeholder="Search query..." />
                <div className="actual-position">
                    <img src={Region} alt="" />
                    <p>Ma position actuelle</p>
                </div>
                <div className="filter-box">
                    <div className="filter">
                        <div onClick={openFilterMenu}>
                            <Filter />
                            <h5>Filtrer par ...</h5>
                        </div>
                    </div>
                    <div className="view-settings">
                        {
                            display==="LIST" ?
                            <div onClick={() => changeView("MAP")}><img src={Map} alt="" /><h5>Map </h5></div>:
                            <div onClick={() => changeView("LIST")}><img src={List} alt="" /><h5>List </h5></div>
                        }
                    </div>
                </div>
            </div>
            
            {/* Uncomment this for no item found */}
            {/* <div className="not-found__wrapper">
                <div className="not-found">
                    <img src={Telescope} alt="" />
                    <h5>Nothing found here</h5>
                    <p>Sorrry but the search criteria doesn't obtain any results</p>
                    <div className="change-option" onClick={openFilterMenu}>
                        <Filter />
                        <h5>Change criteria</h5>
                    </div>
                </div>
            </div> */}

            {
                display === "LIST" ?
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
                </div>:
                <div>
                    <h1>MAP</h1>
                </div>

            }
            
        </div>

        {
            showFilter&&
            <BottomDrawer onClose={() => setShowFilter(false)}>
                <div className="options">
                    <div className="filter">
                        <img src={Map} alt="" />
                        <p>Trier</p>
                        <p className="option">Distance</p>
                    </div>
                </div>
            </BottomDrawer>
        }
        </>
    )
}

export default AdvancedSearch;