import {useState} from "react";
import {Alert, Badge, Loader, Stack, Tabs} from "@mantine/core";
import {
    IconAlertCircle,
    IconCalendar,
    IconReceipt2,
    IconTag,
    IconTicket,
    IconUser,
} from "@tabler/icons-react";
import {useGetMe} from "../../../../queries/useGetMe.ts";
import {useGetMyOrders} from "../../../../queries/useGetMyOrders.ts";
import {NoResultsSplash} from "../../../common/NoResultsSplash";
import {formatCurrency} from "../../../../utilites/currency.ts";
import {formatDateWithLocale, relativeDate} from "../../../../utilites/dates.ts";
import {Order} from "../../../../types.ts";
import classes from "./CustomerArea.module.scss";

// Helpers

const statusColor = (status: string) => {
    switch (status) {
        case "COMPLETED":
        case "ACTIVE":
            return "green";
        case "CANCELLED":
            return "red";
        case "AWAITING_OFFLINE_PAYMENT":
        case "AWAITING_PAYMENT":
            return "yellow";
        default:
            return "gray";
    }
};

const statusLabel = (status: string) => {
    switch (status) {
        case "COMPLETED":
            return "Concluído";
        case "ACTIVE":
            return "Ativo";
        case "CANCELLED":
            return "Cancelado";
        case "AWAITING_OFFLINE_PAYMENT":
        case "AWAITING_PAYMENT":
            return "Aguardando pagamento";
        default:
            return status;
    }
};

// Tickets Tab

function TicketsTab({orders}: { orders: Order[] }) {
    const tickets = orders.flatMap((order) =>
        (order.attendees ?? []).map((a) => ({
            ...a,
            eventTitle: order.event?.title ?? `Evento #${order.event_id}`,
            eventDate: order.event?.start_date ?? null,
            eventTimezone: order.event?.timezone ?? "UTC",
        }))
    );

    const orderItems = orders.flatMap((order) =>
        (order.order_items ?? []).map((item) => ({
            ...item,
            eventTitle: order.event?.title ?? `Evento #${order.event_id}`,
            eventDate: order.event?.start_date ?? null,
            eventTimezone: order.event?.timezone ?? "UTC",
            orderStatus: order.status,
        }))
    );

    const hasAttendees = tickets.length > 0;
    const hasItems = orderItems.length > 0;

    if (!hasAttendees && !hasItems) {
        return (
            <NoResultsSplash
                imageHref="/blank-slate/orders.svg"
                heading="Nenhum ingresso ainda"
                subHeading={<p>Seus ingressos aparecerão aqui após a compra.</p>}
            />
        );
    }

    if (hasAttendees) {
        return (
            <Stack gap="md">
                {tickets.map((ticket) => (
                    <div key={ticket.id ?? ticket.public_id} className={classes.ticketCard}>
                        <div className={classes.ticketIcon}>
                            <IconTicket size={22}/>
                        </div>
                        <div className={classes.ticketBody}>
                            <p className={classes.ticketEvent}>{ticket.eventTitle}</p>
                            <p className={classes.ticketProduct}>
                                {ticket.product?.title ?? "Ingresso"}
                            </p>
                            <div className={classes.ticketMeta}>
                                <span className={classes.ticketMetaItem}>
                                    <IconUser size={12}/>
                                    {ticket.first_name} {ticket.last_name}
                                </span>
                                {ticket.eventDate && (
                                    <span className={classes.ticketMetaItem}>
                                        <IconCalendar size={12}/>
                                        {formatDateWithLocale(ticket.eventDate, "shortDate", ticket.eventTimezone)}
                                    </span>
                                )}
                                {ticket.public_id && (
                                    <span className={classes.ticketMetaItem}>
                                        <IconTag size={12}/>
                                        #{ticket.public_id}
                                    </span>
                                )}
                            </div>
                        </div>
                        <Badge color={statusColor(ticket.status)} variant="light" size="sm">
                            {statusLabel(ticket.status)}
                        </Badge>
                    </div>
                ))}
            </Stack>
        );
    }

    return (
        <Stack gap="md">
            {orderItems.map((item, idx) => (
                <div key={idx} className={classes.ticketCard}>
                    <div className={classes.ticketIcon}>
                        <IconTicket size={22}/>
                    </div>
                    <div className={classes.ticketBody}>
                        <p className={classes.ticketEvent}>{item.eventTitle}</p>
                        <p className={classes.ticketProduct}>{item.item_name}</p>
                        <div className={classes.ticketMeta}>
                            {item.eventDate && (
                                <span className={classes.ticketMetaItem}>
                                    <IconCalendar size={12}/>
                                    {formatDateWithLocale(item.eventDate, "shortDate", item.eventTimezone)}
                                </span>
                            )}
                            <span className={classes.ticketMetaItem}>
                                Qtd: {item.quantity}
                            </span>
                        </div>
                    </div>
                    <Badge color={statusColor(item.orderStatus)} variant="light" size="sm">
                        {statusLabel(item.orderStatus)}
                    </Badge>
                </div>
            ))}
        </Stack>
    );
}

