import { getToken } from '@/utils/localStorage';
import { Navigate,Outlet } from 'umi';

const AuthRouter = (props: any) => {
  // 这个根据自己判断是否登录
  const token = getToken() ? true : false;
  return token ? <div>{props.children}
    <Outlet />
  </div> : <Navigate to="/login" />;
};

export default AuthRouter;