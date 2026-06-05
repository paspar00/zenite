import {NavLink} from "react-router";
import {IconChevronLeft} from "@tabler/icons-react";
import classes from "./MarketplaceHeader.module.scss";

interface MarketplaceHeaderProps {
    showBack?: boolean;
}

export const MarketplaceHeader = ({showBack = false}: MarketplaceHeaderProps) => {
    return (
        <header className={classes.header}>
            <div className={classes.inner}>
                <NavLink to="/" className={classes.logo}>
                    <img src="/logos/zenite-tickets-premium.svg" alt="Zenite Tickets"/>
                </NavLink>

                {showBack && (
                    <NavLink to="/" className={classes.backLink}>
                        <IconChevronLeft size={16}/>
                        Todos os eventos
                    </NavLink>
                )}
            </div>
        </header>
    );
};
