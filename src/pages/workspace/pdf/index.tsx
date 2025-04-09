import React, { useState } from 'react';
import { UploadProps,GetProp, Menu, MenuProps } from 'antd';
import { IDocumentMenuItem } from '@/typings';
import Iconfont from '@/components/Iconfont';
import styles from './index.less';
import FileTool from '@/components/FileTool';

const PdfToDoc = () => {
    const [currentTab, setCurrentTab] = useState('PDF');
    const items: IDocumentMenuItem[] = [
        {
            label: 'PDF',
            key: 'PDF',
            icon: <Iconfont size={16} code={'\ue67a'}></Iconfont>,
            options: [
                { 
                    label: <span>WORD</span>,
                    title: 'WORD',
                    options: [
                        {label:'DOCX',value: 'DOCX'},
                        {label:'DOC',value: 'DOC'}
                    ]
                },
                {
                    label: <span>图片</span>,
                    title: '图片',
                    options: [
                        {label:'SVG',value: 'SVG'},
                        {label:'PNG',value: 'PNG'},
                        {label:'JPEG',value: 'JPEG'}
                    ]
                },
                {
                    label: <span>EXCEL</span>,
                    title: 'EXCEL',
                    options: [
                        {label:'XLS',value: 'XLS'},
                        {label:'XLSX',value: 'XLSX'}
                    ]
                },
                {
                    label: <span>PPT</span>,
                    title: 'PPT',
                    options: [
                        {label:'PPTX',value: 'PPTX'}
                    ]
                },
                {
                    label: <span>HTML</span>,
                    title: 'HTML',
                    options: [
                        {label:'HTML',value: 'HTML'}
                    ]
                },
                {
                    label: <span>TXT</span>,
                    title: 'TXT',
                    options: [{label:'TXT',value: 'TXT'}]
                }
            ]
        },
        {
            label: 'WORD',
            key: 'WORD',
            icon: <Iconfont size={16} code={'\uedd5'}></Iconfont>,
            options: [
                {
                    label: <span>PDF</span>,
                    title: 'PDF',
                    options: [{label:'PDF',value: 'PDF'}]
                },
                {
                    label: <span>图片</span>,
                    title: '图片',
                    options: [{label:'SVG',value: 'SVG'},
                    {label:'PNG',value: 'PNG'},
                    {label:'JPEG',value: 'JPEG'}]
                },
                {
                    label: <span>HTML</span>,
                    title: 'HTML',
                    options: [
                        {label:'HTML',value: 'HTML'}
                    ]
                }                
            ]
        },
        {
            label: 'EXCEL',
            key: 'EXCEL',
            icon: <Iconfont size={16} code={'\ue609'}></Iconfont>,
            options: [{
                label: <span>PDF</span>,
                title: 'PDF',
                options: [{label:'PDF',value: 'PDF'}]
            }]
        }
    ];
    
    const onClickMenu: MenuProps['onClick'] = (e) => {
        setCurrentTab(e.key);
    };

    return (
        <div className={styles.documentContainer}>
            <div className={styles.header}>
                <Menu onClick={onClickMenu} selectedKeys={[currentTab]} mode="vertical" items={items} style={{borderRight: 'none'}}/>
            </div>
            <div className={styles.tableContainer}>
                <FileTool tools={items.filter(item=>item.key===currentTab)[0]}></FileTool>
            </div>
        </div>
    );
}

export default PdfToDoc;