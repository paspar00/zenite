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
                    <span className={classes.logoMark} aria-hidden="true">
                        <span/>
                    </span>
                    <span className={classes.logoText}>
                        <strong>Zenite</strong>
                        <small>Tickets</small>
                    </span>
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
