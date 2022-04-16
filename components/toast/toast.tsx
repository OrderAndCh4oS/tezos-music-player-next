import {FC} from "react";
import styles from './styles.module.css';

const Toast: FC<any> = ({message, handleCloseToast}) =>
    <>
        {message && (
            <div className={styles.toast}>
                <p className={styles.toastText}>{message}</p>
                <button onClick={handleCloseToast}>Close</button>
            </div>
        )}
    </>
;

export default Toast;
