import { IMenu } from '@/typings/main';
import { Dropdown, Tooltip } from 'antd';
import { MenuMode } from '@/constants';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import styles from './index.less';
import BrandLogo from '@/components/BrandLogo';
import i18n from '@/i18n';
import classnames from 'classnames';
import Iconfont from '@/components/Iconfont';
import PdfToDoc from './pdf';

import '@/theme/custom/dark.less';
import '@/theme/custom/light.less';
import '@/theme/custom/darkDimmed.less';

function IndexPage(){
    const navigate = useNavigate();
    //菜单栏
    const menus : IMenu[] = [
        {
            key: 'document',
            icon: '\ue6b9',
            iconFontSize: 20,
            mode: MenuMode.Router,
            name: i18n('workspace.title'),
            component: <PdfToDoc />,
            position: 'top'
        },
        {
            icon: '\ue68f',
            iconFontSize: 20,
            mode: MenuMode.Router,
            name: i18n('setting.title'),
            key: 'setting',
            position: 'bottom'
        },
        {
            icon: '\ue61d',
            iconFontSize: 20,
            mode: MenuMode.Router,
            name: i18n('user.title'),
            key: 'user',
            position: 'bottom'
        }
    ];
    const [activeNavKey, setActiveNavKey] = useState<string>(
        window.location.pathname.split('/')[1],
    );
    //切换菜单
    const changeMenu = (menu: IMenu) => {
        setActiveNavKey(menu.key);
        navigate('/' + menu.key);
    }

    return (
        <div className={styles.layoutContainer}>
            <div className={styles.layoutLeft}>
                <div className={styles.layoutLeftTop}>
                    <BrandLogo size={40} className={styles.brandLogo} />
                    <ul className={styles.navList}>
                        {
                            menus.filter((item) => item.position === 'top').map((item) => {
                                switch (item.mode) {
                                    case MenuMode.Dropdown:
                                        return (
                                            <Dropdown
                                            trigger={['click']}
                                            key={item.name}
                                            placement={'topRight'}
                                            menu={{
                                                items: item.items,
                                                onClick: (e) => {
                                                    if(item.onDropdownClick){
                                                        item.onDropdownClick(e)
                                                    }
                                                },
                                                selectable: true
                                            }}>
                                                <Tooltip  placement='right' title={item.name}>
                                                    <li
                                                    onClick={() => changeMenu(item)}>
                                                        <Iconfont size={item.iconFontSize} code={item.icon} className={styles.icon}/>
                                                    </li>
                                                </Tooltip>
                                            </Dropdown> 
                                        );
                                    default:
                                        return (
                                            <Tooltip key={item.name} placement='right' title={item.name}>
                                                <li
                                                className={classnames({
                                                    [styles.activeNav]: item.key == activeNavKey,
                                                })}
                                                onClick={() => changeMenu(item)}>
                                                    <Iconfont size={item.iconFontSize} code={item.icon} className={styles.icon}/>
                                                </li>
                                            </Tooltip>
                                        );
                                }
                            })
                        }
                    </ul>
                </div>
                
                <div className={styles.layoutLeftFooter}>
                    <ul className={styles.navList}>
                        {
                            menus.filter((item) => item.position === 'bottom').map((item) => {
                                return (
                                    <Tooltip key={item.name} placement='right' title={item.name}>
                                        <li
                                        className={classnames({
                                            [styles.activeNav]: item.key == activeNavKey,
                                        })}
                                        onClick={() => changeMenu(item)}>
                                            <Iconfont size={item.iconFontSize} code={item.icon} className={styles.icon}/>
                                        </li>
                                    </Tooltip>
                                )
                            })
                        }
                    </ul>
                </div>
            </div>
            <div className={styles.layoutRight}>
                {menus.map((item) => {
                    return (
                        <div key={item.key} className={styles.componentBox} hidden={activeNavKey !== item.key}>
                            {item.component}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default IndexPage;