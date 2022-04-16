import {ButtonHTMLAttributes, FC} from "react";
import styles from './styles.module.css'

const ControlButton: FC<ButtonHTMLAttributes<{}>> = ({className, children, ...rest}) => {
    return (
        <button className={styles.controlButton + ' ' + className || ''} {...rest}>
            {children}
        </button>
    );
};

export default ControlButton;
