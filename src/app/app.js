import {useEffect, useState} from 'react';
import Routes from '../app/routes/routes';
import 'semantic-ui-css/semantic.min.css'
import axios from "axios";
import config from "../config";
import {useDispatch} from "react-redux";


const App = () => {
    const [hasMountedBefore, setHasMountedBefore] = useState(false);
    const dispatch = useDispatch();
    /**
     * @description whenever the application mounts we make a api call
     * to aws server to check the current authticated user
     */

    useEffect(() => {
        if(hasMountedBefore){ return }
        // Init current logged user
        setHasMountedBefore(true);

        axios.get(config.baseUrl + '/user/favorites/product')
            .then(response => {
                dispatch({
                        type: 'ADD_TO_FAVORITE',
                        payload: response.data.message.length
                    }
                );
            }).catch(err => {
            console.log(err)
        })
        axios.get(config.baseUrl + '/user/cart/number')
            .then(response => {
                console.log(response.data.message)
                dispatch({
                        type: 'ADD_TO_CART',
                        payload: response.data.message
                    }
                );
            }).catch(err => {
        })

    }, [])

    return <Routes />
}

export default App;