import {useEffect, useState} from 'react';
import Routes from '../app/routes/routes';


const App = () => {
    const [hasMountedBefore, setHasMountedBefore] = useState(false);
    /**
     * @description whenever the application mounts we make a api call
     * to aws server to check the current authticated user
     */

    useEffect(() => {
        if(hasMountedBefore){ return }
        // Init current logged user
        setHasMountedBefore(true);
    }, [])

    return <Routes />
}

export default App;