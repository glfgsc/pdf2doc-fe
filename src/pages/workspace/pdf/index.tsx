import React, { useEffect, useState } from 'react';
import { UploadProps,GetProp,Table,Space,Tag,Pagination,Divider } from 'antd';
import { message, Button } from 'antd';
import { getConvertHistory,downloadOldFile,downloadNewFile,deleteHistory } from '@/services';
import { IConvertHistory, IQueryHistoryParams } from '@/typings';
import Iconfont from '@/components/Iconfont';
import { Tooltip } from 'antd/lib';
import styles from './index.less';
import { getToken } from '@/utils/localStorage';
import { IFileTool } from '@/typings/tool';
import FileTool from '@/components/FileTool';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const PdfToDoc = () => {
    const { Column, ColumnGroup } = Table;
    const [data,setData] = useState<IConvertHistory[]>([]);
    const [messageApi, contextHolder] = message.useMessage();
    const [queryHistoryParams,setQueryHistoryParams] = useState<IQueryHistoryParams>({
        pageSize: 10,
        pageNum: 1,
        creator: null
    });
    const [total,setTotal] = useState<number>(0);
    const statusTags = [
        {
            status: 0,
            label: '上传中',
            color: 'processing'
        },
        {
            status: 1,
            label: '转换中',
            color: 'processing'
        },
        {
            status: 2,
            label: '转换成功',
            color: 'success'
        },
        {
            status: 3,
            label: '上传失败',
            color: 'error'
        },
        {
            status: 4,
            label: '转换失败',
            color: 'error'
        }
    ];

    const tools : IFileTool[] = [
        {
            title: 'PDF转换',
            children: [
                {
                    label: 'PDF转WORD',
                    icon: '\uedd5',
                    source: 'PDF',
                    target: 'WORD',
                    formatType: [
                        {
                            label: 'docx',
                            value: 'DOCX'
                        },
                        {
                            label: 'doc',
                            value: 'DOC'
                        }
                    ]
                },
                {
                    label: 'PDF转图片',
                    icon: '\ue63e',
                    source: 'PDF',
                    target: '图片',
                    formatType: [{
                        label: 'svg',
                        value: 'SVG'
                    },{
                        label: 'png',
                        value: 'PNG'
                    },{
                        label: 'jpeg',
                        value: 'JPEG'
                    }]
                },
                {
                    label: 'PDF转EXCEL',
                    icon: '\ue609',
                    source: 'PDF',
                    target: 'EXCEL',
                    formatType: [
                        {
                            label: 'xls',
                            value: 'XLS'
                        },
                        {
                            label: 'xlsx',
                            value: 'XLSX'
                        }
                    ]
                },
                {
                    label: 'PDF转PPT',
                    icon: '\ue60c',
                    source: 'PDF',
                    target: 'PPT',
                    formatType: [
                        {
                            label: 'pptx',
                            value: 'PPTX'
                        }
                    ]
                },
                {
                    label: 'PDF转HTML',
                    icon: '\ue65a',
                    source: 'PDF',
                    target: 'HTML',
                    formatType: [
                        {
                            label: 'html',
                            value: 'HTML'
                        }
                    ]
                },
                {
                    label: 'PDF转TXT',
                    icon: '\ue680',
                    source: 'PDF',
                    target: 'TXT',
                    formatType: [
                        {
                            label: 'txt',
                            value: 'TXT'
                        }
                    ]
                }
            ]
        },
        {
            title: 'WORD转换',
            children: [
                {
                    label: 'WORD转PDF',
                    icon: '\ue67a',
                    source: 'WORD',
                    target: 'PDF',
                    formatType: [
                        {
                            label: 'pdf',
                            value: 'PDF'
                        }
                    ]
                },
                {
                    label: 'WORD转图片',
                    icon: '\ue63e',
                    source: 'WORD',
                    target: '图片',
                    formatType: [{
                        label: 'svg',
                        value: 'SVG'
                    },{
                        label: 'png',
                        value: 'PNG'
                    },{
                        label: 'jpeg',
                        value: 'JPEG'
                    }]
                },
                {
                    label: 'WORD转HTML',
                    icon: '\ue65a',
                    source: 'WORD',
                    target: 'HTML',
                    formatType: [{
                        label: 'html',
                        value: 'HTML'
                    }]
                }
            ]
        }
    ];

    useEffect(() => {
        getHistoryData();
    },[queryHistoryParams]);
    
    useEffect(() => {
        const interval = setInterval(() => {
            getHistoryData();
        }, 5000); // 每5秒轮询一次

        return () => {
            clearInterval(interval); // 清除定时器
        };
    }, []);

    const getHistoryData = async () => {
        let res = await getConvertHistory(queryHistoryParams);
        setData(res.data.map((item:any)=>{
            return {
                ...item,
                type: item.name.split('.')[item.name.split('.').length - 1]
            }
        }));
        setTotal(res.total);
    }

    const downloadFile = async (record: IConvertHistory,mode: string) => {
        switch (mode) {
            case 'old':
                let oldRes = await downloadOldFile({id: record.id,token: getToken()});
                window.open(oldRes.data);
                break;
            case 'new':
                let newRes = await downloadNewFile({id: record.id,token: getToken()});
                window.open(newRes.data);
                break;
            default:
                break;
        }
    }

    const deletePdf = async (id: number) => {
        await deleteHistory({id: id});
        await getHistoryData();
        messageApi.open({
            type: 'success',
            content: `转换任务【${id}】已删除`
        });
    }

    const onPageChange = async (page: number, pageSize: number) => {
        setQueryHistoryParams({
            pageNum: page,
            pageSize: pageSize,
            creator: null
        });
    }

    return (
        <div>
            {contextHolder}
            <div className={styles.header}>
                <FileTool tools={tools} onUpload={() => getHistoryData()}></FileTool>
            </div>
            <div className={styles.tableContainer}>
            <Divider variant="solid" className={styles.divider}>
                <span style={{fontWeight: 'bold'}}>操作历史</span>
            </Divider>
                <Table<IConvertHistory> dataSource={data} rowKey="id" pagination={false}>
                    <Column title="ID" dataIndex="id" key="id" />
                    <Column title="文件名" dataIndex="name" key="name" />
                    <Column title="源文件类型" dataIndex="sourceType" key="sourceType" />
                    <Column title="目标文件类型" dataIndex="targetType" key="targetType" />
                    <Column title="创建时间" dataIndex="createTime" key="createTime" />
                    <Column title="更新时间" dataIndex="updateTime" key="updateTime" />
                    <Column title="状态"  key="id" dataIndex="status" render={(status: number) => (
                        <Tag color={statusTags.filter(item=>item.status === status)[0].color} >
                            {statusTags.filter(item=>item.status === status)[0].label}
                        </Tag>
                    )}/>
                    <Column
                    title="操作"
                    render={(_: any, record: IConvertHistory) => (
                        <div >
                            <Tooltip  placement='right' title={'下载源文件'}>
                                <Button 
                                disabled={[0,3,4,5].includes(record.status)}
                                type='link'
                                onClick={() => downloadFile(record,'old')} 
                                className={styles.primaryIcon}>
                                    <Iconfont size={16} code={'\ue654'}/>
                                </Button>
                            </Tooltip>
                            <Tooltip  placement='right' title={'下载目标文件'}>
                                <Button
                                disabled={ record.status !== 2}
                                type='link'
                                onClick={() => downloadFile(record,'new')} 
                                className={styles.primaryIcon}>
                                    <Iconfont size={16} code={'\ue613'}/>
                                </Button>
                            </Tooltip>
                            <Tooltip  placement='right' title={'删除'}>
                                <Button 
                                disabled={record.status === 0 || record.status === 1}
                                type='link'
                                onClick={() => deletePdf(record.id)} 
                                className={styles.dangerIcon}>
                                    <Iconfont size={16} code={'\ue653'}/>
                                </Button>
                            </Tooltip>
                            
                        </div>
                    )}
                    />
                </Table>
                <Pagination 
                className={styles.page}
                align='end'
                showTotal={(total, range) => `共${total}条数据`}
                showSizeChanger
                showQuickJumper
                defaultCurrent={1} 
                total={total} 
                pageSize={queryHistoryParams.pageSize} 
                current={queryHistoryParams.pageNum}
                onChange={onPageChange}/>
            </div>
        </div>
    );
}

export default PdfToDoc;