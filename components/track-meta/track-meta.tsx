import {FC, HTMLAttributes} from "react";
import styles from './styles.module.css'

const TrackMeta: FC<HTMLAttributes<HTMLParagraphElement>> = ({children, ...rest}) =>
    <p className={styles.trackMeta} {...rest}>
        {children}
    </p>
;

export default TrackMeta;
