import { isEn } from "@/i18n";
import { ConfigProvider } from "antd";
import { Outlet } from "@umijs/max";
import { useTheme } from "@/hooks/useTheme";
import { useState,useLayoutEffect } from "react";
import { getAntdThemeConfig } from "@/theme";
import { ThemeType } from "@/constants";

import antdEnUS from 'antd/locale/en_US';
import antdZhCN from 'antd/locale/zh_CN';
import styles from './index.less';


const GlobalLayout = () => {
    const [appTheme,setAppTheme] = useTheme();
    const [antdTheme,setAntdTheme] = useState();

    useLayoutEffect(() => {
        setAntdTheme(getAntdThemeConfig(appTheme));
    }, [appTheme]);

    useLayoutEffect(() => {
        monitorOsTheme();
    },[]);
    
    // 监听系统(OS)主题变化
    const monitorOsTheme = () => {
        function change(e: any) {
            if (appTheme.backgroundColor === ThemeType.FollowOs) {
                setAppTheme({
                ...appTheme,
                backgroundColor: e.matches ? ThemeType.Dark : ThemeType.Light,
                });
            }
        }
        const matchMedia = window.matchMedia('(prefers-color-scheme: dark)');
        matchMedia.onchange = change;
    };


    return (
        <ConfigProvider locale={isEn ? antdZhCN : antdZhCN} theme={antdTheme}>
            <div className={styles.app}>
                <div className={styles.appBody}>
                    <Outlet />
                </div>
            </div>
        </ConfigProvider>
    );
}

export default GlobalLayout;