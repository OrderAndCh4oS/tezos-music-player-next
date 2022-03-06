import {FC} from "react";
import styles from './styles.module.css'

const TrackRow: FC = ({children}) =>
    <div className={styles.trackRow}>
        {children}
    </div>
;

export default TrackRow;
