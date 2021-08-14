import React, {useCallback, useEffect, useState} from 'react'
import {NavLink, useHistory} from 'react-router-dom'
import './layout.scss'
import Home from "../../../assets/icons/home.svg"
import Chat from "../../../assets/icons/chat.svg"
import Search from "../../../assets/icons/search.svg"
import Document from "../../../assets/icons/documents.svg"
import UserAccount from "../../../assets/icons/user_account.svg"
import axios from "axios";
import config from "../../../config/index";
import {getToken} from "../../../config/helpers";

const Layout = ({children}) => {
    const history = useHistory();
    const [drawerOpen,setDrawerOpen]=useState(false);
    const [user,setUser]=useState([]);
    window.setDrawerOpen =  setDrawerOpen;

    useEffect(()=>{
        getUser();
    }, []);

    const getUser=()=>{
        axios.get(config.baseUrl+'/user/show')
            .then(response=>{
                setUser(response.data.message)
            })
            .catch(error=>{
                console.log(error)
            })
    }

    console.log(user)

    const onLock=(event)=>{
        event.preventDefault();
        setDrawerOpen(false);
    }

    const logout=()=>{
        axios.get(config.baseUrl+'/user/logout')
            .then(response=>{
                window.localStorage.removeItem('token');
                setUser([]);
                setDrawerOpen(false)
                history.push('/login')
            })
            .catch(error=>{
                console.log(error)
            })
    }
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
                            <li> <NavLink to={"/home"} onClick={(event)=> {event.preventDefault();
                                history.push('/home'); setDrawerOpen(false)}}>Acceuil</NavLink> </li>
                            <li> <NavLink to={"/products"} onClick={(event)=> {event.preventDefault();
                                history.push('/products'); setDrawerOpen(false)}}>Produits</NavLink> </li>
                            <li> <NavLink to={"/profile"} onClick={(event)=> {event.preventDefault();
                                history.push('/profile'); setDrawerOpen(false)}}>Profil</NavLink> </li>
                            <li> <NavLink to={"/advanced-search"} onClick={(event)=> {event.preventDefault();
                                history.push('/advanced-search'); setDrawerOpen(false)}}>Recherche</NavLink> </li>
                            {user.role === 'user' ?<li><NavLink to={"/rate-expert"} onClick={(event) => {
                                event.preventDefault();
                                history.push('/rate-expert');
                                setDrawerOpen(false)
                            }}>Notez Expert</NavLink></li> : ""}
                        </ul>
                    </div>
                    <div style={{display:'flex',flexDirection:"row",height:60,alignItems:"center",borderTop:"1px solid rgb(0, 0, 0, 0.05)"}}>
                        <div>
                            <img src={require('../../../assets/images/avatar.png').default} style={{height:40,borderRadius:"50%",backgroundColor:"#eee",marginRight:20,marginLeft:15}}/>
                        </div>
                        <div style={{flexGrow:1,display:'flex',flexDirection:'column',justifyContent:"center"}}>
                            <h2 style={{fontSize:10,marginBottom:5}} id={"nav-bar-username"}>{user.firstname} {user.lastname} ({user.role})</h2>
                            <strong onClick={logout}>Logout</strong>
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
