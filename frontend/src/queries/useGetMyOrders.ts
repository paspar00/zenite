import {useQuery} from "@tanstack/react-query";
import {orderClient} from "../api/order.client.ts";
import {Order} from "../types.ts";

export const GET_MY_ORDERS_QUERY_KEY = 'getMyOrders';

export const useGetMyOrders = () => {
    return useQuery<Order[]>({
        queryKey: [GET_MY_ORDERS_QUERY_KEY],
        queryFn: async () => {
            const {data} = await orderClient.mine();
            return data;
        },
    });
};
