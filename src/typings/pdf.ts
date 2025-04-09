import type { UploadFile } from 'antd';
import { IFileToolFormatTypeOptions, IFileToolOptions } from '.';

export interface IUploadPdfFile{
    file: UploadFile
}

export interface IConvertHistory {
    id: number,
    name: string,
    createTime: string,
    newPath: string,
    oldPath: string,
    status: number,
    type: string
}

export interface IQueryHistoryParams {
    pageSize: number,
    pageNum: number,
    sources: string
}

export interface IDocumentMenuItem {
    label: string,
    key: string,
    icon: any,
    options: IFileToolOptions[]
}