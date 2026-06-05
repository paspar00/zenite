import {useMemo, useState} from "react";
import {Navigate, useNavigate} from "react-router";
import {useMutation} from "@tanstack/react-query";
import {useForm} from "@mantine/form";
import {CustomerFooter} from "../../../common/CustomerFooter";
import {
    Button,
    Checkbox,
    PasswordInput,
    Select,
    SimpleGrid,
    Text,
    TextInput,
} from "@mantine/core";
import {
    IconChartBar,
    IconCreditCard,
    IconDeviceMobile,
    IconPalette,
    IconQrcode,
    IconShieldCheck,
    IconSparkles,
    IconTicket,
    IconUsers,
} from "@tabler/icons-react";
import {authClient} from "../../../../api/auth.client.ts";
import {LoginData, LoginResponse, RegisterAccountRequest} from "../../../../types.ts";
import {useGetMe} from "../../../../queries/useGetMe.ts";
import {getConfig} from "../../../../utilites/config.ts";
import {getUserCurrency} from "../../../../utilites/currency.ts";
import {getClientLocale} from "../../../../locales.ts";
import {showError} from "../../../../utilites/notifications.tsx";
import authClasses from "../../../layouts/AuthLayout/Auth.module.scss";

// ─── Feature panel (same visual as organizer login) ──────────────────────────

const allFeatures = [
    {icon: IconTicket, title: 'Ingresso Digital', description: 'Seus ingressos sempre acessíveis no celular'},
    {icon: IconQrcode, title: 'Check-in por QR Code', description: 'Entrada rápida com leitura de QR Code'},
    {icon: IconCreditCard, title: 'Pagamento Seguro', description: 'Cartão de crédito e Pix com total segurança'},
    {icon: IconChartBar, title: 'Histórico Completo', description: 'Acompanhe todos os seus pedidos em um lugar'},
    {icon: IconPalette, title: 'Experiência Personalizada', description: 'Sua área do cliente com seus dados'},
    {icon: IconDeviceMobile, title: 'Mobile First', description: 'Acesso fácil pelo smartphone'},
    {icon: IconUsers, title: 'Ingressos para o grupo', description: 'Gerencie ingressos de amigos e família'},
    {icon: IconShieldCheck, title: 'Dados Protegidos', description: 'Privacidade e segurança garantidas'},
];

