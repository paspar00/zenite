import {LanguageSwitcher} from "../LanguageSwitcher";
import classes from "./CustomerFooter.module.scss";

export const CustomerFooter = () => {
    return (
        <footer className={classes.footer}>
            <div className={classes.inner}>
                <span className={classes.brand}>
                    <strong className={classes.brandName}>Orbita</strong> Sports
                </span>

                <span className={classes.copy}>
                    © {new Date().getFullYear()} · Todos os direitos reservados
                </span>

                <div className={classes.lang}>
                    <LanguageSwitcher/>
                </div>
            </div>
        </footer>
    );
};
