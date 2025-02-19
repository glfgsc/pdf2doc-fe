import type { IFileTool, IFileToolChildren, IFileToolFormatTypeOptions } from "@/typings";
import styles from './index.less';
import Iconfont from "../Iconfont";
import { Button, Form, GetProp, Modal, Radio, Space, UploadFile, message } from "antd";
import BrandLogo from "../BrandLogo";
import { useForm } from "antd/es/form/Form";
import { useMemo, useState } from "react";
import Dragger from "antd/es/upload/Dragger";
import { InboxOutlined } from '@ant-design/icons';
import { UploadProps } from "antd/lib";
import { uploadPdfFile} from '@/services';

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

const FileTool = (props: {tools: IFileTool[],onUpload: Function}) => {
    const [form] = useForm();
    const classNames = {
        header: styles.modalHeader,
        footer: styles.modalFooter,
        body: styles.modalBody,
        content: styles.modalContent
    };
    //控制modal显示
    const [open, setOpen] = useState<boolean>(false);
    const openModal = (params: boolean) => {
        setOpen(params);
    };
    const [messageApi, contextHolder] = message.useMessage();
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [source,setSource] = useState<string>('');
    const [target,setTarget] = useState<string>('');
    const [formatTypes,setFormatTypes] = useState<IFileToolFormatTypeOptions[]>([]);
    const [formatType,setFormatType] = useState<string|null>(null);
    const [uploading, setUploading] = useState(false);

    const dragProps: UploadProps = {
        name: 'file',
        maxCount: 1,
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

    const handleUpload = async () => {
        const formData = new FormData();
        fileList.forEach((file) => {
            formData.append('file', file as FileType);
        });
        if(formatType){
            formData.append('targetType',formatType);
        }else{
            formData.append('targetType',target);
        }
        const fileName = fileList[0].name;        
        formData.append('sourceType',source === 'WORD' || source === 'EXCEL'  ? fileName.split('.')[1].toUpperCase() : source);
        setUploading(true);
        try{
            let uploadRes = await uploadPdfFile(formData);
            messageApi.open({
                type: 'success',
                content: `转换任务【${uploadRes.data.id}】已添加`
            });
            props.onUpload();
            setOpen(false);
        }catch(err){
            console.log(err);
        }finally{
            setUploading(false);
        }
    }

    //modal配置项
    const modalData : IModalData = {
        title: `${source}转${target}`,
        width: '600px',
        onOk: () => {},
        footer: <div className={styles.footer}>
            <Space>
                <Button type='primary' onClick={handleUpload} loading={uploading}>确认</Button>
                <Button onClick={()=>openModal(false)}>取消</Button>
            </Space>
        </div>,
        content: <div>
            <Form
            form={form}
            layout="vertical"
            >
                <Form.Item
                label="上传文件"
                rules={[{ required: true, message: `请上传${source?.toLowerCase()}格式文件` }]}
                >
                    <Dragger {...dragProps}>
                        <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">点击上传或拖拽文件至此区域上传</p>
                        <p className="ant-upload-hint">
                            {`支持${source === 'WORD' ? 'doc,docx' : (source === 'EXCEL' ? 'xls,xlsx' : source?.toLowerCase())}格式文件`}
                        </p>
                    </Dragger>
                </Form.Item>
                {formatTypes.length > 0 ? (<Form.Item
                label="选择转换格式"
                rules={[{ required: true, message: `请选择转换格式` }]}
                >
                    <Radio.Group
                    size='large'
                    value={formatType}
                    options={formatTypes}
                    onChange={(e)=>{setFormatType(e.target.value)}}
                    />
                </Form.Item>) : <div></div>}
            </Form>
        </div>
    };

    //modal底部配置
    const footer = useMemo(() => {
        if (modalData && modalData.footer) {
          return {
            footer: modalData.footer,
            onOk: modalData.onOk,
          };
        } else {
          return {
            footer: false
          };
        }
    }, [modalData]);

    const openFileConvertModal = (source: string,target: string,options: IFileToolFormatTypeOptions[]) => {
        setSource(source);
        setTarget(target);
        setFormatTypes(options);
        setFormatType(options.length > 0 ? options[0].value : null);
        setOpen(true);
    }

    return <div className={styles.toolContainer}>
        {contextHolder}
        {props.tools.map((item: IFileTool) => {
            return <div key={item.title}>
                <div className={styles.title}>
                    {item.title}
                </div>
                <div className={styles.tool}>
                    {item.children.map((child: IFileToolChildren) => {
                        return <div key={child.label} className={styles.childrenContainer}  onClick={()=>{openFileConvertModal(child.source,child.target,child.formatType)}}>
                            <Iconfont size={50} code={child.icon}></Iconfont>
                            <div className={styles.childrenText}>
                                {child.label}
                            </div>
                        </div>
                    })}
                </div>
            </div>
        })}
        <Modal
          classNames={classNames}
          title={
            <div className={styles.title}>
              <Space>
                <BrandLogo size={30} className={styles.brandLogo} />
                {modalData.title}
              </Space>
            </div>
          }
          open={open}
          width={modalData.width}
          onCancel={() => {
            setOpen(false);
          }}
          destroyOnClose={true}
          {...footer}
        >
          {modalData.content}
        </Modal>
    </div>
}

export default FileTool;