import '../styles/globals.css'
import type {AppProps} from 'next/app'
import Player from "../class/player";
import styles from "../styles/Home.module.css";
import Head from "next/head";

function MyApp({Component, pageProps}: AppProps) {
    let player = null
    if(typeof window !== 'undefined') {
        player = new Player();
    }
    return (
        <div className={styles.container}>
            <Head>
                <title>Create Next App</title>
                <meta name="description" content="Tezos Audio NFTs"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <main className={styles.main}>
                <Component {...pageProps} player={player}/>
            </main>
            <footer className={styles.footer}>
                Tezos Audio NFTs
            </footer>
        </div>
    );
}

export default MyApp
