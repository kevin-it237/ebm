import base from "./index";

export default {
    link:  base.baseUrl.includes('localhost') ?  base.baseUrl.replace("/api","")+"/storage/" : base.baseUrl.replace("/api","")+"/public/storage/"
}
