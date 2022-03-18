import axios from "axios";
import { NotificationError } from "../common/components/Notification";
import { clearToken } from "../store/authentication/action";
import { BASE_URL, EVN_TOKEN } from "../utils/constants";
import { history } from "../utils/history";
import { ERROR, TOKEN_EXPIRED } from "../utils/messages";
const BASE_PRODUCTION = `${window.location.origin}/api/`
const http = axios.create({
    baseURL: BASE_URL,
});
let timeoutTokenExpired;
export const interceptor = (store) => {
    http.interceptors.request.use(function (config) {
        let token = sessionStorage.getItem(EVN_TOKEN);
        if (!token) {
            token = localStorage.getItem(EVN_TOKEN)
        }
        let access_token;
        if (token && token !== 'undefined') {
            let objToken = JSON.parse(token);
            access_token = objToken.token.access_token;
        }
        config.headers.Authorization = access_token ? access_token : null;
        config.headers['Accept-Language'] = "vi";
        return config;
    }, function (error) {
        // Do something with request error
        if (error.response && error.response.data) {
            return Promise.reject(error.response.data);
        } else {
            return Promise.reject(error);
        }
    });

    http.interceptors.response.use(function (response) {
        return response;
    }, function (error) {
        if (error.response && error.response.data) {
            if (error.response.data.code === 401 && window.location.pathname !== '/login') {
                try {
                    clearTimeout(timeoutTokenExpired)
                    timeoutTokenExpired = setTimeout(() => {
                        store.dispatch(clearToken());
                        Promise.reject(error);
                        localStorage.removeItem(EVN_TOKEN)
                        sessionStorage.removeItem(EVN_TOKEN)
                        history.push("/login");
                        NotificationError(ERROR, TOKEN_EXPIRED)
                    }, 300)
                } catch (ex) {
                    console.log("interceptor -> ex", ex)
                }
            }
            return Promise.reject(error.response.data);
        } else {
            return Promise.reject(error);
        }
    });
}
export default http;
