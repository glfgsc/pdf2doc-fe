import styles from './index.less';
import BrandLogo from '@/components/BrandLogo';
import LoginForm from './loginForm';

const LoginPage = () => {
    return (
        <div className={styles.container}>
            <div className={styles.loginContainer}>
                <LoginForm />
            </div>
            <div className={styles.loginLogo}>
                <BrandLogo size={40}  />
                <div className={styles.loginLogoTitle}>ICoinCat</div>
            </div>
            
        </div>
        
    );
}

export default LoginPage