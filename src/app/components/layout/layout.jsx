import React, {useState} from 'react'
import {NavLink, useHistory} from 'react-router-dom'
import './layout.scss'
import Home from "../../../assets/icons/homes.svg"
import HomeColor from "../../../assets/icons/homesColor.svg"
import ChatColor from "../../../assets/icons/chat_50px.png"
import Chat from "../../../assets/icons/chat.svg"
import Search from "../../../assets/icons/search.svg"
import Document from "../../../assets/icons/documents.svg"
import DocumentColor from "../../../assets/icons/product_documents_50px.png"
import UserAccount from "../../../assets/icons/userSvg.svg"
import UserAccountColor from "../../../assets/icons/userSvgColor.svg"
import axios from "axios";
import config from "../../../config/index";
import {useDispatch, useSelector} from "react-redux";
import Modal from "../modal/modal";
import Button from "../buttons/button/button";
import LoaderIcon from "react-loader-icon";
import {isMobile, setToken} from "../../../config/helpers";

const Layout = ({children}) => {
    const path = useSelector(state=>state.path.payload)
    const user = useSelector(state=>state.user.payload)
    const dispatch = useDispatch();
    const history = useHistory();
    const [drawerOpen,setDrawerOpen]=useState(false);
    const [content, setContent] = useState("Home");
    const [log,setLogout]=useState(false);
    const [loader,setLoader]=useState(false);
    window.setDrawerOpen =  setDrawerOpen;

    const onLock=(event)=>{
        event.preventDefault();
        setDrawerOpen(false);
    }

    console.log(user)
    const logout=()=>{
        setLogout(false)
        setLoader(true)
        setDrawerOpen(false)
        axios.get(config.baseUrl+'/user/logout')
            .then(response=>{
                window.localStorage.removeItem('token');
                setToken(null)
                axios.defaults.headers['Authorization']=null;
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

    const changeContent = (contentName) => {
        setContent(contentName);
        dispatch({
            type: 'ADD_TO_PATH',
            payload: contentName
        })
    }


    const MENU_ITEMS = ["Home", "Chat", "Search", "Document", "UserAccount"];

    return (
        <>
            <div id="layout">
                {drawerOpen && <div onClick={e=>{window.setDrawerOpen(false)}} style={{height: "100%", width: "100%", backgroundColor: "rgba(0,0,0,0.2)", zIndex: 19,position:"fixed"}}>

                </div>}
                <div id={"nav-bar"} className={(drawerOpen?'open':'')}>

                    <div className={"topImage"} style={{backgroundImage:`url('${require('../../../assets/images/navbar.jpg').default}')`}}>
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
                            <h2 style={{fontSize:10,marginBottom:5}} id={"nav-bar-username"}>{user.firstname} {user.lastname} ({user.roles})</h2>
                            <strong onClick={handleModal}>Logout</strong>
                        </div>
                    </div>
                    {
                        log&&<Modal hide={()=>setLogout(false)}>
                            <center><h2 style={{fontSize: "small", marginTop: 10}}>Voulez vous vraiment vous déconnecter ?</h2></center>
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
                <div id="content" style={{display:isMobile()?"inherit":"flex"}}>
                    <div id={"nav-bar"} className={"nv-big show-on-large d-block"} style={{position:"relative",boxShadow:"none",width:"300px"}}>

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
                                <h2 style={{fontSize:10,marginBottom:5}} id={"nav-bar-username"}>{user.firstname} {user.lastname} ({user.roles})</h2>
                                <strong onClick={handleModal}>Logout</strong>
                            </div>
                        </div>
                        {
                            log&&<Modal hide={()=>setLogout(false)}>
                                <center><h2 style={{fontSize: "small", marginTop: 10}}>Voulez vous vraiment vous déconnecter ?</h2></center>
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
                    <div className={"my-container"} style={{width:isMobile()?"100%":"calc( 100% - 300px )"}}>
                        {children}
                    </div>
                </div>
                <div id="footer">
                {
                    MENU_ITEMS.map(item=>(
                        <div>
                            {item==='Home'&&<NavLink to="/home" onClick={() => changeContent(item)}>
                                {path==='/home' ? <img src={HomeColor} alt=""/> : <img src={Home} alt=""/>}
                            </NavLink>}
                            {item==='Chat'&&<NavLink to="/conversation" onClick={() => changeContent(item)}>
                                {path==='/conversation' ? <img src={ChatColor} width="22" height="22" alt=""/> : <img src={Chat} alt=""/>}
                            </NavLink>}
                            {item==='Search'&&<NavLink to="/advanced-search" onClick={() => changeContent(item)}>
                                <img src={Search} alt=""/></NavLink>}
                            {item==='Document'&&<NavLink to="/products" onClick={() => changeContent(item)}>
                                {path==='/products' ? <img src={DocumentColor} width="22" height="22" alt=""/> : <img src={Document} alt=""/>}
                            </NavLink>}
                            {item==='UserAccount'&&<NavLink to="/profile" onClick={() => changeContent(item)}>
                                {path==='/profile' ? <img src={UserAccountColor} alt=""/> : <img src={UserAccount} alt=""/>}
                            </NavLink>}
                        </div>
                    ))
                }
                </div>
                {/*{item ==="Home"&&<NavLink to="/home"><img src={item} alt="" /></NavLink>}
                    <NavLink to="/conversation"><img src={Conversation} alt=""/></NavLink>
                        <NavLink to="/advanced-search"><img src={Search} alt="" /></NavLink>
                        <NavLink to="/products"><img src={Products} alt="" /></NavLink>
                        <NavLink to="/profile"><img src={Profile} alt="" /></NavLink>*/}
            </div>
        </>
    )
}

export default Layout;
