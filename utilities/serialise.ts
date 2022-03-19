import {Middleware} from "swr/dist/types";

const serialise: Middleware = (useSWRNext) => (key, fetcher, config) => {
    const serialisedKey = Array.isArray(key) ? JSON.stringify(key) : key

    // @ts-ignore
    return useSWRNext(serialisedKey, (k) => fetcher ? fetcher(...JSON.parse(k)) : null, config)
};

export default serialise;
