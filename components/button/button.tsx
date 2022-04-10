import {ButtonHTMLAttributes, FC} from "react";
import styles from './styles.module.css'

const Button: FC<ButtonHTMLAttributes<{}>> = ({children, ...rest}) => {
    return (
        <button className={styles.button} {...rest}>
            {children}
        </button>
    );
};

export default Button;
