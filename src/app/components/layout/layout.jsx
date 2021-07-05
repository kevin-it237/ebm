import React from 'react'
import { useHistory, NavLink } from 'react-router-dom'
import './layout.scss'
import Home from "../../../assets/icons/home.svg"
import Chat from "../../../assets/icons/chat.svg"
import Search from "../../../assets/icons/search.svg"
import Document from "../../../assets/icons/documents.svg"
import UserAccount from "../../../assets/icons/user_account.svg"
import BottomDrawer from "../../../applications/shop/components/bottom.drawer/bottom.drawer"
import Menu from "../../../assets/icons/menu.svg"
import avatar from "../../../assets/images/avatar.png"

const Layout = ({children}) => {
    const history = useHistory()

    const goAccount = () => {
        history.push('/profile')
    }

    const openDrawer = () => {
        
    }

    return (
        <>
            <div id="layout">
                <div id="header">
                    <img onClick={openDrawer} className="menu" src={Menu} alt="" />
                    <img className="avatar" src={avatar} alt="" />
                </div>
                <div id="content">
                    {children}
                </div>
                <div id="footer">
                    <NavLink to="/home"><img src={Home} alt="" /></NavLink>
                    <NavLink to="/chat"><img src={Chat} alt="" /></NavLink>
                    <NavLink to="/search"><img src={Search} alt="" /></NavLink>
                    <NavLink to="/documents"><img src={Document} alt="" /></NavLink>
                    <NavLink to="/account"><img src={UserAccount} alt="" /></NavLink>
                </div>
            </div>
            {/* <BottomDrawer /> */}
        </>
    )
}

export default Layout;