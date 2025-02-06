import { ILoginParam } from '@/typings/login';
import styles from './index.less';
import { Tabs,Form, Button,Input, Flex, Space, message } from 'antd';
import type { FormProps, TabsProps } from 'antd';
import { createRef, useRef, useState } from 'react';
import { sendCode, userEmailLogin,userPasswordLogin } from '@/services/login';
import { useForm } from 'antd/es/form/Form';


const LoginForm = () => {
  const [passwordForm] = Form.useForm();
  const [emailForm] = Form.useForm();
  const [activeTabKey,setActiveTabKey] = useState<string>('password');
  const [sendCodeLoading,setSendCodeLoading] = useState<boolean>(false);
  const [codeBtnText,setCodeBtnText] = useState<string>('发送验证码');
  const [sendCodeDisabled,setSendCodeDisabled] = useState<boolean>(false);
  const [messageApi, contextHolder] = message.useMessage();
  const onFinish:FormProps<ILoginParam>['onFinish'] = async (values) => {
    switch (activeTabKey) {
      case 'password':
        try{
          let passwordRes = await userPasswordLogin({
            ...values,
            type: 'PASSWORD'
          });
        }catch(err){
          messageApi.open({
            type: 'error',
            content: err.msg
          });
        }
        
        break;
      case 'email':
        try{
          let emailRes = await userEmailLogin(
            {
            ...values,
            type: 'EMAIL'
          });
        }catch(err){
          messageApi.open({
            type: 'error',
            content: err.msg
          });
        }
        
        break;
      default:
        break;
    }
  }
  const onTabChange = (key: string) => {
    setActiveTabKey(key);
  };

  const onSendCode = async () => {
    const email = emailForm.getFieldValue('email');
    setSendCodeLoading(true);
    try{
      let res = await sendCode({email: email});
      messageApi.open({
        type: 'success',
        content: '验证码已发送，请查收'
      });
      setSendCodeDisabled(true);
      let time = 60;
      let timeInterval = setInterval(()=>{
        setCodeBtnText(`${time}后重新发送`);
        time--;
      },1000);
      setTimeout(() => {
        clearInterval(timeInterval);
        setCodeBtnText(`发送验证码`);
        setSendCodeDisabled(false);
      }, 60000);
    }catch(err){
      messageApi.open({
        type: 'error',
        content: '验证码发送失败'
      });
    }finally{
      setSendCodeLoading(false);
    }
    
  }

  const items: TabsProps['items'] = [
      {
        key: 'password',
        label: <div className={styles.tabTitle}>
          账号密码登录
        </div>,
        children: <div className={styles.loginForm}>
          <Form
            form={passwordForm}
            layout='vertical'
            name="passwordForm"
            labelCol={{ span: 8 }}
            autoComplete="off"
            requiredMark={false}
            onFinish={onFinish}
          >
            <Form.Item<ILoginParam>
              label={<div className={styles.formLabel}>
                用户名
              </div>}
              name="name"
              rules={[{ required: true, message: '请输入用户名' }]}
            >
              <Input size='large'/>
            </Form.Item>
            <Form.Item<ILoginParam>
              label={<div className={styles.formLabel}>
                密码
              </div>}
              name="password"
              rules={[{ required: true, message: '请输入密码' }]}
            >
              <Input.Password size='large'/>
            </Form.Item>
            <Form.Item label={null} labelCol={{ span: 0 }} >
              <Button type="primary" htmlType='submit'  className={styles.submitBtn}>
                登录
              </Button>
            </Form.Item>
          </Form>
        </div>,
      },
      {
        key: 'email',
        label: <div className={styles.tabTitle}>
          邮箱登录
        </div>,
        children: <div className={styles.loginForm}>
           <Form
            form={emailForm}
            layout='vertical'
            name="emailForm"
            labelCol={{ span: 8 }}
            autoComplete="off"
            requiredMark={false}
            onFinish={onFinish}
          >
            <Form.Item<ILoginParam>
              label={<div className={styles.formLabel}>
                邮箱
              </div>}
              name="email"
              rules={[{ required: true, message: '请输入邮箱' }]}
            >
              <Input size='large'/>
            </Form.Item>
            
            <Form.Item<ILoginParam>
              label={<div className={styles.formLabel}>
                验证码
              </div>}
              name="code"
              rules={[{ required: true, message: '请输入验证码' }]}
            >
              <Flex justify="start" align="center">
                <Input size='large'/>
                <Button type="primary" disabled={sendCodeDisabled} className={styles.codeBtn} size='large' onClick={onSendCode} loading={sendCodeLoading}>
                  {codeBtnText}
                </Button>
              </Flex>
            </Form.Item>
            <Form.Item label={null} labelCol={{ span: 0 }} >
              <Button type="primary" htmlType='submit'  className={styles.submitBtn} >
                登录
              </Button>
            </Form.Item>
          </Form>
        
      </div>
      }
  ];

  return (
      <div className={styles.loginFormConatiner}>
          {contextHolder}
          <Tabs defaultActiveKey="password" items={items} onChange={onTabChange} />
          <div className={styles.operateBtnWrapper}>
            <Button color="primary" variant="link"   className={styles.operateBtn}>
              注册
            </Button>
            <Button color="primary" variant="link"  className={styles.operateBtn}>
              忘记密码
            </Button>
          </div>
      </div>
  );
}

export default LoginForm;