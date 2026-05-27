import {useEffect, useState} from "react";
import {useParams} from "react-router";
import {publicApi} from "../../../api/public-client.ts";
import {CustomerFooter} from "../../common/CustomerFooter";
import {IconTicket, IconMailOff, IconCircleCheck, IconAlertCircle} from "@tabler/icons-react";
import {NavLink} from "react-router";

type Status = 'loading' | 'success' | 'already' | 'invalid' | 'error';

export default function Unsubscribe() {
    const {emailEncoded, token} = useParams<{emailEncoded: string; token: string}>();
    const [status, setStatus] = useState<Status>('loading');

    useEffect(() => {
        if (!emailEncoded || !token) {
            setStatus('invalid');
            return;
        }
        publicApi.get(`/unsubscribe/${emailEncoded}/${token}`)
            .then((res: any) => {
                const already = res?.data?.data?.already_suppressed;
                setStatus(already ? 'already' : 'success');
            })
            .catch((err: any) => {
                const code = err?.response?.status;
                if (code === 422 || code === 400) {
                    setStatus('invalid');
                } else {
                    setStatus('error');
                }
            });
    }, [emailEncoded, token]);

    const content: Record<Status, {icon: React.ReactNode; title: string; body: string}> = {
        loading: {
            icon: <IconMailOff size={56} color="#0047cc" />,
            title: 'Processando…',
            body: 'Aguarde enquanto confirmamos seu cancelamento.',
        },
        success: {
            icon: <IconCircleCheck size={56} color="#2ecc71" />,
            title: 'Descadastro confirmado',
            body: 'Você não receberá mais e-mails de marketing. E-mails transacionais (confirmação de compra, ingressos) continuarão sendo enviados normalmente.',
        },
        already: {
            icon: <IconCircleCheck size={56} color="#aaa" />,
            title: 'Você já estava descadastrado',
            body: 'Seu e-mail já consta em nossa lista de supressão. Não há nada mais a fazer.',
        },
        invalid: {
            icon: <IconAlertCircle size={56} color="#e74c3c" />,
            title: 'Link inválido ou expirado',
            body: 'Este link de descadastro não é válido ou expirou. Se você deseja se descadastrar, clique no link presente no e-mail mais recente que recebeu.',
        },
        error: {
            icon: <IconAlertCircle size={56} color="#e74c3c" />,
            title: 'Erro ao processar',
            body: 'Não foi possível processar seu pedido agora. Tente novamente mais tarde ou entre em contato com o suporte.',
        },
    };

    const {icon, title, body} = content[status];

    return (
        <div style={{display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#f7f9ff'}}>
            <header style={{background: 'linear-gradient(135deg,#0047cc 0%,#1a1a2e 100%)', padding: '0 24px'}}>
                <div style={{maxWidth: 1100, margin: '0 auto', height: 60, display: 'flex', alignItems: 'center'}}>
                    <NavLink to="/" style={{display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: '#fff', fontWeight: 700, fontSize: '1.1rem'}}>
                        <IconTicket size={26} />
                        <span>TicketHub</span>
                    </NavLink>
                </div>
            </header>

            <main style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px'}}>
                <div style={{
                    background: '#fff',
                    borderRadius: 20,
                    boxShadow: '0 4px 32px rgba(0,71,204,0.08)',
                    padding: '48px 40px',
                    maxWidth: 480,
                    width: '100%',
                    textAlign: 'center',
                }}>
                    <div style={{marginBottom: 20}}>{icon}</div>
                    <h1 style={{margin: '0 0 12px', fontSize: '1.4rem', fontWeight: 700, color: '#1a1a2e'}}>{title}</h1>
                    <p style={{margin: '0 0 28px', fontSize: '0.95rem', color: '#555', lineHeight: 1.6}}>{body}</p>
                    <NavLink to="/" style={{
                        display: 'inline-block',
                        background: '#0047cc',
                        color: '#fff',
                        borderRadius: 8,
                        padding: '10px 28px',
                        textDecoration: 'none',
                        fontWeight: 600,
                        fontSize: '0.9rem',
                    }}>
                        Voltar ao início
                    </NavLink>
                </div>
            </main>

            <CustomerFooter />
        </div>
    );
}
