import useTezos from "../../hooks/use-tezos";
import {FC} from "react";
import {getTrimmedWallet} from "../../utilities/get-trimmed-wallet";
import Link from "next/link";
import styles from "./styles.module.css";

const Header: FC = () => {
    const {sync, unsync, auth} = useTezos();

    return (
        <header className={styles.header}>
            <div>
                <Link href={'/'}>
                    <a className={styles.link}>Track List</a>
                </Link>
                <Link href={'/queue'}>
                    <a className={styles.link}>Queue</a>
                </Link>
            </div>
            <div className={styles.auth}>
                {auth ? ' ' + getTrimmedWallet(auth.address) : ' Sync wallet to begin'}
                {' '}
                {!auth
                    ? <button onClick={sync}>Sync</button>
                    : <button onClick={unsync}>Unsync</button>}
            </div>
        </header>
    )
}

export default Header;
