import axios from "axios";
import { message } from "antd";

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
        if (err.response) { message.error(err.response.data.error || err.response.data.msg); } else { message.error(err.message); }
        const { response } = err;
        if (response && response.status === 401) {
            message.error(response.config.url + " 没有权限");
            if (name === "NOT LOGIN") {
                return location.href = "/login/";
            }
            return Promise.reject(err);
        }
        return Promise.reject(err.response ? err.response : err);
    });
