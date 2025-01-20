import { IUploadPdfFile } from "@/typings";
import request from "./base";

export function uploadPdfFile(params: any){
    return request('/pdf/convert','post',params,{
        headers: {"Content-Type": "multipart/form-data"}
    });
}

export function getConvertHistory(params: any){
    return request('/pdf/history','get',params);
}

export function downloadOldFile(params: any){
    return request('/pdf/downloadOldFileUrl','get',params)
}

export function downloadNewFile(params: any){
    return request('/pdf/downloadNewFileUrl','get',params)
}

export function deleteHistory(params: any){
    return request('/pdf/delete','get',params);
}