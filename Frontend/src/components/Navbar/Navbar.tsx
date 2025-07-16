import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useLocation } from "react-router";
import LanguagePicker from "../LanguagePicker/LanguagePicker";
import { FaRegCalendarAlt, FaBars } from "react-icons/fa";
import styles from "./Navbar.module.scss";

export default function Navbar() {
	const { user, logout } = useAuth();
	const { t } = useTranslation();
	const navigate = useNavigate();
	const location = useLocation();
	const [mobileOpen, setMobileOpen] = useState(false);

	// Hide on login/check-email pages
	if (location.pathname === "/login" || location.pathname === "/check-email")
		return null;

	// Mobile responsive nav links
	const NavLinks = () => {
		if (!user) return null;
		// Default user
		if (user.role === "DEFAULT") {
			return (
				<>
					<Link to={`/calendar/${user.uid}`}>
						{t("nav.calendar")}
					</Link>
					<Link to="/request-form">{t("nav.requestForm")}</Link>
					<Link to={`/profile/${user.uid}`}>{t("nav.profile")}</Link>
				</>
			);
		}
		// Admin
		if (user.role === "ADMIN") {
			return (
				<>
					<Link to="/administration">{t("nav.admin")}</Link>
				</>
			);
		}
		// Superadmin
		if (user.role === "SUPERADMIN") {
			return (
				<>
					<Link to="/administration">{t("nav.admin")}</Link>
					<Link to="/new-admin">{t("nav.newAdmin")}</Link>
				</>
			);
		}
		return null;
	};

	return (
		<nav className={styles.navbar}>
			<div className={styles.left}>
				<FaRegCalendarAlt size={24} className={styles.icon} />
				<span className={styles.title}>Calendar App</span>
			</div>
			{user && (
				<>
					<div className={styles.desktopLinks}>
						<NavLinks />
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
					{/* Mobile nav button */}
					<button
						className={styles.mobileMenuButton}
						aria-label="Open navigation menu"
						onClick={() => setMobileOpen((open) => !open)}
					>
						<FaBars />
					</button>
					{/* Mobile nav drawer */}
					<div
						className={`${styles.mobileDrawer} ${
							mobileOpen ? styles.open : ""
						}`}
						onClick={() => setMobileOpen(false)}
					>
						<div className={styles.mobileLinks}>
							<NavLinks />
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
					</div>
				</>
			)}
		</nav>
	);
}
