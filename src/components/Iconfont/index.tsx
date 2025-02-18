import React from 'react';
import classnames from 'classnames';
import styles from './index.less';

interface IProps extends React.HTMLAttributes<HTMLElement> {
  code: string;
  box?: boolean;
  boxSize?: number;
  size?: number;
  className?: string;
  classNameBox?: string;
  active?: boolean;
}

const Iconfont = (props: IProps) => {
  const { box, boxSize = 32, size = 14, className, classNameBox, active, ...args } = props;
  return box ? (
    <div
      {...args}
      style={
        {
          '--icon-box-size': `${boxSize}px`,
          '--icon-size': `${size}px`,
        } as any
      }
      className={classnames(classNameBox, styles.iconBox, { [styles.activeIconBox]: active })}
    >
      <i className={classnames(className, styles.iconfont)}>{props.code}</i>
    </div>
  ) : (
    <i
      style={
        {
          fontSize: size + 'px',
          width: size + 'px',
          height: size + 'px'
        } as any
      }
      className={classnames(className, styles.iconfont)}
      {...args}
    >
      {props.code}
    </i>
  );
};

export default Iconfont;