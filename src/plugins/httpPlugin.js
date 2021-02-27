import axios from "axios";

const http = {}
http.install = function (Vue, options) {

    // 添加实例方法
    axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
    Vue.prototype.$http = axios
}

export default http