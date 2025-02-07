
import request from "./base";

export function userEmailLogin(params: any){
    return request('/user/email/login','post',params);
}

export function userPasswordLogin(params: any){
    return request('/user/password/login','post',params);
}

export function sendLoginCode(params: any){
    return request('/user/sendLoginMail','get',params);
}

export function sendRegisterCode(params: any){
    return request('/user/sendRegisterMail','get',params);
}

export function sendForgetPasswordCode(params: any){
    return request('/user/sendForgetPasswordMail','get',params);
}

export function userRegister(params: any){
    return request('/user/register','post',params);
}

export function checkUserName(params: any){
    return request('/user/checkUserName','get',params);
}

export function userForgetPassword(params: any){
    return request('/user/resetPassword','post',params);
}