import styles from './index.less';
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';

const LoginForm = () => {

    const items: TabsProps['items'] = [
        {
          key: 'password',
          label: '账号密码登录',
          children: <div>
1
          </div>,
        },
        {
          key: 'email',
          label: '邮箱登录',
          children: <div>
            2
          </div>
        }
    ];

    return (
        <div className={styles.loginFormConatiner}>
            <Tabs defaultActiveKey="password" items={items}  />
        </div>
    );
}

export default LoginForm;