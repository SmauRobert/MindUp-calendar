import { useTranslation } from "react-i18next";
import roFlag from "../../assets/ro-flag.svg";
import gbFlag from "../../assets/gb-flag.svg";
import styles from "./LanguagePicker.module.scss";

export default function LanguagePicker() {
	const { i18n } = useTranslation();
	const handleChange = (lang: string) => {
		i18n.changeLanguage(lang);
		// You can call backend endpoint to persist language if needed
	};
	return (
		<div className={styles.picker}>
			<button
				className={i18n.language === "en" ? styles.active : ""}
				onClick={() => handleChange("en")}
				aria-label="Switch to English"
			>
				<img src={gbFlag} alt="EN" />
			</button>
			<button
				className={i18n.language === "ro" ? styles.active : ""}
				onClick={() => handleChange("ro")}
				aria-label="Schimbă la Română"
			>
				<img src={roFlag} alt="RO" />
			</button>
		</div>
	);
}
