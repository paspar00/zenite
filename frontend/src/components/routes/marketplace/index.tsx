import {useState, useRef, useEffect} from "react";
import {NavLink} from "react-router";
import {useGetPublicEvents} from "../../../queries/useGetPublicEvents.ts";
import {Event} from "../../../types.ts";
import {eventHomepagePath} from "../../../utilites/urlHelper.ts";
import {formatDateWithLocale} from "../../../utilites/dates.ts";
import {CustomerFooter} from "../../common/CustomerFooter";
import classes from "./Marketplace.module.scss";
import {
    IconCalendar,
    IconChevronRight,
    IconCreditCard,
    IconMapPin,
    IconMenu2,
    IconQrcode,
    IconSearch,
    IconTicket,
} from "@tabler/icons-react";

const vilaVelhaEvent = {
    title: "Meia Maratona de Vila Velha 3ª edição",
    location: "Vila Velha, ES",
    date: "Data a ser liberada",
    status: "Pré-lançamento oficial",
    description: "Percurso, kit atleta e abertura de inscrições serão anunciados pela Zenite Tickets.",
    url: "/meia-maratona-vila-velha-3-edicao",
    image: "/images/meia-maratona-vila-velha-3-logo.svg",
};

const placeholderGradients = [
    'linear-gradient(135deg, #1a73e8 0%, #0d47a1 100%)',
    'linear-gradient(135deg, #e91e63 0%, #880e4f 100%)',
    'linear-gradient(135deg, #ff6d00 0%, #e65100 100%)',
    'linear-gradient(135deg, #00897b 0%, #004d40 100%)',
    'linear-gradient(135deg, #7b1fa2 0%, #4a148c 100%)',
    'linear-gradient(135deg, #c62828 0%, #b71c1c 100%)',
];

function PublicEventCard({event}: { event: Event }) {
    const coverImage = event.images?.find(img => img.type === 'EVENT_COVER');
    const gradient = placeholderGradients[Number(event.id) % placeholderGradients.length];

    const locationDetails = event.location_details ?? event.settings?.location_details;
    const city = locationDetails?.city;
    const state = locationDetails?.state_or_region;
    const location = event.settings?.is_online_event
        ? 'Online'
        : [city, state].filter(Boolean).join(', ') || null;

    const startDate = event.start_date
        ? formatDateWithLocale(event.start_date, 'shortDate', event.timezone ?? 'UTC')
        : null;
    const endDate = event.end_date
        ? formatDateWithLocale(event.end_date, 'shortDate', event.timezone ?? 'UTC')
        : null;

    return (
        <NavLink to={eventHomepagePath(event)} className={classes.eventCard}>
            <div
                className={classes.eventCardImage}
                style={coverImage
                    ? {backgroundImage: `url(${coverImage.url})`}
                    : {background: gradient}
                }
            />
            <div className={classes.eventCardBody}>
                <h3 className={classes.eventCardTitle}>{event.title}</h3>
                {location && (
                    <p className={classes.eventCardMeta}>
                        <IconMapPin size={13}/> {location}
                    </p>
                )}
                {startDate && (
                    <p className={classes.eventCardMeta}>
                        <IconCalendar size={13}/> {startDate}{endDate && endDate !== startDate ? ` – ${endDate}` : ''}
                    </p>
                )}
            </div>
        </NavLink>
    );
}

function FeaturedEventCard({event}: { event: Event }) {
    const coverImage = event.images?.find(img => img.type === 'EVENT_COVER');
    const gradient = placeholderGradients[Number(event.id) % placeholderGradients.length];

    const locationDetails = event.location_details ?? event.settings?.location_details;
    const city = locationDetails?.city;
    const state = locationDetails?.state_or_region;
    const location = event.settings?.is_online_event
        ? 'Online'
        : [city, state].filter(Boolean).join(', ') || null;

    const startDate = event.start_date
        ? formatDateWithLocale(event.start_date, 'shortDate', event.timezone ?? 'UTC')
        : null;

    return (
        <NavLink to={eventHomepagePath(event)} className={classes.featuredCard}>
            <div
                className={classes.featuredCardBg}
                style={coverImage
                    ? {backgroundImage: `url(${coverImage.url})`}
                    : {background: gradient}
                }
            />
            <div className={classes.featuredCardOverlay}/>
            <div className={classes.featuredCardContent}>
                <h3 className={classes.featuredCardTitle}>{event.title}</h3>
                {location && <p className={classes.featuredCardMeta}>{location}</p>}
                {startDate && <p className={classes.featuredCardMeta}>{startDate}</p>}
            </div>
        </NavLink>
    );
}

function ComingSoonEventCard() {
    return (
        <NavLink to={vilaVelhaEvent.url} className={classes.comingSoonCard}>
            <div
                className={classes.comingSoonImage}
                style={{backgroundImage: `url(${vilaVelhaEvent.image})`}}
            />
            <div className={classes.comingSoonBody}>
                <span className={classes.comingSoonBadge}>{vilaVelhaEvent.status}</span>
                <h3>{vilaVelhaEvent.title}</h3>
                <span className={classes.comingSoonText}>{vilaVelhaEvent.description}</span>
                <p><IconMapPin size={14}/> {vilaVelhaEvent.location}</p>
                <p><IconCalendar size={14}/> {vilaVelhaEvent.date}</p>
                <span className={classes.comingSoonAction}>
                    Ver detalhes do evento <IconChevronRight size={16}/>
                </span>
            </div>
        </NavLink>
    );
}

