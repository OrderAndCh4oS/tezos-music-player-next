import {ButtonHTMLAttributes, FC} from "react";
import styles from './styles.module.css'

const TrackRowButton: FC<ButtonHTMLAttributes<HTMLButtonElement>> = ({children, ...rest}) =>
    <button className={styles.trackRowButton} {...rest}>
        {children}
    </button>
;

export default TrackRowButton;
