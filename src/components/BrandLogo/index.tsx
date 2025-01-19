import { memo } from "react";
import { Avatar} from 'antd';

import styles from './index.less';
import classnames from "classnames";
import logo from '@/assets/logo/logo.svg';

interface IProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    className?: any;
    size?: number;
}

export default memo<IProps>(({className,size = 48,...res}) => {
    return (
        <div {...res} className={classnames(className,styles.box)}>
            <Avatar src={logo} alt="" size={size} className={styles.avatar}/>
        </div>
    );
})