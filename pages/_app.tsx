import '../styles/globals.css'
import type {AppProps} from 'next/app'
import styles from './styles.module.css';
import Head from 'next/head';
import PlaylistProvider from '../context/playlist-context';
import {useEffect} from 'react';
import Header from '../components/header/header';
import Footer from '../components/footer/footer';
import ToastProvider from '../context/toast-context';
import NProgress from 'nprogress';
import {useRouter} from 'next/router';

function MyApp({Component, pageProps}: AppProps) {
    const router = useRouter();

    useEffect(() => {
        const storedDarkMode = window.localStorage.getItem('darkMode');
        if (storedDarkMode === 'true') {
            document.body.classList.add('darkMode');
        }
    }, []);

    useEffect(() => {
        const handleStart = (url: string) => {
            NProgress.start();
        };
        const handleStop = () => {
            NProgress.done();
        };

        router.events.on('routeChangeStart', handleStart);
        router.events.on('routeChangeComplete', handleStop);
        router.events.on('routeChangeError', handleStop);

        return () => {
            router.events.off('routeChangeStart', handleStart);
            router.events.off('routeChangeComplete', handleStop);
            router.events.off('routeChangeError', handleStop);
        };
    }, [router]);

    return (
        <div className={styles.pageWrapper}>
            <Head>
                <title>NFT Music Player</title>
                <meta name="description" content="Tezos Audio NFTs"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <ToastProvider>
                <Header/>
                <main className={styles.main}>
                    <PlaylistProvider>
                        <Component {...pageProps}/>
                    </PlaylistProvider>
                </main>
                <Footer/>
            </ToastProvider>
        </div>
    );
}

export default MyApp
