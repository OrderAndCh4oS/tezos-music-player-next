import Link from 'next/link';
import styles from './styles.module.css';
import useSWR from 'swr';
import {FC} from "react";
import serialise from "../../utilities/serialise";
import {useRouter} from "next/router";

const NextPrev: FC<{ path: string, swrKey: string, fetcher: any, mightHaveMore: boolean }> = ({
                                                                                                  path,
                                                                                                  swrKey,
                                                                                                  fetcher,
                                                                                                  mightHaveMore
                                                                                              }) => {
    const {data} = useSWR(swrKey, fetcher, {use: [serialise]});
    const {page} = data || {page: 1};
    const router = useRouter()
    const {search} = router.query

    return (
        <div className={styles.pagination}>
            {
                page !== 1 && <Link
                    href={{
                        pathname: `${path}/[page]`,
                        query: {page: page - 1, search}
                    }}
                >
                    <a className={styles.page}>Prev</a>
                </Link>
            }
            {mightHaveMore && <Link
                href={{
                    pathname: `${path}/[page]`,
                    query: {page: page + 1, search}
                }}
            >
                <a className={styles.page}>Next</a>
            </Link>}
        </div>
    );
};

export default NextPrev;