const FeaturePanel = () => {
    const features = useMemo(() => {
        const shuffled = [...allFeatures].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 4);
    }, []);

    return (
        <div className={authClasses.rightPanel}>
            <div className={authClasses.backgroundImage}/>
            <div className={authClasses.backgroundOverlay}/>
            <div className={authClasses.gridPattern}/>
            <div className={`${authClasses.glowEffect} ${authClasses.glowTop}`}/>
            <div className={`${authClasses.glowEffect} ${authClasses.glowBottom}`}/>
            <div className={authClasses.overlay}>
                <div className={authClasses.content}>
                    <div className={authClasses.badge}>
                        <IconSparkles size={14}/>
                        <span>Área do Cliente</span>
                    </div>
                    <div className={authClasses.featureGrid}>
                        {features.map((f, i) => {
                            const Icon = f.icon;
                            return (
                                <div key={i} className={authClasses.feature}>
                                    <div className={authClasses.featureIcon}>
                                        <Icon size={18}/>
                                    </div>
                                    <div className={authClasses.featureText}>
                                        <h3>{f.title}</h3>
                                        <p>{f.description}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

const BRAZIL_STATES = [
    {value: 'AC', label: 'AC — Acre'}, {value: 'AL', label: 'AL — Alagoas'},
    {value: 'AP', label: 'AP — Amapá'}, {value: 'AM', label: 'AM — Amazonas'},
    {value: 'BA', label: 'BA — Bahia'}, {value: 'CE', label: 'CE — Ceará'},
    {value: 'DF', label: 'DF — Distrito Federal'}, {value: 'ES', label: 'ES — Espírito Santo'},
    {value: 'GO', label: 'GO — Goiás'}, {value: 'MA', label: 'MA — Maranhão'},
    {value: 'MT', label: 'MT — Mato Grosso'}, {value: 'MS', label: 'MS — Mato Grosso do Sul'},
    {value: 'MG', label: 'MG — Minas Gerais'}, {value: 'PA', label: 'PA — Pará'},
    {value: 'PB', label: 'PB — Paraíba'}, {value: 'PR', label: 'PR — Paraná'},
    {value: 'PE', label: 'PE — Pernambuco'}, {value: 'PI', label: 'PI — Piauí'},
    {value: 'RJ', label: 'RJ — Rio de Janeiro'}, {value: 'RN', label: 'RN — Rio Grande do Norte'},
    {value: 'RS', label: 'RS — Rio Grande do Sul'}, {value: 'RO', label: 'RO — Rondônia'},
    {value: 'RR', label: 'RR — Roraima'}, {value: 'SC', label: 'SC — Santa Catarina'},
    {value: 'SP', label: 'SP — São Paulo'}, {value: 'SE', label: 'SE — Sergipe'},
    {value: 'TO', label: 'TO — Tocantins'},
];

// ─── Customer Auth Page ───────────────────────────────────────────────────────

type Tab = 'login' | 'register';

const CustomerAuth = () => {
    const [tab, setTab] = useState<Tab>('login');
    const navigate = useNavigate();
    const me = useGetMe();

    // Already authenticated → go straight to customer area
    if (me.isSuccess) {
        return <Navigate to="/customer/orders" replace/>;
    }

    return (
        <div style={{display: 'flex', flexDirection: 'column', minHeight: '100vh'}}>
        <div className={authClasses.authLayout} style={{flex: 1}}>
            <div className={authClasses.splitLayout}>
                {/* Left panel */}
                <div className={authClasses.leftPanel}>
                    <main className={authClasses.container}>
                        {/* Logo */}
                        <div className={authClasses.logo}>
                            <img
                                src={getConfig("VITE_APP_LOGO_DARK", "/logos/zenite-tickets-stacked-light.svg")}
                                alt="Logo"
                            />
                        </div>

                        <div className={authClasses.wrapper}>
                            {tab === 'login'
                                ? <CustomerLogin onSwitchTab={() => setTab('register')} onSuccess={() => navigate('/customer/orders')}/>
                                : <CustomerRegister onSwitchTab={() => setTab('login')} onSuccess={() => navigate('/customer/orders')}/>
                            }
                        </div>
                    </main>
                </div>

                {/* Right panel */}
                <FeaturePanel/>
            </div>
        </div>
        <CustomerFooter/>
        </div>
    );
};

// ─── Login form ───────────────────────────────────────────────────────────────

function CustomerLogin({onSwitchTab, onSuccess}: { onSwitchTab: () => void; onSuccess: () => void }) {
    const form = useForm({
        initialValues: {email: '', password: ''},
        validate: {
            email: (v) => (/^\S+@\S+$/.test(v) ? null : 'E-mail inválido'),
            password: (v) => (v.length < 1 ? 'Informe a senha' : null),
        },
    });

    const {mutate: login, isPending} = useMutation({
        mutationFn: (data: LoginData) => authClient.login(data),
        onSuccess: (res: LoginResponse) => {
            if (res.token) onSuccess();
        },
        onError: () => showError('E-mail ou senha incorretos. Tente novamente.'),
    });

    return (
        <>
            <header style={{marginBottom: '1.5rem', textAlign: 'center'}}>
                <h2 style={{margin: '0 0 0.375rem', fontSize: '1.5rem', fontWeight: 700}}>
                    Bem-vindo de volta
                </h2>
                <p style={{margin: 0, fontSize: '0.9rem', color: 'var(--hi-color-gray-dark)'}}>
                    Não tem conta?{' '}
                    <button
                        onClick={onSwitchTab}
                        style={{background: 'none', border: 'none', cursor: 'pointer', color: 'var(--mantine-color-secondary-5)', fontWeight: 600, fontSize: 'inherit'}}
                    >
                        Cadastre-se
                    </button>
                </p>
            </header>

            <div style={{background: '#fff', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,.06), 0 4px 16px rgba(0,0,0,.04)'}}>
                <form onSubmit={form.onSubmit((v) => login(v))}>
                    <TextInput
                        {...form.getInputProps('email')}
                        label="E-mail"
                        placeholder="hello@example.com"
                        required
                    />
                    <PasswordInput
                        {...form.getInputProps('password')}
                        label="Senha"
                        placeholder="Sua senha"
                        required
                        mt="md"
                    />
                    <Button
                        color="secondary.5"
                        type="submit"
                        fullWidth
                        loading={isPending}
                        mt="lg"
                    >
                        {isPending ? 'Entrando...' : 'Fazer login'}
                    </Button>
                </form>
            </div>
        </>
    );
}

// ─── Register form ────────────────────────────────────────────────────────────

function CustomerRegister({onSwitchTab, onSuccess}: { onSwitchTab: () => void; onSuccess: () => void }) {
    const form = useForm({
        initialValues: {
            first_name: '',
            last_name: '',
            email: '',
            password: '',
            password_confirmation: '',
            timezone: typeof window !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : 'UTC',
            locale: getClientLocale(),
            currency_code: getUserCurrency(),
            marketing_opt_in: false,
            city: '',
            state: '',
        },
        validate: {
            email: (v) => (/^\S+@\S+$/.test(v) ? null : 'E-mail inválido'),
            password: (v) => (v.length < 8 ? 'Mínimo 8 caracteres' : null),
            password_confirmation: (v, vals) => (v !== vals.password ? 'As senhas não coincidem' : null),
        },
    });

    // After register → auto-login → redirect to customer area (no wizard)
    const {mutate: login, isPending: loginPending} = useMutation({
        mutationFn: (data: LoginData) => authClient.login(data),
        onSuccess: (res: LoginResponse) => {
            if (res.token) onSuccess();
        },
    });

    const {mutate: register, isPending: registerPending} = useMutation({
        mutationFn: (data: RegisterAccountRequest) => authClient.register(data),
        onSuccess: () => {
            login({email: form.values.email, password: form.values.password});
        },
        onError: () => showError('Não foi possível criar a conta. Verifique os dados e tente novamente.'),
    });

    const isPending = registerPending || loginPending;

    return (
        <>
            <header style={{marginBottom: '1.5rem', textAlign: 'center'}}>
                <h2 style={{margin: '0 0 0.375rem', fontSize: '1.5rem', fontWeight: 700}}>
                    Crie sua conta
                </h2>
                <p style={{margin: 0, fontSize: '0.9rem', color: 'var(--hi-color-gray-dark)'}}>
                    Já tem conta?{' '}
                    <button
                        onClick={onSwitchTab}
                        style={{background: 'none', border: 'none', cursor: 'pointer', color: 'var(--mantine-color-secondary-5)', fontWeight: 600, fontSize: 'inherit'}}
                    >
                        Entrar
                    </button>
                </p>
            </header>

            <div style={{background: '#fff', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,.06), 0 4px 16px rgba(0,0,0,.04)'}}>
                <form onSubmit={form.onSubmit((v) => register(v as RegisterAccountRequest))}>
                    <SimpleGrid cols={{base: 1, sm: 2}} mb="md">
                        <TextInput
                            {...form.getInputProps('first_name')}
                            label="Nome"
                            placeholder="João"
                            required
                        />
                        <TextInput
                            {...form.getInputProps('last_name')}
                            label="Sobrenome"
                            placeholder="Silva"
                        />
                    </SimpleGrid>
                    <TextInput
                        {...form.getInputProps('email')}
                        label="E-mail"
                        placeholder="seu@email.com"
                        required
                        mb="md"
                    />
                    <SimpleGrid cols={{base: 1, sm: 2}} mb="md">
                        <PasswordInput
                            {...form.getInputProps('password')}
                            label="Senha"
                            placeholder="Mínimo 8 caracteres"
                            required
                        />
                        <PasswordInput
                            {...form.getInputProps('password_confirmation')}
                            label="Confirmar senha"
                            placeholder="Repita a senha"
                            required
                        />
                    </SimpleGrid>
                    <SimpleGrid cols={{base: 1, sm: 2}} mb={4}>
                        <TextInput
                            {...form.getInputProps('city')}
                            label="Cidade"
                            placeholder="Ex: Vila Velha"
                        />
                        <Select
                            {...form.getInputProps('state')}
                            label="Estado (UF)"
                            placeholder="Selecione"
                            data={BRAZIL_STATES}
                            searchable
                            clearable
                        />
                    </SimpleGrid>
                    <Text size="xs" c="dimmed" mb="md" mt={-4}>
                        Opcional — para recebermos eventos perto de você
                    </Text>
                    <Checkbox
                        mb="md"
                        {...form.getInputProps('marketing_opt_in', {type: 'checkbox'})}
                        label="Quero receber novidades e ofertas"
                    />
                    <Button
                        color="secondary.5"
                        type="submit"
                        fullWidth
                        loading={isPending}
                    >
                        {registerPending ? 'Criando conta...' : loginPending ? 'Entrando...' : 'Criar conta'}
                    </Button>
                </form>
            </div>
        </>
    );
}

export default CustomerAuth;
