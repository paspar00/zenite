import {Badge, Group, Stack, Text} from "@mantine/core";
import {Card} from "../Card";
import {useGetGeoTargetingStats} from "../../../queries/useGetGeoTargetingStats.ts";
import {IdParam} from "../../../types.ts";
import {t} from "@lingui/macro";

interface GeoTargetingStatsCardProps {
    organizerId: IdParam;
    eventId: IdParam;
}

export const GeoTargetingStatsCard = ({organizerId, eventId}: GeoTargetingStatsCardProps) => {
    const {data, isLoading} = useGetGeoTargetingStats(organizerId, eventId);

    if (isLoading || !data?.data || data.data.total_subscribers === 0) {
        return null;
    }

    const stats = data.data;
    const topCities = stats.by_city.slice(0, 3);

    return (
        <Card>
            <Stack gap="xs">
                <Group justify="space-between" align="center">
                    <Text fw={600} size="sm">
                        {t`Alcance Regional`}
                    </Text>
                    <Badge variant="light" color="blue">
                        {stats.total_subscribers}
                    </Badge>
                </Group>

                <Text size="xs" c="dimmed">
                    {t`Assinantes na região do evento`}
                </Text>

                {topCities.length > 0 && (
                    <Stack gap={4}>
                        {topCities.map((item) => (
                            <Group key={`${item.state}-${item.city}`} justify="space-between">
                                <Text size="xs">
                                    {item.city}, {item.state}
                                </Text>
                                <Badge size="xs" variant="outline" color="gray">
                                    {item.count}
                                </Badge>
                            </Group>
                        ))}
                    </Stack>
                )}
            </Stack>
        </Card>
    );
};
