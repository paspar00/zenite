import {useEffect} from "react";
import {
    Alert,
    Button,
    Divider,
    Paper,
    Select,
    Stack,
    Text,
    TextInput,
    Title,
} from "@mantine/core";
import {useForm} from "@mantine/form";
import {IconAlertCircle, IconCheck, IconUser} from "@tabler/icons-react";
import {useGetMe} from "../../../../queries/useGetMe.ts";
import {useUpdateMe} from "../../../../mutations/useUpdateMe.ts";
import {showError, showSuccess} from "../../../../utilites/notifications.tsx";
import classes from "./Profile.module.scss";

const BRAZIL_STATES = [
    {value: "AC", label: "Acre"},
    {value: "AL", label: "Alagoas"},
    {value: "AP", label: "Amapá"},
    {value: "AM", label: "Amazonas"},
    {value: "BA", label: "Bahia"},
    {value: "CE", label: "Ceará"},
    {value: "DF", label: "Distrito Federal"},
    {value: "ES", label: "Espírito Santo"},
    {value: "GO", label: "Goiás"},
    {value: "MA", label: "Maranhão"},
    {value: "MT", label: "Mato Grosso"},
    {value: "MS", label: "Mato Grosso do Sul"},
    {value: "MG", label: "Minas Gerais"},
    {value: "PA", label: "Pará"},
    {value: "PB", label: "Paraíba"},
    {value: "PR", label: "Paraná"},
    {value: "PE", label: "Pernambuco"},
    {value: "PI", label: "Piauí"},
    {value: "RJ", label: "Rio de Janeiro"},
    {value: "RN", label: "Rio Grande do Norte"},
    {value: "RS", label: "Rio Grande do Sul"},
    {value: "RO", label: "Rondônia"},
    {value: "RR", label: "Roraima"},
    {value: "SC", label: "Santa Catarina"},
    {value: "SP", label: "São Paulo"},
    {value: "SE", label: "Sergipe"},
    {value: "TO", label: "Tocantins"},
];

const CustomerProfile = () => {
    const {data: me, isLoading} = useGetMe();
    const updateMe = useUpdateMe();

    const profileForm = useForm({
        initialValues: {
            first_name: "",
            last_name: "",
            email: "",
            city: "",
            state: "",
        },
    });

    useEffect(() => {
        if (me) {
            profileForm.setValues({
                first_name: me.first_name ?? "",
                last_name: me.last_name ?? "",
                email: me.email ?? "",
                city: me.city ?? "",
                state: me.state ?? "",
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [me?.id]);

    const handleProfileSubmit = profileForm.onSubmit((values) => {
        updateMe.mutate(
            {
                userData: {
                    first_name: values.first_name,
                    last_name: values.last_name,
                    email: values.email,
                    city: values.city || null,
                    state: values.state || null,
                },
            },
            {
                onSuccess: () => showSuccess("Dados atualizados com sucesso!"),
                onError: () => showError("Não foi possível salvar. Tente novamente."),
            }
        );
    });

    if (isLoading) {
        return null;
    }

    return (
        <div className={classes.page}>
            <div className={classes.header}>
                <Title order={2} className={classes.title}>Meu Perfil</Title>
                <Text c="dimmed" size="sm">Gerencie seus dados pessoais.</Text>
            </div>

            <Paper className={classes.card} withBorder radius="md" p="xl">
                <div className={classes.cardHeader}>
                    <IconUser size={20} className={classes.cardIcon}/>
                    <Title order={4}>Dados pessoais</Title>
                </div>

                <form onSubmit={handleProfileSubmit}>
                    <Stack gap="md" mt="md">
                        <div className={classes.row}>
                            <TextInput
                                label="Nome"
                                placeholder="Seu nome"
                                {...profileForm.getInputProps("first_name")}
                            />
                            <TextInput
                                label="Sobrenome"
                                placeholder="Seu sobrenome"
                                {...profileForm.getInputProps("last_name")}
                            />
                        </div>

                        <TextInput
                            label="E-mail"
                            placeholder="seu@email.com"
                            {...profileForm.getInputProps("email")}
                        />

                        <Divider
                            label="Localização"
                            labelPosition="left"
                            my={4}
                        />

                        <div className={classes.row}>
                            <TextInput
                                label="Cidade"
                                placeholder="Sua cidade"
                                description="Para receber alertas de eventos na sua região"
                                {...profileForm.getInputProps("city")}
                            />
                            <Select
                                label="Estado"
                                placeholder="Selecione"
                                data={BRAZIL_STATES}
                                searchable
                                clearable
                                {...profileForm.getInputProps("state")}
                            />
                        </div>

                        <Button
                            type="submit"
                            loading={updateMe.isPending}
                            leftSection={<IconCheck size={16}/>}
                            mt={4}
                        >
                            Salvar dados
                        </Button>
                    </Stack>
                </form>
            </Paper>

            {me?.pending_email && (
                <Alert icon={<IconAlertCircle size={16}/>} color="yellow" variant="light" mt="lg">
                    Uma confirmação foi enviada para o novo e-mail. Verifique sua caixa de entrada.
                </Alert>
            )}
        </div>
    );
};

export default CustomerProfile;
