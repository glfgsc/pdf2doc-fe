import { InputType, MenuMode } from '@/constants';
import type { MenuProps } from 'antd';

export interface IMenu {
    key: string,
    icon: string,
    iconFontSize?: number,
    name: string,
    items?: MenuProps['items'],
    component?: React.ReactNode,
    path?: string,
    onOpenModal?: any,
    onDropdownClick?: MenuProps['onClick'],
    mode: MenuMode,
    position: string
}

export interface IFormItem {
    defaultValue: any;
    inputType: InputType;
    labelNameCN: string;
    labelNameEN: string;
    name: string | Array<string>;
    required: boolean;
    selected?: any;
    labelTextAlign?: 'right';
    placeholder?: string;
    placeholderEN?: string;
    rules?: Array<any>,
    styles?: {
      width?: string; // 表单占用的长度 推荐百分比 默认值为 100%
      labelWidthEN?: string; // 英文环境下表单label的长度 推荐px 默认值为 70px
      labelWidthCN?: string; // 中文环境下表单label的长度 推荐px 默认值为 100px
      labelAlign?: 'left' | 'right'; // label的对齐方式 默认值为左对齐
    },
}