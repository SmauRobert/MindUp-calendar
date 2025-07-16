import React from "react";
import styles from "./CalendarLegend.module.scss";
import { useTranslation } from "react-i18next";

const CalendarLegend: React.FC = () => {
	const { t } = useTranslation();
	return (
		<div className={styles.legend}>
			<span className={styles.colorBox} />
			<span>{t("calendar.legendAvailable")}</span>
		</div>
	);
};

export default CalendarLegend;
