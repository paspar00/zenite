import {NavLink} from "react-router";
import {IconArrowLeft, IconCalendarEvent, IconMapPin, IconTicket} from "@tabler/icons-react";
import {CustomerFooter} from "../../common/CustomerFooter";
import classes from "./MeiaMaratonaVilaVelha.module.scss";

export default function MeiaMaratonaVilaVelha() {
    return (
        <div className={classes.page}>
            <header className={classes.header}>
                <NavLink to="/" className={classes.backLink}>
                    <IconArrowLeft size={18}/>
                    Voltar para eventos
                </NavLink>
                <img
                    className={classes.brand}
                    src="/logos/zenite-tickets-text-light.svg"
                    alt="Zenite Tickets"
                />
            </header>

            <main className={classes.hero}>
                <div className={classes.media}>
                    <img
                        src="/images/meia-maratona-vila-velha-3-logo.svg"
                        alt="Meia Maratona de Vila Velha 3ª edição"
                    />
                </div>

                <section className={classes.content}>
                    <span className={classes.badge}>3ª edição</span>
                    <h1>Meia Maratona de Vila Velha</h1>
                    <p className={classes.lead}>
                        A próxima edição está sendo preparada. Em breve abriremos a data,
                        percurso, lotes e inscrições oficiais.
                    </p>

                    <div className={classes.infoGrid}>
                        <div className={classes.infoItem}>
                            <IconCalendarEvent size={22}/>
                            <div>
                                <strong>Previsão</strong>
                                <span>Data a ser liberada</span>
                            </div>
                        </div>
                        <div className={classes.infoItem}>
                            <IconMapPin size={22}/>
                            <div>
                                <strong>Local</strong>
                                <span>Vila Velha, ES</span>
                            </div>
                        </div>
                        <div className={classes.infoItem}>
                            <IconTicket size={22}/>
                            <div>
                                <strong>Inscrições</strong>
                                <span>Em breve</span>
                            </div>
                        </div>
                    </div>

                    <div className={classes.notice}>
                        <strong>Evento em preparação</strong>
                        <span>Esta é uma página provisória da Zenite Tickets para abertura do site.</span>
                    </div>
                </section>
            </main>

            <CustomerFooter/>
        </div>
    );
}
