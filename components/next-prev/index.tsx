import Link from 'next/link';
import styles from './styles.module.css';
import useSWR from 'swr';
import {FC} from "react";
import serialise from "../../utilities/serialise";
import getAudioTokensFetcher from "../../api/get-tracks";

const NextPrev: FC<{ swrKey: string }> = ({swrKey}) => {
    const {data} = useSWR(swrKey, getAudioTokensFetcher, {use: [serialise]});
    const {page} = data || {page: 1};

    return (
        <div className={styles.pagination}>
            {
                page !== 1 && <Link
                    href={{
                        pathname: `/page/[page]`,
                        query: {page: page - 1}
                    }}
                >
                    <a className={styles.page}>Prev</a>
                </Link>
            }
            <Link
                href={{
                    pathname: `/page/[page]`,
                    query: {page: page + 1}
                }}
            >
                <a className={styles.page}>Next</a>
            </Link>
        </div>
    );
};

export default NextPrev;
