import base from "./index";

export default {
    link:  window.location.origin.includes('localhost') ?  base.baseUrl.replace("/api","")+"/storage" : base.baseUrl.replace("/api","")+"/public/storage"
}
