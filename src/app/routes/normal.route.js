import React from 'react';
import { Route } from 'react-router-dom';

/**
 * @description creates a normal route to any route.
 */
const NormalRoute = ({children, path, component, ...rest}) => {
    return <Route exact path={path} render={component ? component : () => children}/>;
}


export default NormalRoute;