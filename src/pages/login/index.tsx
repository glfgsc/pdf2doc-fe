import styles from './index.less';
import BrandLogo from '@/components/BrandLogo';
import LoginForm from './loginForm';
import RegisterForm from './registerForm';
import { useState } from 'react';
import ForgetPasswordForm from './forgetPasswordForm';

const LoginPage = () => {
    const [currentForm,setCurrentForm] = useState<string>('login');
    const changeCurrentForm = (currentForm : string) => {
        setCurrentForm(currentForm);
    }

    const getCurrentForm = () => {
        if(currentForm === 'login'){
            return <LoginForm 
            onRegister={() => {changeCurrentForm('register')}}
            onForgetPassword={() => {changeCurrentForm('forget')}}/>;
        }else if(currentForm === 'register'){
            return <RegisterForm onLogin={() => {changeCurrentForm('login')}}/>;
        }else{
            return <ForgetPasswordForm onLogin={() => {changeCurrentForm('login')}} />
        }
    }
    return (
        <div className={styles.container}>
            <div className={styles.loginContainer}>
                {getCurrentForm()}
            </div>
            <div className={styles.loginLogo}>
                <BrandLogo size={40}  />
                <div className={styles.loginLogoTitle}>ICoinCat</div>
            </div>
            
        </div>
        
    );
}

export default LoginPage