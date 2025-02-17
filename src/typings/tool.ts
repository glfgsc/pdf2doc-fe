export interface IFileTool{
    title: string,
    children: IFileToolChildren[]
}

export interface IFileToolChildren{
    label: string,
    icon: string,
    source: string,
    target: string
}