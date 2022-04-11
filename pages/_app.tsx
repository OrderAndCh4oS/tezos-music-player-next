import '../styles/globals.css'
import type {AppProps} from 'next/app'
import styles from "./styles.module.css";
import Head from "next/head";
import PlaylistProvider from "../context/playlist-context";
import {useEffect} from "react";
import Header from "../components/header/header";
import TezosProvider from "../context/tezos-context";
import Footer from "../components/footer/footer";
import ToolsProvider from "../context/tools-context";

function MyApp({Component, pageProps}: AppProps) {
    useEffect(() => {
        const storedDarkMode = window.localStorage.getItem('darkMode');
        if (storedDarkMode === 'true') {
            document.body.classList.add('darkMode');
        }
    }, []);

    return (
        <div className={styles.pageWrapper}>
            <Head>
                <title>NFT Music Player</title>
                <meta name="description" content="Tezos Audio NFTs"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <TezosProvider>
                <ToolsProvider>
                    <Header/>
                    <main className={styles.main}>
                        <PlaylistProvider>
                            <Component {...pageProps}/>
                        </PlaylistProvider>
                    </main>
                    <Footer/>
                </ToolsProvider>
            </TezosProvider>
        </div>
    );
}

export default MyApp
