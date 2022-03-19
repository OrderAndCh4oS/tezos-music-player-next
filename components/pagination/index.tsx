import Link from 'next/link';
import styles from './styles.module.css';
import paginate from '../../utilities/pagination';
import useSWR from 'swr';
import {FC} from "react";
import serialise from "../../utilities/serialise";
import getAudioTokensFetcher from "../../api/get-tracks";

const Pagination: FC<{ swrKey: string, search?: string }> = ({swrKey, search}) => {
    const {data} = useSWR(swrKey, getAudioTokensFetcher, {use: [serialise]});
    const {page, limit, total} = data || {page: 1, limit: 250, total: 0};
    const query = search ? {search} : {};
    const pages = paginate(page, total, limit);

    return (
        <div className={styles.pagination}>
            {pages.map((p, i) =>
                p !== '…'
                    ? <Link
                        key={i}
                        href={{
                            pathname: `/page/[page]`,
                            query: {...query, page: p}
                        }}
                    >
                        <a
                            className={[
                                styles.page,
                                p === page ? styles.currentPage : ''
                            ].join(' ')}
                        >{p}</a>
                    </Link>
                    : <button
                        key={i}
                        disabled
                        className={styles.page}
                    >{p}</button>
            )}
        </div>
    );
};

export default Pagination;
