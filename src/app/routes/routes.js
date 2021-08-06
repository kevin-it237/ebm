import React from 'react';
import { Switch, Route } from 'react-router-dom';
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
import AdvancedSearch from '../../applications/shop/pages/advanced.search/advanced.search'
import Cart from '../../applications/shop/pages/cart/cart'
import Institute from '../../applications/shop/pages/institute/institute'
import MyProfile from '../../applications/shop/pages/myprofile/myprofile'
import Conversation from '../../applications/shop/pages/conversation/conversation'
import RateExpert from '../../applications/shop/pages/rate/rate'

import {getToken} from "../../config/helpers";
import axios from "axios";

/**
 * @description this is the main routes for the main application src/app.
 */
const Routes = () => {

    if (getToken() !== null){
        axios.defaults.headers['Authorization'] = getToken();
        axios.defaults.headers['Content-Type'] = 'application/json';
    };
    return (
        <Switch>
            {/* Private routes here */}
            <PrivateRoute exact path={"/"}>
                {/* <Route exact component={Home} path={"/"} /> */}
            </PrivateRoute>

            {/* Normal routes here */}
            <NormalRoute exact>
                <Route exact={true} component={WelCome} path={'/welcome'} />
                <Route exact={true} component={AuthChoice} path={'/auth/choice'} />
                <Route exact={true} component={Login} path={'/login'} />
                <Route exact={true} component={SignUp} path={'/signup'} />
                <Route exact={true} component={Verification} path={'/verification'} />

                <Route exact={true} component={Cart} path={'/cart'} />
                <Route exact={true} component={Search} path={'/search'} />
                <Route exact={true} component={ProductSearch} path={'/products'} />
                <Route exact={true} component={Institute} path={'/institute'} />
                <Route exact={true} component={MyProfile} path={'/profile'} />
                <Route exact={true} component={Conversation} path={'/conversation'} />
                <Route exact={true} component={RateExpert} path={'/rate-expert'} />

                <Layout>
                    <Route exact={true} component={Home} path={'/home'} />
                    <Route exact={true} component={AdvancedSearch} path={'/advanced-search'} />
                </Layout>
            </NormalRoute>

        </Switch>)
}

const mapStateToProps = () =>({
});

export default connect(mapStateToProps)(Routes);
