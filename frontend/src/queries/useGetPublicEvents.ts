import {useQuery} from "@tanstack/react-query";
import {eventsClientPublic} from "../api/event.client.ts";
import {QueryFilters} from "../types.ts";

export const GET_PUBLIC_EVENTS_QUERY_KEY = 'getPublicEvents';

export const useGetPublicEvents = (params?: QueryFilters) => {
    return useQuery({
        queryKey: [GET_PUBLIC_EVENTS_QUERY_KEY, params],
        queryFn: async () => {
            return await eventsClientPublic.all(params);
        }
    });
};
