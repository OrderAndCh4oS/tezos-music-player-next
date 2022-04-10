import {ButtonHTMLAttributes, FC} from "react";
import styles from './styles.module.css'

const Button: FC<ButtonHTMLAttributes<{}>> = ({className, children, ...rest}) => {
    return (
        <button className={styles.button + ' ' + className || ''} {...rest}>
            {children}
        </button>
    );
};

export default Button;
