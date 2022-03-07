import base from "./index";

export default {
    //link:  base.baseUrl.replace("/api","")+"/public/storage/"
    link:  base.baseUrl.includes('localhost') ?  base.baseUrl.replace("/api","")+"/storage/" : base.baseUrl.replace("/api","")+"/public/storage/"
}
