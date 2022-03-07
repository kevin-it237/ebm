import React, {Fragment} from 'react';
import {Route, BrowserRouter, HashRouter, Redirect } from 'react-router-dom';
import {connect} from 'react-redux'
import PrivateRoute from './private.route';
import NormalRoute from './normal.route';

import WelCome from '../../applications/auth/pages/welcome/welcome'
import AuthChoice from '../../applications/auth/pages/auth.choice/auth.choice'
import Login from '../../applications/auth/pages/login/login'
import SignUp from '../../applications/auth/pages/signup/signup'
import Verification from '../../applications/auth/pages/signup/verification'

import Layout from '../components/layout/layout';
import Home from '../../applications/shop/pages/home/home'
import Search from '../../applications/shop/pages/search/search'
import ProductSearch from '../../applications/shop/pages/product.search/search'
import ExpertSearch from '../../applications/shop/pages/advanced.expert/search.expert'
import AdvancedSearch from '../../applications/shop/pages/advanced.search/advanced.search'
import Cart from '../../applications/shop/pages/cart/cart'
import Institute from '../../applications/shop/pages/institute/institute'
import Expert from '../../applications/shop/pages/expert/expert'
import MyProfile from '../../applications/shop/pages/myprofile/myprofile'
import Prestation from '../../applications/shop/pages/prestation/prestation'
import Conversation from '../../applications/shop/pages/conversation/conversation'
import RateExpert from '../../applications/shop/pages/rate/rate'
import {getToken, getExist, isMobile} from "../../config/helpers";
import axios from "axios";
import Questions from "../../applications/shop/pages/question/questions";
import VerificationEmail from "../../applications/auth/pages/reset.password/verification.email";
import ResetPassword from "../../applications/auth/pages/reset.password/reset.password";
import VerificationToken from "../../applications/auth/pages/reset.password/verification.token";
import Favorites from "../../applications/shop/pages/favorites/favorites";
import OrderProduct from "../../applications/shop/pages/order/order.product";

/**
 * @description this is the main routes for the main application src/app.
 */
const Routes = () => {
    window.axios = axios;
    if(getToken()!==null && window.token){
        window.token=getToken();
    }

    
    if (window.token){
        axios.defaults.headers['Authorization'] = window.token;
        axios.defaults.headers['Content-Type'] = 'application/json';
    }

    return (
            <BrowserRouter>
                {(isMobile() && getExist() && getToken() === 'null')&&<Redirect to={"/login"}/>}
                {(isMobile() && getExist() && getToken() !== 'null')&&<Redirect to={"/home"}/>}
                {(isMobile() && !getExist() )&&<Redirect to={"/welcome"}/>}
                {/* Private routes here */}
                <PrivateRoute exact path={"/"}>
                    {/* <Route exact component={Tracker} path={"/"} /> */}
                </PrivateRoute>



                {/* Normal routes here */}
                <NormalRoute exact>
                    <Route exact={true} component={WelCome} path={'/welcome'} />
                    
                    <Route exact={true} component={AuthChoice} path={'/auth/choice'} />
                    <Route exact={true} component={Login} path={'/login'} />
                    <Route exact={true} component={SignUp} path={'/signup'} />
                    <Route exact={true} component={Verification} path={'/verification'} />
                    <Route exact={true} component={Verification} path={'/verification/:slug'} />
                    <Route exact={true} component={Questions} path={'/questions/:slug'} />
                    <Route exact={true} component={ResetPassword} path={'/reset-password/:slug'} />
                    <Route exact={true} component={VerificationEmail} path={'/verification-email'} />
                    <Route exact={true} component={VerificationToken} path={'/verification-token'} />

                    {/*when mobile, take this first*/}
                    {!isMobile()&& <Layout>
                        {<Route exact={true} component={Home} path={'/home'}/>}
                        <Route exact={true} component={MyProfile} path={'/profile'} />
                        <Route exact={true} component={ProductSearch} path={'/products'} />
                        <Route exact={true} component={Conversation} path={'/conversation'} />
                        <Route exact={true} component={AdvancedSearch} path={'/advanced-search'} />
                        <Route exact={true} component={ExpertSearch} path={'/advanced-expert'} />
                        <Route exact={true} component={Cart} path={'/cart'} />
                        {<Route exact={true} component={Search} path={'/search'}/>}
                        <Route exact={true} component={Institute} path={'/institute'} />
                        <Route exact={true} path={'/institute/:slug'} component={Institute} />
                        <Route exact={true} component={Expert} path={'/expert'} />
                        <Route exact={true} path={'/expert/:slug'} component={Expert} />
                        <Route exact={true} component={RateExpert} path={'/rate-expert'} />
                        <Route exact={true} component={Favorites} path={'/favorites'}/>
                        <Route exact={true} component={Prestation} path={'/prestation'}/>
                        <Route exact={true} component={OrderProduct} path={'/order/product/:slug'}/>
                    </Layout>}

                    {isMobile()&&<Fragment>
                        <Route exact={true} component={Cart} path={'/cart'}/>
                        {<Route exact={true} component={Search} path={'/search'}/>}
                        <Route exact={true} component={Institute} path={'/institute'}/>
                        <Route exact={true} path={'/institute/:slug'} component={Institute}/>
                        <Route exact={true} component={Expert} path={'/expert'}/>
                        <Route exact={true} path={'/expert/:slug'} component={Expert}/>
                        <Route exact={true} component={RateExpert} path={'/rate-expert'}/>
                        <Route exact={true} component={Favorites} path={'/favorites'}/>
                        <Route exact={true} component={Prestation} path={'/prestation'}/>
                        <Route exact={true} component={OrderProduct} path={'/order/product/:slug'}/>
                    </Fragment>}


                    {<Layout>
                        <Route exact={true} component={Home} path={'/home'} />
                        <Route exact={true} component={MyProfile} path={'/profile'} />
                        <Route exact={true} component={ProductSearch} path={'/products'} />
                        <Route exact={true} component={Conversation} path={'/conversation'} />
                        <Route exact={true} component={AdvancedSearch} path={'/advanced-search'} />
                    </Layout>}

                </NormalRoute>


            </BrowserRouter>)
}

const mapStateToProps = () =>({
});

export default connect(mapStateToProps)(Routes);
