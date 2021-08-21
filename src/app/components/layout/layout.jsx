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
import {useDispatch, useSelector} from "react-redux";
import Modal from "../modal/modal";
import Button from "../buttons/button/button";
import LoaderIcon from "react-loader-icon";

const Layout = ({children}) => {
    const user = useSelector(state=>state.user.payload)
    const dispatch = useDispatch();
    const history = useHistory();
    const [drawerOpen,setDrawerOpen]=useState(false);
    const [log,setLogout]=useState(false);
    const [loader,setLoader]=useState(false);
    window.setDrawerOpen =  setDrawerOpen;

    useEffect(()=>{
    }, []);

    const onLock=(event)=>{
        event.preventDefault();
        setDrawerOpen(false);
    }

    const logout=()=>{
        setLogout(false)
        setLoader(true)
        setDrawerOpen(false)
        axios.get(config.baseUrl+'/user/logout')
            .then(response=>{
                window.localStorage.removeItem('token');
                dispatch({
                    type: 'INFO_USER',
                    payload: ""
                })
                setLoader(false)
                history.push('/login')
            })
            .catch(error=>{
                console.log(error)
                setLoader(false)
            })
    }

    const handleModal = (e)=>{
        e.preventDefault()
        setDrawerOpen(false)
        setLogout(true)
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
                            <strong onClick={handleModal}>Logout</strong>
                        </div>
                    </div>
                    {
                        log&&<Modal hide={()=>setLogout(false)}>
                            <center><h2 style={{fontSize: "medium", marginTop: 10}}>Se deconnecter ?</h2></center>
                            <br/>
                            <div style={{display: "flex", justifyContent: "space-between"}}>
                                <Button onClick={(e)=> {e.preventDefault();
                                    setLogout(false)
                                }}>Annuler</Button>
                                <Button style={{background: 'green', marginLeft: 10}} onClick={logout}>Oui</Button>
                            </div>
                        </Modal>
                    }
                    {
                        !log&&loader&&<LoaderIcon type="cylon" color="#6B0C72"/>
                    }

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
