import {Alert, Badge, Group, Loader, Stack, Text} from "@mantine/core";
import {t} from "@lingui/macro";
import {IconAlertCircle, IconReceipt2} from "@tabler/icons-react";
import {useGetMyOrders} from "../../../../queries/useGetMyOrders.ts";
import {NoResultsSplash} from "../../../common/NoResultsSplash";
import {formatCurrency} from "../../../../utilites/currency.ts";
import {relativeDate} from "../../../../utilites/dates.ts";
import classes from "./ManageProfile.module.scss";

const getStatusColor = (status: string) => {
    switch (status) {
        case 'COMPLETED':
            return 'green';
        case 'CANCELLED':
            return 'red';
        case 'AWAITING_OFFLINE_PAYMENT':
            return 'yellow';
        default:
            return 'gray';
    }
};

const getStatusLabel = (status: string) => {
    switch (status) {
        case 'COMPLETED':
            return t`Completed`;
        case 'CANCELLED':
            return t`Cancelled`;
        case 'AWAITING_OFFLINE_PAYMENT':
            return t`Awaiting Payment`;
        default:
            return status;
    }
};

export const CustomerOrdersPanel = () => {
    const {data: orders, isLoading, isError} = useGetMyOrders();

    if (isLoading) {
        return (
            <div className={classes.ordersLoader}>
                <Loader/>
            </div>
        );
    }

    if (isError) {
        return (
            <Alert icon={<IconAlertCircle size={16}/>} color="red" variant="light">
                {t`We couldn't load your order history right now. Please try again.`}
            </Alert>
        );
    }

    if (!orders?.length) {
        return (
            <NoResultsSplash
                imageHref={'/blank-slate/orders.svg'}
                heading={t`No orders yet`}
                subHeading={<p>{t`Your purchase history will appear here after your first order.`}</p>}
            />
        );
    }

    return (
        <Stack gap="md">
            {orders.map((order) => {
                const totalItems = order.order_items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

                return (
                    <div key={order.id} className={classes.orderCard}>
                        <Group justify="space-between" align="flex-start" gap="md">
                            <div>
                                <Group gap="xs" mb={6}>
                                    <IconReceipt2 size={16}/>
                                    <Text fw={700}>{order.event?.title || t`Event #${order.event_id}`}</Text>
                                </Group>
                                <Text size="sm" c="dimmed">
                                    {t`Order`} #{order.public_id}
                                </Text>
                                <Text size="sm" c="dimmed">
                                    {relativeDate(order.created_at)}
                                </Text>
                            </div>

                            <Badge color={getStatusColor(order.status)} variant="light">
                                {getStatusLabel(order.status)}
                            </Badge>
                        </Group>

                        <div className={classes.orderMetaGrid}>
                            <div>
                                <Text size="xs" c="dimmed">{t`Total`}</Text>
                                <Text fw={600}>{formatCurrency(order.total_gross, order.currency)}</Text>
                            </div>
                            <div>
                                <Text size="xs" c="dimmed">{t`Items`}</Text>
                                <Text fw={600}>{totalItems}</Text>
                            </div>
                            <div>
                                <Text size="xs" c="dimmed">{t`Buyer`}</Text>
                                <Text fw={600}>{order.first_name} {order.last_name}</Text>
                            </div>
                        </div>

                        {order.order_items?.length ? (
                            <Text size="sm" c="dimmed" mt="sm">
                                {order.order_items.map((item) => `${item.quantity}x ${item.item_name}`).join(', ')}
                            </Text>
                        ) : null}
                    </div>
                );
            })}
        </Stack>
    );
};
