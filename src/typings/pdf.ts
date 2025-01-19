import type { UploadFile } from 'antd';

export interface IUploadPdfFile{
    file: UploadFile
}

export interface IConvertHistory {
    id: number,
    name: string,
    createTime: string,
    newPath: string,
    oldPath: string,
    status: number
}

export interface IQueryHistoryParams {
    pageSize: number,
    pageNum: number,
    creator: string | null
}