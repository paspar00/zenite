import {Container} from '@mantine/core';
import classes from './Header.module.scss';
import {NavLink} from "react-router";
import { getConfig } from '../../../utilites/config';

interface HeaderProps {
    rightContent?: React.ReactNode;
    fullWidth?: boolean;
    logoTarget?: string;
}

export const Header = ({rightContent, fullWidth = false, logoTarget = '/manage/events'}: HeaderProps) => {
    return (
        <header className={classes.header}>
            <Container size="md" className={classes.inner} fluid={fullWidth}>
                <NavLink className={classes.logo} to={logoTarget}>
                    <img src={getConfig("VITE_APP_LOGO_LIGHT", "/logos/zenite-tickets-text-dark.svg")} alt={`${getConfig("VITE_APP_NAME", "Zenite Tickets")} logo`} className={classes.logo}/>
                </NavLink>

                <div className={classes.rightContent}>
                    {rightContent}
                </div>
            </Container>
        </header>
    );
}
