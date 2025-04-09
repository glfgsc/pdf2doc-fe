export interface IFileTool{
    title: string,
    children: IFileToolChildren[]
}

export interface IFileToolOptions{
    label: any,
    options: IFileToolFormatTypeOptions[],
    title: string
}

export interface IFileToolFormatTypeOptions{
    label: string,
    value: string
}

export interface IFileToolChildren{
    label: string,
    icon: string,
    source: string,
    target: string,
    formatType: IFileToolFormatTypeOptions[]
}