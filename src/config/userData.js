import axios from "axios";
import config from "./index";

export const getuserData=()=>{
    const data = []
    axios.get(config.baseUrl + '/user/show')
        .then(res=>{
            data.push(res.data.message)
        })
        .catch(err=>{
            data.push(err)
        })
    return data
}