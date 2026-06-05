import {NavLink} from "react-router";
import {IconArrowLeft, IconCalendarEvent, IconFlag, IconMapPin, IconRoute, IconTicket} from "@tabler/icons-react";
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
                        A página oficial da 3ª edição já está no ar. A organização está finalizando data,
                        percurso, lotes e abertura das inscrições pela Zenite Tickets.
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
                            <IconRoute size={22}/>
                            <div>
                                <strong>Modalidade</strong>
                                <span>Meia maratona urbana</span>
                            </div>
                        </div>
                        <div className={classes.infoItem}>
                            <IconTicket size={22}/>
                            <div>
                                <strong>Inscrições</strong>
                                <span>Abertura oficial em breve</span>
                            </div>
                        </div>
                        <div className={classes.infoItem}>
                            <IconFlag size={22}/>
                            <div>
                                <strong>Organização</strong>
                                <span>Publicação oficial Zenite Tickets</span>
                            </div>
                        </div>
                    </div>

                    <div className={classes.notice}>
                        <strong>Pré-lançamento oficial</strong>
                        <span>Os detalhes finais serão publicados aqui antes da abertura das inscrições.</span>
                    </div>
                </section>
            </main>

            <CustomerFooter/>
        </div>
    );
}
