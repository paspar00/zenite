import {LanguageSwitcher} from "../LanguageSwitcher";
import classes from "./CustomerFooter.module.scss";

export const CustomerFooter = () => {
    return (
        <footer className={classes.footer}>
            <div className={classes.inner}>
                <span className={classes.brand}>
                    Desenvolvido por{" "}
                    <a
                        href="https://formulaonline.space"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={classes.brandLink}
                    >
                        Formula Online
                    </a>
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
