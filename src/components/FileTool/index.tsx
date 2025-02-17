import type { IFileTool, IFileToolChildren } from "@/typings";
import styles from './index.less';
import Iconfont from "../Iconfont";
import { Button, Form, Modal, Space, UploadFile } from "antd";
import BrandLogo from "../BrandLogo";
import { useForm } from "antd/es/form/Form";
import { useMemo, useState } from "react";
import Dragger from "antd/es/upload/Dragger";
import { InboxOutlined } from '@ant-design/icons';
import { UploadProps } from "antd/lib";

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

const FileTool = (props: {tools: IFileTool[]}) => {
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
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [source,setSource] = useState<string>();
    const [target,setTarget] = useState<string>();
    const dragProps: UploadProps = {
        name: 'file',
        maxCount: 1,
        accept: `.${source?.toLowerCase()}`,
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
    //modal配置项
    const modalData : IModalData = {
        title: `${source}转${target}`,
        width: '600px',
        onOk: () => {},
        footer: <div className={styles.footer}>
            <Space>
                <Button type='primary'>确认</Button>
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
                name="fileList"
                rules={[{ required: true, message: `请上传${source?.toLowerCase()}格式文件` }]}
                >
                    <Dragger {...dragProps}>
                        <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">点击上传或拖拽文件至此区域上传</p>
                        <p className="ant-upload-hint">
                            {`支持${source?.toLowerCase()}格式文件`}
                        </p>
                    </Dragger>
                </Form.Item>
                <Form.Item
                label="选择转换格式"
                name="formatType"
                rules={[{ required: true, message: `请选择转换格式` }]}
                >

                </Form.Item>
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

    const openFileConvertModal = (source: string,target: string) => {
        setSource(source);
        setTarget(target);
        setOpen(true);
    }

    return <div className={styles.toolContainer}>
        {props.tools.map((item: IFileTool) => {
            return <div>
                <div className={styles.title}>
                    {item.title}
                </div>
                <div className={styles.tool}>
                    {item.children.map((child: IFileToolChildren) => {
                        return <div className={styles.childrenContainer}  onClick={()=>{openFileConvertModal(child.source,child.target)}}>
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