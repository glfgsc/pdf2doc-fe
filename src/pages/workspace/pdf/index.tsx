import React, { useEffect, useState } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import { UploadProps,UploadFile,GetProp,Table,Space,Tag,Pagination,Divider } from 'antd';
import { message, Upload,Button } from 'antd';
import { uploadPdfFile,getConvertHistory,downloadOldFile,downloadNewFile,deleteHistory } from '@/services';
import { IConvertHistory, IQueryHistoryParams } from '@/typings';
import Iconfont from '@/components/Iconfont';
import { Tooltip } from 'antd/lib';
import styles from './index.less';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const PdfToDoc = () => {
    const { Dragger } = Upload;
    const { Column, ColumnGroup } = Table;
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [uploading, setUploading] = useState(false);
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
    const props: UploadProps = {
        name: 'file',
        maxCount: 1,
        accept: '.pdf,.docx',
        beforeUpload: (file) => {
            setFileList([file]);
            return false;
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
        onRemove: (file) => {
            setFileList([]);
        }
    };

    const handleUpload = async () => {
        const formData = new FormData();
        fileList.forEach((file) => {
            formData.append('file', file as FileType);
        });
        setUploading(true);
        try{
            let uploadRes = await uploadPdfFile(formData);
            await getHistoryData();
            messageApi.open({
                type: 'success',
                content: `转换任务【${uploadRes.data.id}】已添加`
            });
        }catch(err){
            console.log(err);
        }finally{
            setUploading(false);
        }
    }
    
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
                let oldRes = await downloadOldFile({id: record.id});
                window.open(oldRes.data);
                break;
            case 'new':
                let newRes = await downloadNewFile({id: record.id});
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
                <Iconfont size={20} code={'\ue656'}/>
                <span className={styles.title}>PDF,WORD在线一键转换</span>
            </div>
            <Dragger {...props}>
                <p className="ant-upload-drag-icon">
                <InboxOutlined />
                </p>
                <p className="ant-upload-text">点击上传或拖拽文件至此区域上传</p>
                <p className="ant-upload-hint">
                    支持pdf,docx格式文件
                </p>
            </Dragger>
            <Button
                type="primary"
                onClick={handleUpload}
                disabled={fileList.length === 0}
                loading={uploading}
                style={{ marginTop: 16 }}
            >
                {uploading ? '上传中' : '开始上传'}
            </Button>
            <div className={styles.tableContainer}>
            <Divider variant="solid" className={styles.divider}>
                <span style={{fontWeight: 'bold'}}>操作历史</span>
            </Divider>
                <Table<IConvertHistory> dataSource={data} rowKey="id" pagination={false}>
                    <Column title="ID" dataIndex="id" key="id" />
                    <Column title="文件名" dataIndex="name" key="name" />
                    <Column title="文件类型" dataIndex="type" key="type" />
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
                            <Tooltip  placement='right' title={'下载pdf'}>
                                <Button 
                                disabled={record.type === 'pdf' ? [0,3,4,5].includes(record.status) : record.status !== 2}
                                type='link'
                                onClick={() => downloadFile(record,record.type === 'docx' ? 'new' : 'old')} 
                                className={styles.primaryIcon}>
                                    <Iconfont size={16} code={'\ue67a'}/>
                                </Button>
                            </Tooltip>
                            <Tooltip  placement='right' title={'下载docx'}>
                                <Button
                                disabled={ record.type === 'pdf' ? record.status !== 2 : [0,3,4,5].includes(record.status)}
                                type='link'
                                onClick={() => downloadFile(record,record.type === 'pdf' ? 'new' : 'old')} 
                                className={styles.primaryIcon}>
                                    <Iconfont size={16} code={'\ue614'}/>
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