// Orders Tab

function OrdersTab({orders}: { orders: Order[] }) {
    if (orders.length === 0) {
        return (
            <NoResultsSplash
                imageHref="/blank-slate/orders.svg"
                heading="Nenhum pedido ainda"
                subHeading={<p>Seu histórico de compras aparecerá aqui após o primeiro pedido.</p>}
            />
        );
    }

    return (
        <Stack gap="md">
            {orders.map((order) => {
                const totalItems = order.order_items?.reduce((s, i) => s + i.quantity, 0) ?? 0;
                return (
                    <div key={order.id} className={classes.orderCard}>
                        <div className={classes.orderHeader}>
                            <div>
                                <p className={classes.orderTitle}>
                                    {order.event?.title ?? `Evento #${order.event_id}`}
                                </p>
                                <p className={classes.orderMeta}>
                                    Pedido #{order.public_id} · {relativeDate(order.created_at)}
                                </p>
                            </div>
                            <Badge color={statusColor(order.status)} variant="light">
                                {statusLabel(order.status)}
                            </Badge>
                        </div>

                        {order.order_items?.length ? (
                            <p className={classes.orderItems}>
                                {order.order_items.map((i) => `${i.quantity}× ${i.item_name}`).join(", ")}
                            </p>
                        ) : null}

                        <div className={classes.orderMetaGrid}>
                            <div>
                                <p className={classes.orderMetaLabel}>Total</p>
                                <p className={classes.orderMetaValue}>
                                    {formatCurrency(order.total_gross, order.currency)}
                                </p>
                            </div>
                            <div>
                                <p className={classes.orderMetaLabel}>Ingressos</p>
                                <p className={classes.orderMetaValue}>{totalItems}</p>
                            </div>
                            <div>
                                <p className={classes.orderMetaLabel}>Comprador</p>
                                <p className={classes.orderMetaValue}>{order.first_name} {order.last_name}</p>
                            </div>
                        </div>
                    </div>
                );
            })}
        </Stack>
    );
}

// Page

const CustomerOrders = () => {
    const [activeTab, setActiveTab] = useState<string>("tickets");
    const {data: me} = useGetMe();
    const {data: orders, isLoading, isError} = useGetMyOrders();

    const firstName = me?.first_name;
    const list = orders ?? [];

    return (
        <div className={classes.page}>
            <div className={classes.heroHeader}>
                <h1 className={classes.greeting}>
                    {firstName ? `Olá, ${firstName}!` : "Área do Cliente"}
                </h1>
                <p className={classes.subtitle}>
                    Acompanhe seus ingressos e histórico de compras em um único lugar.
                </p>
            </div>

            <Tabs value={activeTab} onChange={(v) => setActiveTab(v ?? "tickets")} className={classes.tabsRoot}>
                <Tabs.List mb="lg">
                    <Tabs.Tab value="tickets" leftSection={<IconTicket size={16}/>}>
                        Meus Ingressos
                    </Tabs.Tab>
                    <Tabs.Tab value="orders" leftSection={<IconReceipt2 size={16}/>}>
                        Histórico de Compras
                    </Tabs.Tab>
                </Tabs.List>

                {isLoading && (
                    <div className={classes.loader}>
                        <Loader/>
                    </div>
                )}
                {isError && (
                    <Alert icon={<IconAlertCircle size={16}/>} color="red" variant="light">
                        Não foi possível carregar seus dados. Tente novamente.
                    </Alert>
                )}

                {!isLoading && !isError && (
                    <>
                        <Tabs.Panel value="tickets">
                            <TicketsTab orders={list}/>
                        </Tabs.Panel>
                        <Tabs.Panel value="orders">
                            <OrdersTab orders={list}/>
                        </Tabs.Panel>
                    </>
                )}
            </Tabs>
        </div>
    );
};

export default CustomerOrders;
