import { Button, Flex, Form, Input, message } from 'antd';
import styles from './index.less'
import { useState } from 'react';
import Iconfont from '@/components/Iconfont';
import { ILoginParam } from '@/typings/login';
import { sendForgetPasswordCode,userForgetPassword} from '@/services/login';
import { FormProps } from 'antd/lib';

const ForgetPasswordForm = ({onLogin}) => {
    const [forgetPasswordrForm] = Form.useForm();
    const [sendCodeLoading,setSendCodeLoading] = useState<boolean>(false);
    const [registerLoading,setRegisterLoading] = useState<boolean>(false);
    const [codeBtnText,setCodeBtnText] = useState<string>('发送验证码');
    const [sendCodeDisabled,setSendCodeDisabled] = useState<boolean>(false);
    const [messageApi, contextHolder] = message.useMessage();

    const onFinish:FormProps<ILoginParam>['onFinish'] = async (values) => {
        setRegisterLoading(true);
        try{
            let res = await userForgetPassword(values);
            messageApi.open({
                type: 'success',
                content: '密码重置成功'
            });
            onLogin();
        }catch(err){
            messageApi.open({
                type: 'error',
                content: err.msg
            });
        }finally{
            setRegisterLoading(false);
        }
        
    }

    const onSendCode = async () => {
        const email = forgetPasswordrForm.getFieldValue('email');
        let reg = /^\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}$/
        if(!reg.test(email)){
            messageApi.open({
                type: 'error',
                content: '邮箱格式不正确'
            });
        }else{
            setSendCodeLoading(true);
            try{
                let res = await sendForgetPasswordCode({email: email});
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

    const validatePassword = async (rule: any,value: any,callback: any) => {
        if(value === null || value === undefined || value.length === 0 ){
            return Promise.reject('请输入密码');
        }else{
            let reg = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[\da-zA-Z]{8,15}$/
            if(!reg.test(value)){
                return Promise.reject('密码由8-15位大小写字母和数字组成')
            }else{
                return Promise.resolve();
            }
        }
    }

    const validateConfirmPassword = async (rule: any,value: any,callback: any) => {
        if(value === null || value === undefined || value.length === 0 ){
            return Promise.reject('请再次确认密码');
        }else{
            const password = forgetPasswordrForm.getFieldValue('password');
            let reg = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[\da-zA-Z]{8,15}$/
            if(password !== value){
                return Promise.reject('两次输入密码不一致')
            }else{
                return Promise.resolve();
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

    const validateCode = async (rule: any,value: any,callback: any) => {
        if(value === null || value === undefined || value.length === 0 ){
            return Promise.reject('请输入验证码');
        }else{
            let reg = /^[0-9]{6}$/
            if(!reg.test(value)){
                return Promise.reject('验证码格式不正确')
            }else{
                return Promise.resolve();
            }
        }
    }
    return (
        <div className={styles.forgetPasswordFormConatiner}>
            {contextHolder}
            <div className={styles.tabTitle}>
                重置密码
            </div>
            <div className={styles.forgetPasswordForm}>
                <Form
                    form={forgetPasswordrForm}
                    layout='vertical'   
                    name="passwordForm"
                    labelCol={{ span: 8 }}
                    autoComplete="off"
                    requiredMark={false}
                    onFinish={onFinish}
                >
                    <Form.Item<ILoginParam>
                    label={<div className={styles.formLabel}>
                        新密码
                    </div>}
                    name="password"
                    rules={[{ validator: validatePassword}]}
                    validateTrigger="onBlur"
                    >
                        <Input.Password size='large' prefix={<Iconfont size={16} code={'\ue66e'} />} placeholder='密码由8-15位大小写字母和数字组成'/>
                    </Form.Item>
                    <Form.Item<ILoginParam>
                    label={<div className={styles.formLabel}>
                        确认密码
                    </div>}
                    name="confirmPassword"
                    rules={[{ validator: validateConfirmPassword}]}
                    validateTrigger="onBlur"
                    >
                        <Input.Password size='large' prefix={<Iconfont size={16} code={'\ue66e'} />} placeholder='请再次确认密码'/>
                    </Form.Item>
                    <Form.Item<ILoginParam>
                    label={<div className={styles.formLabel}>
                        邮箱
                    </div>}
                    name="email"
                    rules={[{ validator: validateEmial}]}
                    validateTrigger="onBlur"
                    >
                    <Input size='large' prefix={<Iconfont size={16} code={'\ue908'} />} placeholder='请输入邮箱'/>
                    </Form.Item>
                    
                    <Form.Item<ILoginParam>
                    label={<div className={styles.formLabel}>
                        验证码
                    </div>}
                    name="code"
                    rules={[{ validator: validateCode }]}
                    validateTrigger="onBlur"
                    >
                    <Flex justify="start" align="center">
                        <Input size='large' placeholder='请输入6位数字验证码'/>
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
                        <Button type="primary" htmlType='submit'  className={styles.submitBtn} loading={registerLoading}>
                            确认修改
                        </Button>
                    </Form.Item>
                </Form>
            </div>
            <div className={styles.operateBtnWrapper}>
                <Button color="primary" variant="link"   className={styles.operateBtn} onClick={() => {onLogin()}}>
                    返回登录
                </Button>
            </div>
        </div>
    )
}

export default ForgetPasswordForm;