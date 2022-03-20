import '../styles/globals.css'
import type {AppProps} from 'next/app'
import styles from "./styles.module.css";
import Head from "next/head";
import PlaylistProvider from "../context/playlist";

function MyApp({Component, pageProps}: AppProps) {
    return (
        <div className={styles.pageWrapper}>
            <Head>
                <title>NFT Music Player</title>
                <meta name="description" content="Tezos Audio NFTs"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <main className={styles.main}>
                <PlaylistProvider>
                    <Component {...pageProps}/>
                </PlaylistProvider>
            </main>
            <footer className={styles.footer}>
                Tezos Audio NFTs
            </footer>
        </div>
    );
}

export default MyApp
