import {FC, KeyboardEvent} from "react";
import styles from './styles.module.css'
import {useRouter} from "next/router";

const SearchBar: FC = () => {
    const router = useRouter();
    let timer: any;

    const handleKeyUp = (event: KeyboardEvent<HTMLInputElement>) => {
        if(timer) clearTimeout(timer);
        timer = setTimeout(() => {
            const target = event.target as HTMLInputElement;
            const search = target.value;
            if(!search) {
                router.push('/');
                return;
            }
            router.push({
                pathname: '/',
                query: { search },
            });
        }, 444);
    };

    return (
        <input
            onKeyUp={handleKeyUp}
            className={styles.searchBar}
            placeholder='Search'
        />
    )
};

export default SearchBar;
