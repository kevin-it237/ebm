import React, {useState} from 'react'
import { NavLink } from 'react-router-dom'
import './layout.scss'
import Home from "../../../assets/icons/home.svg"
import Chat from "../../../assets/icons/chat.svg"
import Search from "../../../assets/icons/search.svg"
import Document from "../../../assets/icons/documents.svg"
import UserAccount from "../../../assets/icons/user_account.svg"

const Layout = ({children}) => {
    const [drawerOpen,setDrawerOpen]=useState(false);
    window.setDrawerOpen =  setDrawerOpen;
    return (
        <>
            <div id="layout">
                {drawerOpen && <div onClick={e=>{window.setDrawerOpen(false)}} style={{height: "100%", width: "100%", backgroundColor: "rgba(0,0,0,0.2)", zIndex: 19,position:"fixed"}}>

                </div>}
                <div id={"nav-bar"} className={(drawerOpen?'open':'')}>

                    <div className={"topImage "} style={{backgroundImage:`url('${require('../../../assets/images/navbar.jpg').default}')`}}>
                        <div>
                            <h1 style={{color:"white",fontWeight:"bold",marginBottom:10,marginLeft:10,fontSize:"16pt"}}>E.B.M</h1>
                        </div>
                    </div>
                    <div style={{height:'calc(100vh -  210px)',overflowY:'auto',overflowX:'hidden'}}>
                        <ul>
                            <li> <NavLink to={"/home"} >Acceuil</NavLink> </li>
                            <li> <NavLink to={"/products"} >Produits</NavLink> </li>
                            <li> <NavLink to={"/profile"} >Profil</NavLink> </li>
                            <li> <NavLink to={"/advanced-search"} >Recherche</NavLink> </li>
                        </ul>
                    </div>
                    <div style={{display:'flex',flexDirection:"row",height:60,alignItems:"center",borderTop:"1px solid rgb(0, 0, 0, 0.05)"}}>
                        <div>
                            <img src={require('../../../assets/images/avatar.png').default} style={{height:40,borderRadius:"50%",backgroundColor:"#eee",marginRight:20,marginLeft:15}}/>
                        </div>
                        <div style={{flexGrow:1,display:'flex',flexDirection:'column',justifyContent:"center"}}>
                            <h2 style={{fontSize:10,marginBottom:5}} id={"nav-bar-username"}>Tamko K Clarence (Expert)</h2>
                            <strong>Logout</strong>
                        </div>
                    </div>

                </div>
                <div id="content">
                    {children}
                </div>
                <div id="footer">
                    <NavLink to="/home"><img src={Home} alt="" /></NavLink>
                    <NavLink to="/conversation"><img src={Chat} alt="" /></NavLink>
                    <NavLink to="/advanced-search"><img src={Search} alt="" /></NavLink>
                    <NavLink to="/products"><img src={Document} alt="" /></NavLink>
                    <NavLink to="/profile"><img src={UserAccount} alt="" /></NavLink>
                </div>
            </div>
        </>
    )
}

export default Layout;
