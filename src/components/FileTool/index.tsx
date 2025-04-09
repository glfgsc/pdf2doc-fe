import type { IConvertHistory, IDocumentMenuItem, IFileToolOptions, IQueryHistoryParams } from "@/typings";
import styles from './index.less';
import Iconfont from "../Iconfont";
import { Button, Divider, Form, GetProp,  Pagination,  Select, Table, Tag, Tooltip, UploadFile, message } from "antd";
import { useForm } from "antd/es/form/Form";
import { useEffect, useState } from "react";
import Dragger from "antd/es/upload/Dragger";
import { InboxOutlined } from '@ant-design/icons';
import { UploadProps } from "antd/lib";
import { deleteHistory, downloadNewFile, downloadOldFile, getConvertHistory, uploadPdfFile} from '@/services';
import { getToken } from "@/utils/localStorage";

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

export type IModalData =
| {
    title?: string;
    width?: string;
    onOk?: () => void;
    footer?: React.ReactNode | false;
    content: React.ReactNode | false;
}
| null
| false;

const FileTool = (props: {tools: IDocumentMenuItem}) => {
    const [form] = useForm();
    const { Column, ColumnGroup } = Table;
    const [data,setData] = useState<IConvertHistory[]>([]);
    const [messageApi, contextHolder] = message.useMessage();
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [source,setSource] = useState<string>('');
    const [formatTypes,setFormatTypes] = useState<IFileToolOptions[]>([]);
    const [formatType,setFormatType] = useState<string|null>(null);
    const [uploading, setUploading] = useState(false);
    const [total,setTotal] = useState<number>(0);

    const convertSources = (key: string) => {
        if(key === 'WORD'){
            return 'DOC,DOCX';
        }else if(key === 'EXCEL'){
            return 'XLS,XLSX';
        }else if(key === 'PDF'){
            return 'PDF';
        }else{
            return '';
        }
    }

    const [queryHistoryParams,setQueryHistoryParams] = useState<IQueryHistoryParams>({
        pageSize: 10,
        pageNum: 1,
        sources: convertSources(props.tools.key)
    });
    const statusTags = [
        {
            status: 0,
            label: '等待上传',
            color: 'default'
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

    const dragProps: UploadProps = {
        name: 'file',
        maxCount: 1,
        fileList: fileList,
        accept: `.${source === 'WORD' ? 'doc,.docx' : (source === 'EXCEL' ? 'xls,.xlsx' : source?.toLowerCase())}`,
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

    

    useEffect(()=>{
        setQueryHistoryParams({
            pageNum: 1,
            pageSize: 10,
            sources: convertSources(props.tools.key)
        });
        setFileList([]);
        setFormatType(null);
        setSource(props.tools.key);
        setFormatTypes(props.tools.options);
    },[props.tools.key]);

    useEffect(() => {
        const interval = setInterval(() => {
            getHistoryData();
        }, 30000); // 每5秒轮询一次

        return () => {
            clearInterval(interval); // 清除定时器
        };
    });

    useEffect(() => {
        getHistoryData();
    },[queryHistoryParams]);

    const handleUpload = async () => {
        const formData = new FormData();
        fileList.forEach((file) => {
            formData.append('file', file as FileType);
        });

        formData.append('targetType',formatType);

        const fileName = fileList[0].name;        
        formData.append('sourceType',source === 'WORD' || source === 'EXCEL'  ? fileName.split('.')[1].toUpperCase() : source);
        setUploading(true);
        try{
            let uploadRes = await uploadPdfFile(formData);
            messageApi.open({
                type: 'success',
                content: `转换任务【${uploadRes.data.id}】已添加`
            });
            await getHistoryData();
        }catch(err){
            console.log(err);
        }finally{
            setUploading(false);
        }
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
            sources: convertSources(props.tools.key)
        });
    }

    return <div className={styles.toolContainer}>
        {contextHolder}
        <div style={{width: '100%'}}>
            <div style={{display: 'flex',justifyContent: 'center',alignItems: 'center',flexDirection: 'column',background:'var(--color-bg-subtle)'}}>
                <div className={styles.formContainer}>
                    <Form
                    form={form}
                    layout="vertical"
                    >
                        <Form.Item
                        label="选择文件"
                        rules={[{ required: true, message: `请上传${source?.toLowerCase()}格式文件` }]}
                        >
                            <Dragger {...dragProps} style={{width: '100%',background: '#FFFFFF'}}>
                                <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                                </p>
                                <p className="ant-upload-text">点击上传或拖拽文件至此区域上传</p>
                                <p className="ant-upload-hint">
                                    {`支持${source === 'WORD' ? 'doc,docx' : (source === 'EXCEL' ? 'xls,xlsx' : source?.toLowerCase())}格式文件`}
                                </p>
                            </Dragger>
                        </Form.Item>
                        <Form.Item
                        label="选择目标格式"
                        rules={[{ required: true, message: `请选择目标格式` }]}
                        >
                            <Select
                            
                            showSearch
                            value={formatType}
                            placeholder="请选择目标格式"
                            style={{ width: 200 }}
                            onChange={(value)=>{setFormatType(value)}}
                            options={formatTypes}
                            />
                        </Form.Item>
                    </Form>
                    <div>
                        <Button type='primary' onClick={handleUpload} loading={uploading} >开始转换</Button>
                    </div>
                </div>
            </div>
            
            
            <Divider variant="solid" className={styles.divider}>
                <span style={{fontWeight: 'bold'}}>转换结果</span>
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
}

export default FileTool;