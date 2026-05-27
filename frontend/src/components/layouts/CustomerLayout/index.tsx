import {Button, Container} from "@mantine/core";
import {NavLink, Outlet} from "react-router";
import {Header} from "../../common/Header";
import {authClient} from "../../../api/auth.client.ts";
import {CustomerFooter} from "../../common/CustomerFooter";
import classes from "./CustomerLayout.module.scss";

const CustomerLayout = () => {
    return (
        <div className={classes.page}>
            <Header
                logoTarget="/"
                rightContent={(
                    <div className={classes.actions}>
                        <NavLink to="/" className={classes.link}>
                            Inicio
                        </NavLink>
                        <NavLink to="/customer/profile" className={classes.link}>
                            Meu Perfil
                        </NavLink>
                        <Button
                            variant="white"
                            color="dark"
                            size="xs"
                            onClick={async () => {
                                await authClient.logout();
                                localStorage.removeItem("token");
                                window.location.href = "/customer/auth";
                            }}
                        >
                            Sair
                        </Button>
                    </div>
                )}
            />
            <Container className={classes.content}>
                <Outlet/>
            </Container>
            <CustomerFooter/>
        </div>
    );
};

export default CustomerLayout;
