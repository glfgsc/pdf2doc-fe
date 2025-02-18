import { ILoginParam } from '@/typings/login';
import styles from './index.less';
import { Tabs,Form, Button,Input, Flex, Space, message } from 'antd';
import type { FormProps, TabsProps } from 'antd';
import { useState } from 'react';
import { sendLoginCode, userEmailLogin,userPasswordLogin } from '@/services/login';
import { useNavigate } from 'react-router-dom';
import Iconfont from '@/components/Iconfont';
import { setToken } from '@/utils/localStorage';

const LoginForm = ({onRegister,onForgetPassword}) => {
  const [passwordForm] = Form.useForm();
  const [emailForm] = Form.useForm();
  const [activeTabKey,setActiveTabKey] = useState<string>('password');
  const [sendCodeLoading,setSendCodeLoading] = useState<boolean>(false);
  const [loginLoading,setLoginLoading] = useState<boolean>(false);
  const [codeBtnText,setCodeBtnText] = useState<string>('发送验证码');
  const [sendCodeDisabled,setSendCodeDisabled] = useState<boolean>(false);
  const [messageApi, contextHolder] = message.useMessage();
  const navigator = useNavigate();

  const onFinish:FormProps<ILoginParam>['onFinish'] = async (values) => {
    setLoginLoading(true);
    switch (activeTabKey) {
      case 'password':
        try{
          let passwordRes = await userPasswordLogin(values);
          setToken(passwordRes.data.token);
          navigator('/document');
        }catch(err){
          messageApi.open({
            type: 'error',
            content: err.msg
          });
        }finally{
          setLoginLoading(false);
        }
        break;
      case 'email':
        try{
          let emailRes = await userEmailLogin(values);
          setToken(emailRes.data.token);
          navigator('/document');
        }catch(err){
          messageApi.open({
            type: 'error',
            content: err.msg
          });
        }finally{
          setLoginLoading(false);
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
    let reg = /^\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}$/
    if(!reg.test(email)){
        messageApi.open({
            type: 'error',
            content: '邮箱格式不正确'
        });
    }else{
      setSendCodeLoading(true);
      try{
        let res = await sendLoginCode({email: email});
        messageApi.open({
          type: 'success',
          content: '验证码已发送，请查收'
        });
        setSendCodeDisabled(true);
        let time = 60;
        let timeInterval = setInterval(()=>{
          setCodeBtnText(`${time}秒后重新发送`);
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
          content: err.msg
        });
      }finally{
        setSendCodeLoading(false);
      }
    }
  }

  const validateEmial = async (rule: any,value: any,callback: any) => {
      if(value === null || value === undefined || value.length === 0 ){
          return Promise.reject('请输入邮箱');
      }else{
          let reg = /^\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}$/
          if(!reg.test(value)){
              return Promise.reject('邮箱格式不正确')
          }else{
              return Promise.resolve();
          }
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
              <Input size='large' prefix={<Iconfont size={16} code={'\ue78f'} />}/>
            </Form.Item>
            <Form.Item<ILoginParam>
              label={<div className={styles.formLabel}>
                密码
              </div>}
              name="password"
              rules={[{ required: true, message: '请输入密码' }]}
            >
              <Input.Password size='large' prefix={<Iconfont size={16} code={'\ue66e'} />}/>
            </Form.Item>
            <Form.Item label={null} labelCol={{ span: 0 }} >
              <Button type="primary" htmlType='submit'  className={styles.submitBtn} loading={loginLoading}>
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
              rules={[{ validator: validateEmial }]}
            >
              <Input size='large' prefix={<Iconfont size={16} code={'\ue908'} />}/>
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
                {codeBtnText === '发送验证码' ? <Button 
                type="primary" 
                disabled={sendCodeDisabled} 
                className={styles.codeBtn} 
                size='large' 
                onClick={onSendCode} 
                loading={sendCodeLoading}
                icon={<Iconfont size={16} code={'\ue893'}/>}>
                  {codeBtnText}
                </Button> :
                  <Button type="primary" disabled={sendCodeDisabled} className={styles.codeBtn} size='large' onClick={onSendCode} loading={sendCodeLoading}>
                  {codeBtnText}
                </Button>}
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
            <Button color="primary" variant="link"   className={styles.operateBtn} onClick={() => {onRegister()}}>
              注册
            </Button>
            <Button color="primary" variant="link"  className={styles.operateBtn} onClick={() => {onForgetPassword()}}>
              忘记密码
            </Button>
          </div>
      </div>
  );
}

export default LoginForm;