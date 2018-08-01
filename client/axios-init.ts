import { message } from "antd";
import axios from "axios";

axios.defaults.timeout = 8000;
axios.defaults.withCredentials = true;
axios.defaults.baseURL = "/api";
axios.interceptors.response.use(
    (res) => {
        if (res.data.msg) message.info(res.data.msg);
        return res;
    },
    (err) => {
        console.log(err.message, " 请求地址： ", err.config.url, " data: ", err.config.data);
        const { response } = err;
        if (response) { message.error(err.response.data.error || err.response.data.msg); } else { message.error(err.message); }
        if (response && response.status === 401) {
            location.href = "/login";
        }
        return Promise.reject(err.response ? err.response : err);
    });
