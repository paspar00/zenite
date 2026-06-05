import {Container} from '@mantine/core';
import classes from './Header.module.scss';
import {NavLink} from "react-router";

interface HeaderProps {
    rightContent?: React.ReactNode;
    fullWidth?: boolean;
    logoTarget?: string;
}

export const Header = ({rightContent, fullWidth = false, logoTarget = '/manage/events'}: HeaderProps) => {
    return (
        <header className={classes.header}>
            <Container size="md" className={classes.inner} fluid={fullWidth}>
                <NavLink className={classes.logo} to={logoTarget} aria-label="Zenite Tickets">
                    <span className={classes.logoMark} aria-hidden="true">
                        <span />
                    </span>
                    <span className={classes.logoText}>
                        <strong>Zenite</strong>
                        <small>Tickets</small>
                    </span>
                </NavLink>

                <div className={classes.rightContent}>
                    {rightContent}
                </div>
            </Container>
        </header>
    );
}
