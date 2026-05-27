import {api} from "./client.ts";
import {GenericPaginatedResponse, GenericDataResponse, QueryFilters, IdParam} from "../types.ts";

export interface MarketingSubscriber {
    id: number;
    email: string;
    first_name: string | null;
    last_name: string | null;
    city: string | null;
    state: string | null;
    status: 'active' | 'unsubscribed' | 'suppressed' | 'pending_confirmation';
    source: string;
    opted_in_at: string | null;
    last_activity_at: string | null;
    tags: string[] | null;
}

export interface GeoTargetingStats {
    total_subscribers: number;
    by_state: Array<{ state: string; count: number }>;
    by_city: Array<{ city: string; state: string; count: number }>;
}

export const marketingClient = {
    getSubscribers: async (organizerId: IdParam, params?: QueryFilters) => {
        const response = await api.get<GenericPaginatedResponse<MarketingSubscriber>>(
            `organizers/${organizerId}/marketing/subscribers`,
            {params}
        );
        return response.data;
    },
    getGeoStats: async (organizerId: IdParam, eventId: IdParam) => {
        const response = await api.get<GenericDataResponse<GeoTargetingStats>>(
            `organizers/${organizerId}/events/${eventId}/marketing/geo-stats`
        );
        return response.data;
    },
};
