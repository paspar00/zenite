import {useQuery} from "@tanstack/react-query";
import {orderClientPublic} from "../api/order.client.ts";
import {IdParam, Order} from "../types.ts";
import {useMemo} from "react";
import {isSsr} from "../utilites/helpers.ts";

export const GET_ORDER_PUBLIC_QUERY_KEY = "getOrderPublic";

const SESSION_EMAIL_PREFIX = "order_email_";

const getSessionIdentifierFromUrl = (): string | null => {
    if (isSsr()) return null;

    const url = new URL(window.location.href);
    return url.searchParams.get("session_identifier");
};

export const getStoredOrderEmail = (orderShortId: string): string | null => {
    if (isSsr()) return null;
    return sessionStorage.getItem(`${SESSION_EMAIL_PREFIX}${orderShortId}`);
};

export const storeOrderEmail = (orderShortId: string, email: string): void => {
    if (isSsr()) return;
    sessionStorage.setItem(`${SESSION_EMAIL_PREFIX}${orderShortId}`, email);
};

export const useGetOrderPublic = (
    eventId: IdParam,
    orderShortId: IdParam,
    includes: string[] = []
) => {
    const sessionIdentifier = useMemo(getSessionIdentifierFromUrl, []);
    const storedEmail = useMemo(
        () => getStoredOrderEmail(String(orderShortId)),
        [orderShortId]
    );

    return useQuery<Order>({
        queryKey: [
            GET_ORDER_PUBLIC_QUERY_KEY,
            eventId,
            orderShortId,
            sessionIdentifier,
            storedEmail,
        ],
        queryFn: async () => {
            const {data} = await orderClientPublic.findByShortId(
                Number(eventId),
                String(orderShortId),
                includes,
                sessionIdentifier ?? undefined,
                storedEmail ?? undefined,
            );

            if (data.email) {
                storeOrderEmail(String(orderShortId), data.email);
            }

            return data;
        },
        refetchOnWindowFocus: false,
        staleTime: 500,
        retryOnMount: false,
        retry: false,
    });
};
