import React from 'react';
import { Switch, Route } from 'react-router-dom';
import {connect} from 'react-redux'
import PrivateRoute from './private.route';
import NormalRoute from './normal.route';

import WelCome from '../../applications/auth/pages/welcome/welcome'
import AuthChoice from '../../applications/auth/pages/auth.choice/auth.choice'
import Login from '../../applications/auth/pages/login/login'
import SignUp from '../../applications/auth/pages/signup/signup'

import Layout from '../components/layout/layout';
import Home from '../../applications/shop/pages/home/home'
import Search from '../../applications/shop/pages/search/search'
import Cart from '../../applications/shop/pages/cart/cart'

/**
 * @description this is the main routes for the main application src/app. 
 */
const Routes = () => {

    return (
        <Switch>
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
                
                <Route exact={true} component={Cart} path={'/cart'} />
                
                <Layout>
                    <Route exact={true} component={Home} path={'/home'} />
                    <Route exact={true} component={Search} path={'/search'} />
                </Layout>
            </NormalRoute>

        </Switch>)
}

const mapStateToProps = () =>({
});

export default connect(mapStateToProps)(Routes);
