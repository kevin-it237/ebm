import base from "./index";

export default {
    link:  base.baseUrl.replace("/api","")+"/storage/"
    //link: "http://192.168.100.61:8000/storage/" ? "http://192.168.1.190:8000/storage/" : "http://127.0.0.1:8000/storage/"
}
