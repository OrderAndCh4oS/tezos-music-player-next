import {SWRConfig} from 'swr';
import getTrackFetcher, {trackApi} from "../../../api/get-track";
import {GetServerSideProps} from "next";
import {FC} from "react";
import {IToken} from "../../../api/get-tracks";
import TrackDetailView from "../../../components/track-detail-view/track-detail-view";
import SidebarWrapper from "../../../components/sidebar-wrapper/sidebar-wrapper";

export const getServerSideProps: GetServerSideProps = async ({params}) => {
    const {contract, id} = params as { contract: string, id: string };

    const {token} = await getTrackFetcher(
        trackApi,
        contract,
        id
    );

    const swrKey = JSON.stringify([trackApi, contract, id]);

    return {
        props: {
            swrKey,
            fallback: {
                [swrKey]: token
            }
        },
    };
};

interface ITrackPageProps {
    fallback: { [swrKey: string]: IToken },
    swrKey: string
}

const TrackPage: FC<ITrackPageProps> = ({swrKey, fallback}) => {
    return (
        <SWRConfig
            value={{
                fallback,
                refreshInterval: 1000 * 60 * 15
            }}
        >
            <SidebarWrapper>
                <TrackDetailView swrKey={swrKey}/>
            </SidebarWrapper>
        </SWRConfig>
    );
};

export default TrackPage;


