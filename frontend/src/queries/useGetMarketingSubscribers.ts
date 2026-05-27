import {useQuery} from "@tanstack/react-query";
import {IdParam, QueryFilters} from "../types.ts";
import {marketingClient} from "../api/marketing.client.ts";

export const GET_MARKETING_SUBSCRIBERS_QUERY_KEY = 'getMarketingSubscribers';

export const useGetMarketingSubscribers = (organizerId: IdParam, params?: QueryFilters) => {
    return useQuery({
        queryKey: [GET_MARKETING_SUBSCRIBERS_QUERY_KEY, organizerId, params],
        queryFn: async () => {
            return marketingClient.getSubscribers(organizerId, params);
        },
        enabled: !!organizerId,
    });
};
