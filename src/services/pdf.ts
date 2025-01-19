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
    return request('/pdf/downloadOldFile','get',params,{
        responseType: 'blob',
        headers: {'Accept': '*/*'}
    })
}

export function downloadNewFile(params: any){
    return request('/pdf/downloadNewFile','get',params,{
        responseType: 'blob',
        headers: {'Accept': '*/*'}
    })
}

export function deleteHistory(params: any){
    return request('/pdf/delete','get',params);
}