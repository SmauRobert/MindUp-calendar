import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useLocation } from "react-router";
import LanguagePicker from "../LanguagePicker/LanguagePicker";
import { FaRegCalendarAlt } from "react-icons/fa";

import styles from "./Navbar.module.scss";

export default function Navbar() {
	const { user, logout } = useAuth();
	const { t } = useTranslation();
	const navigate = useNavigate();
	const location = useLocation();

	if (location.pathname === "/login" || location.pathname === "/check-email")
		return null;

	return (
		<nav className={styles.navbar}>
			<div className={styles.left}>
				<FaRegCalendarAlt size={24} className={styles.icon} />
				<span className={styles.title}>{t("nav.calendar")}</span>
			</div>
			{user && (
				<div className={styles.right}>
					<Link to="/">{t("nav.calendar")}</Link>
					<Link to="/request-form">{t("nav.requestForm")}</Link>
					<Link to="/profile">{t("nav.profile")}</Link>
					{(user.role === "ADMIN" || user.role === "SUPERADMIN") && (
						<Link to="/administration">{t("nav.admin")}</Link>
					)}
					{user.role === "SUPERADMIN" && (
						<Link to="/new-admin">{t("nav.newAdmin")}</Link>
					)}
					<LanguagePicker />
					<button
						className={styles.logout}
						onClick={async () => {
							await logout();
							navigate("/login");
						}}
					>
						{t("nav.logout")}
					</button>
				</div>
			)}
		</nav>
	);
}
