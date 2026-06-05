import {useRef, useEffect, useState} from "react";
import {NavLink} from "react-router";
import {CustomerFooter} from "../../common/CustomerFooter";
import {
    IconBrandWhatsapp,
    IconMail,
    IconMenu2,
    IconClock,
    IconMessageCircle,
    IconHelp,
    IconChevronDown,
} from "@tabler/icons-react";
import classes from "./Atendimento.module.scss";

// FAQ

const faqs = [
    {
        q: "Como acesso meus ingressos?",
        a: 'Acesse a Área do Cliente com o e-mail e senha cadastrados. Seus ingressos aparecem na aba "Meus Ingressos".',
    },
    {
        q: "Não lembro o e-mail cadastrado, e agora?",
        a: 'Na tela de login do cliente, use a opção "Só quer ver seus ingressos?" e insira o e-mail usado na compra. Enviaremos um link de acesso direto.',
    },
    {
        q: "Posso cancelar meu ingresso?",
        a: "A política de cancelamento varia por evento. Entre em contato com o organizador diretamente ou acione nosso atendimento.",
    },
    {
        q: "O pagamento foi confirmado mas não recebi o ingresso?",
        a: "Verifique sua caixa de spam. Se ainda assim não encontrar, acesse a Área do Cliente ou entre em contato com o suporte.",
    },
    {
        q: "Como faço para emitir nota fiscal?",
        a: "A emissão de nota fiscal é responsabilidade do organizador do evento. Solicite diretamente a ele pelo e-mail de confirmação.",
    },
];

function FaqItem({q, a}: { q: string; a: string }) {
    const [open, setOpen] = useState(false);
    return (
        <div className={`${classes.faqItem} ${open ? classes.faqOpen : ""}`}>
            <button className={classes.faqQuestion} onClick={() => setOpen((v) => !v)}>
                <span>{q}</span>
                <IconChevronDown size={18} className={classes.faqChevron}/>
            </button>
            {open && <p className={classes.faqAnswer}>{a}</p>}
        </div>
    );
}

// Page

export default function Atendimento() {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!menuOpen) return;
        const handler = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [menuOpen]);

    return (
        <div className={classes.page}>
            {/* Header igual ao marketplace */}
            <header className={classes.header}>
                <div className={classes.headerInner}>
                    <NavLink to="/" className={classes.logo}>
                        <span className={classes.logoMark} aria-hidden="true">
                            <span/>
                        </span>
                        <span className={classes.logoText}>
                            <strong>Zenite</strong>
                            <small>Tickets</small>
                        </span>
                    </NavLink>
                    <nav className={classes.nav}>
                        <NavLink to="/" className={classes.navLink}>Eventos</NavLink>
                        <NavLink to="/atendimento" className={classes.navLink}>Atendimento</NavLink>
                    </nav>
                    <div className={classes.headerActions}>
                        <NavLink to="/customer/auth" className={classes.btnPrimary}>Área do cliente</NavLink>
                        <div className={classes.menuWrapper} ref={menuRef}>
                            <button
                                className={classes.menuBtn}
                                onClick={() => setMenuOpen((v) => !v)}
                                aria-label="Menu"
                            >
                                <IconMenu2 size={20}/>
                            </button>
                            {menuOpen && (
                                <div className={classes.dropdown}>
                                    <NavLink to="/auth/login" className={classes.dropdownItem} onClick={() => setMenuOpen(false)}>
                                        Login organizador
                                    </NavLink>
                                    <NavLink to="/auth/register" className={classes.dropdownItem} onClick={() => setMenuOpen(false)}>
                                        Crie seu evento
                                    </NavLink>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero */}
            <section className={classes.hero}>
                <div className={classes.heroInner}>
                    <IconMessageCircle size={48} color="rgba(255,255,255,0.9)" style={{marginBottom: 12}}/>
                    <h1 className={classes.heroTitle}>Como podemos ajudar?</h1>
                    <p className={classes.heroSubtitle}>
                        Estamos aqui para tornar sua experiência a melhor possível.
                    </p>
                </div>
            </section>

            <div className={classes.container}>
                {/* Contact cards */}
                <section className={classes.section}>
                    <h2 className={classes.sectionTitle}>Fale conosco</h2>
                    <div className={classes.contactGrid}>
                        <a
                            href="https://wa.me/5527998049096"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={classes.contactCard}
                        >
                            <div className={classes.contactIcon} style={{background: "#25d366"}}>
                                <IconBrandWhatsapp size={28} color="#fff"/>
                            </div>
                            <h3>William</h3>
                            <p>+55 27 99804-9096</p>
                            <span className={classes.contactCta}>Abrir conversa →</span>
                        </a>

                        <a
                            href="mailto:contato@formulaonline.space"
                            className={classes.contactCard}
                        >
                            <div className={classes.contactIcon} style={{background: "#ff6b00"}}>
                                <IconMail size={28} color="#fff"/>
                            </div>
                            <h3>E-mail</h3>
                            <p>Respondemos em até 24h úteis</p>
                            <span className={classes.contactCta}>Enviar e-mail →</span>
                        </a>

                        <div className={classes.contactCard} style={{cursor: "default"}}>
                            <div className={classes.contactIcon} style={{background: "#7b2ff7"}}>
                                <IconClock size={28} color="#fff"/>
                            </div>
                            <h3>Horário de atendimento</h3>
                            <p>Segunda a sexta, das 9h às 18h</p>
                            <span className={classes.contactCta} style={{color: "#888"}}>Horário de Brasília</span>
                        </div>
                    </div>
                </section>

                {/* FAQ */}
                <section className={classes.section}>
                    <h2 className={classes.sectionTitle}>
                        <IconHelp size={22} style={{verticalAlign: "middle", marginRight: 8}}/>
                        Perguntas frequentes
                    </h2>
                    <div className={classes.faqList}>
                        {faqs.map((item, i) => (
                            <FaqItem key={i} q={item.q} a={item.a}/>
                        ))}
                    </div>
                </section>
            </div>

            <CustomerFooter/>
        </div>
    );
}
