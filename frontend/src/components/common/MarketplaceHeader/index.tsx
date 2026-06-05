import {NavLink} from "react-router";
import {IconChevronLeft, IconTicket} from "@tabler/icons-react";
import classes from "./MarketplaceHeader.module.scss";

interface MarketplaceHeaderProps {
    showBack?: boolean;
}

export const MarketplaceHeader = ({showBack = false}: MarketplaceHeaderProps) => {
    return (
        <header className={classes.header}>
            <div className={classes.inner}>
                <NavLink to="/" className={classes.logo}>
                    <IconTicket size={26} color="#fff"/>
                    <span>Zenite Tickets</span>
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
