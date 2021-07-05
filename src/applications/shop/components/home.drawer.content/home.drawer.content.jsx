import React from 'react';
import './home.drawer.content.scss'
import BottomDrawer from "../../../../app/components/bottom.drawer/bottom.drawer"

const HomeDrawerContent = ({ onClose }) => {

    return (
        <BottomDrawer onClose={onClose}>
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
        </BottomDrawer>
    )
}

export default HomeDrawerContent;