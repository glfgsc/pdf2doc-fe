// @ts-nocheck
import axios from 'axios'
axios.defaults.withCredentials = true;
const httpUtil = axios.create({
    baseURL: process.env.BASE_URL,
    withCredentials: true,
    timeout: 600000,
});


//request拦截器
httpUtil.interceptors.request.use(config => {
    if (config.loading) {
        config.loading.value = true;
    }
    if (config.isError) {
        config.isError.value = false;
    }
    return config
}, error => {
    const { config } = error;
    if (config.loading) {
        config.loading.value = false;
    }
    if (config.isError) {
        config.isError.value = true;
    }
    return Promise.reject({
        ...error,
        reason: '请求错误'
    })
});

//response拦截器
httpUtil.interceptors.response.use(response => {
    let res = response.data;
    if (response.config.responseType === 'blob') {
        return response;
    }
    if (typeof res === 'string') {
        res = res ? JSON.parse(res) : res;
    }
    if (res.code === 200) {
        if (response.config.loading) {
            response.config.loading.value = false;
        }
        return res;
    }else if (res.code === 401) {
        return Promise.reject({...res});
    }else {
        if (response.config.loading) {
            response.config.loading.value = false;
        }
        if (response.config.isError) {
            response.config.isError.value = true;
        }
        return Promise.reject({
            ...res,
            path: response.request.responseURL
        });
    }
}, error => {
    const { config } = error;
    if (config.loading) {
        config.loading.value = false;
    }
    if (config.isError) {
        config.isError.value = true;
    }
    if (error.message === 'Network Error') {
        return Promise.reject({
            ...error,
            reason: '网络连接异常'
        });
    } else if (error.code === 'ECONNABORTED') {
        return Promise.reject({
            ...error,
            reason: '请求超时'
        });
    } else if (error.response) {
        switch (error.response.status) {
            case 500:
                return Promise.reject({
                    ...error,
                    reason: '内部服务器错误'
                });
            case 502:
                return Promise.reject({
                    ...error,
                    reason: '网关错误'
                });
            case 503:
                return Promise.reject({
                    ...error,
                    reason: '服务不可用'
                });
            case 504:
                return Promise.reject({
                    ...error,
                    reason: '网关超时'
                });
            case 400:
                return Promise.reject({
                    ...error,
                    reason: '请求无效'
                });
            case 401:
            return Promise.reject({
                ...error,
                reason: '账号未登录'
            });
            case 403:
                return Promise.reject({
                    ...error,
                    reason: '禁止访问'
                });
            case 404:
                return Promise.reject({
                    ...error,
                    reason: '资源未找到'
                });
            default:
                return Promise.reject({
                    ...error,
                    reason: '未知错误'
                });
        }
    }
    return Promise.reject({
        ...error,
        reason: '未知错误'
    });
});

const request = function (url, method, param, { headers, loading, isError,responseType }: any = {}) {
    if (method === 'post' && headers) {
        return httpUtil({
            headers: headers,
            url: url,
            method: method,
            data: param,
            loading,
            isError,
            withCredentials: true
        })
    } else if (method === 'post') {
        return httpUtil({
            url: url,
            method: method,
            data: param,
            loading,
            isError,
            headers,
            withCredentials: true
        })
    }
    else {
        return httpUtil(
            {
                url: url,
                method: method,
                params: param,
                headers,
                responseType,
                loading,
                isError,
                withCredentials: true
            }
        )
    }
}
export default request
