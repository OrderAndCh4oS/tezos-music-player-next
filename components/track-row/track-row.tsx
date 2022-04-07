import {FC} from "react";
import styles from './styles.module.css'

const TrackRow: FC<{className: string}> = ({className, children}) =>
    <div className={`${styles.trackRow} ${className}`}>
        {children}
    </div>
;

export default TrackRow;
