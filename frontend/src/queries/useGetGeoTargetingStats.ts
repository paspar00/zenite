import {useQuery} from "@tanstack/react-query";
import {IdParam} from "../types.ts";
import {marketingClient} from "../api/marketing.client.ts";

export const GET_GEO_TARGETING_STATS_QUERY_KEY = 'getGeoTargetingStats';

export const useGetGeoTargetingStats = (organizerId: IdParam, eventId: IdParam) => {
    return useQuery({
        queryKey: [GET_GEO_TARGETING_STATS_QUERY_KEY, organizerId, eventId],
        queryFn: async () => {
            return marketingClient.getGeoStats(organizerId, eventId);
        },
        enabled: !!organizerId && !!eventId,
    });
};
