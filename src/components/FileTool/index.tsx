import type { IFileTool, IFileToolChildren } from "@/typings";
import styles from './index.less';
import Iconfont from "../Iconfont";

const FileTool = (props: {tools: IFileTool[]}) => {
    return <div className={styles.toolContainer}>
        {props.tools.map((item: IFileTool) => {
            return <div>
                <div className={styles.title}>
                    {item.title}
                </div>
                <div className={styles.tool}>
                    {item.children.map((child: IFileToolChildren) => {
                        return <div className={styles.childrenContainer}>
                            <Iconfont size={50} code={child.icon}></Iconfont>
                            <div className={styles.childrenText}>
                                {child.label}
                            </div>
                        </div>
                    })}
                </div>
            </div>
        })}
    </div>
}

export default FileTool;