export default function Marketplace() {
    const [search, setSearch] = useState('');
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const {data, isLoading} = useGetPublicEvents({per_page: 50});

    useEffect(() => {
        if (!menuOpen) return;
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [menuOpen]);

    const events: Event[] = data?.data ?? [];

    const searchMatchesVilaVelha = search.trim()
        ? `${vilaVelhaEvent.title} ${vilaVelhaEvent.location} ${vilaVelhaEvent.date}`
            .toLowerCase()
            .includes(search.toLowerCase())
        : true;

    const filtered = search.trim()
        ? events.filter(e => {
            const s = search.toLowerCase();
            const loc = e.location_details ?? e.settings?.location_details;
            return e.title.toLowerCase().includes(s) ||
                loc?.city?.toLowerCase().includes(s);
        })
        : events;

    const featured = events.slice(0, 4);
    const listing = filtered;

    return (
        <div className={classes.page}>
            {/* Header */}
            <header className={classes.header}>
                <div className={classes.headerInner}>
                    <NavLink to="/" className={classes.logo}>
                        <IconTicket size={28} color="#fff"/>
                        <span>Zenite Tickets</span>
                    </NavLink>
                    <nav className={classes.nav}>
                        <a
                            href="#eventos"
                            className={classes.navLink}
                            onClick={(e) => {
                                e.preventDefault();
                                document.getElementById('eventos')?.scrollIntoView({behavior: 'smooth'});
                            }}
                        >
                            Eventos
                        </a>
                        <NavLink to="/atendimento" className={classes.navLink}>Atendimento</NavLink>
                    </nav>
                    <div className={classes.headerActions}>
                        <NavLink to="/customer/auth" className={classes.btnPrimary}>Area do cliente</NavLink>
                        <div className={classes.menuWrapper} ref={menuRef}>
                            <button
                                className={classes.menuBtn}
                                onClick={() => setMenuOpen(v => !v)}
                                aria-label="Menu"
                            >
                                <IconMenu2 size={20}/>
                            </button>
                            {menuOpen && (
                                <div className={classes.dropdown}>
                                    <NavLink
                                        to="/auth/login"
                                        className={classes.dropdownItem}
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        Login organizador
                                    </NavLink>
                                    <NavLink
                                        to="/auth/register"
                                        className={classes.dropdownItem}
                                        onClick={() => setMenuOpen(false)}
                                    >
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
                    <h1 className={classes.heroTitle}>Zenite Tickets</h1>
                    <p className={classes.heroSubtitle}>
                        Plataforma oficial para descobrir eventos e comprar inscrições com segurança, Pix e cartão.
                    </p>
                    <div className={classes.searchBar}>
                        <IconSearch size={20} className={classes.searchIcon}/>
                        <input
                            className={classes.searchInput}
                            placeholder="Pesquise pelo nome do evento, cidade ou estado..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    <div className={classes.paymentMethods}>
                        <span className={classes.paymentLabel}>Formas de pagamento</span>
                        <span className={classes.paymentItem}><IconCreditCard size={16}/> Cartão</span>
                        <span className={classes.paymentItem}><IconQrcode size={16}/> Via Pix</span>
                    </div>
                </div>
            </section>

            <div className={classes.container}>
                <section className={classes.section}>
                    <div className={classes.spotlightHeader}>
                        <div>
                            <span className={classes.eyebrow}>Destaque oficial</span>
                            <h2 className={classes.sectionTitle}>Próximo lançamento</h2>
                        </div>
                        <NavLink to={vilaVelhaEvent.url} className={classes.detailsLink}>
                            Ver detalhes <IconChevronRight size={16}/>
                        </NavLink>
                    </div>
                    {searchMatchesVilaVelha && <ComingSoonEventCard/>}
                </section>

                {/* Featured */}
                {featured.length > 0 && (
                    <section className={classes.section}>
                        <h2 className={classes.sectionTitle}>Em alta!</h2>
                        <div className={classes.featuredGrid}>
                            {featured.map(event => (
                                <FeaturedEventCard key={event.id} event={event}/>
                            ))}
                        </div>
                    </section>
                )}

                {/* All Events */}
                <section id="eventos" className={classes.section}>
                    <h2 className={classes.sectionTitle}>
                        {search ? `Resultados para "${search}"` : 'Todos os eventos'}
                    </h2>

                    {isLoading && (
                        <div className={classes.loadingGrid}>
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className={classes.skeleton}/>
                            ))}
                        </div>
                    )}

                    {!isLoading && listing.length === 0 && (
                        <div className={classes.empty}>
                            <IconTicket size={48} opacity={0.3}/>
                            <p>Nenhum evento encontrado.</p>
                        </div>
                    )}

                    {!isLoading && listing.length > 0 && (
                        <div className={classes.eventsGrid}>
                            {listing.map(event => (
                                <PublicEventCard key={event.id} event={event}/>
                            ))}
                        </div>
                    )}
                </section>
            </div>

            {/* Footer */}
            <CustomerFooter/>
        </div>
    );
}
