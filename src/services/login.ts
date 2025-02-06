
import request from "./base";

export function userEmailLogin(params: any){
    return request('/user/email/login','post',params);
}

export function userPasswordLogin(params: any){
    return request('/user/password/login','post',params);
}

export function sendCode(params: any){
    return request('/user/sendMail','get',params);
}