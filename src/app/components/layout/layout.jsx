import React from 'react'
import { NavLink } from 'react-router-dom'
import './layout.scss'
import Home from "../../../assets/icons/home.svg"
import Chat from "../../../assets/icons/chat.svg"
import Search from "../../../assets/icons/search.svg"
import Document from "../../../assets/icons/documents.svg"
import UserAccount from "../../../assets/icons/user_account.svg"

const Layout = ({children}) => {
    return (
        <>
            <div id="layout">
                <div id="content">
                    {children}
                </div>
                <div id="footer">
                    <NavLink to="/home"><img src={Home} alt="" /></NavLink>
                    <NavLink to="/chat"><img src={Chat} alt="" /></NavLink>
                    <NavLink to="/advanced-search"><img src={Search} alt="" /></NavLink>
                    <NavLink to="/documents"><img src={Document} alt="" /></NavLink>
                    <NavLink to="/account"><img src={UserAccount} alt="" /></NavLink>
                </div>
            </div>
        </>
    )
}

export default Layout;