
import request from "./base";

export function uploadPdfFile(params: any){
    return request('/document/convert','post',params,{
        headers: {"Content-Type": "multipart/form-data"}
    });
}

export function getConvertHistory(params: any){
    return request('/document/history','get',params);
}

export function downloadOldFile(params: any){
    return request('/document/downloadOldFileUrl','get',params)
}

export function downloadNewFile(params: any){
    return request('/document/downloadNewFileUrl','get',params)
}

export function deleteHistory(params: any){
    return request('/document/delete','get',params);
}