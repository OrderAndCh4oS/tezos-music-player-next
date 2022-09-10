import {FC} from "react";
import Link from "next/link";
import styles from "./styles.module.css";

const Header: FC = () => {
    return (
        <header className={styles.header}>
            <div className={styles.navigation}>
                <Link href={'/'}>
                    <a className={styles.link}>Tracks</a>
                </Link>
                <Link href={'/queue'}>
                    <a className={styles.link}>Queue</a>
                </Link>
            </div>
        </header>
    )
}

export default Header;
