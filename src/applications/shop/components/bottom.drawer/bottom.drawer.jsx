import React from 'react';
import './bottom.drawer.scss'

const BottomDrawer = () => {

    return (
        <div className="bottom-drawer-backdrop">
            <div id="bottom-drawer">
                <div className="line"></div>
                <div className="service-title">
                    <h2>Coiffure</h2>
                    <span></span>
                </div>
                <div className="categories">
                    <p className="category-item">Coupe Homme</p>
                    <p className="category-item">Coupe et brushing femme</p>
                    <p className="category-item">Brushing</p>
                    <p className="category-item">Coupe Ffemme</p>
                </div>
            </div>

        </div>
    )
  
}

export default BottomDrawer;