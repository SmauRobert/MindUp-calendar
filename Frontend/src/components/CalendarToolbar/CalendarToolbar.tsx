import React from "react";
import styles from "./CalendarToolbar.module.scss";
import { useTranslation } from "react-i18next";
import type { View, NavigateAction } from "react-big-calendar";

interface CalendarToolbarProps {
	label: string;
	onNavigate: (action: NavigateAction, newDate?: Date) => void;
	onView: (view: View) => void;
	setView: (view: View) => void;
	view: View;
	views: Record<string, any>;
	date: Date;
}

const CalendarToolbar: React.FC<CalendarToolbarProps> = ({
	label,
	onNavigate,
	onView,
	setView,
	view,
	views,
}) => {
	const { t } = useTranslation();
	return (
		<div className={styles.toolbar}>
			<div className={styles.left}>
				<button onClick={() => onNavigate("TODAY")}>
					{t("calendar.today")}
				</button>
				<button onClick={() => onNavigate("PREV")}>
					{t("calendar.previous")}
				</button>
				<button onClick={() => onNavigate("NEXT")}>
					{t("calendar.next")}
				</button>
			</div>
			<span className={styles.label}>{label}</span>
			<div className={styles.right}>
				{Array.isArray(views)
					? views.map((v) => (
							<button
								key={v}
								onClick={() => {
									onView(v as View);
									setView(v as View);
								}}
								className={view === v ? styles.active : ""}
							>
								{t(`calendar.${v}`)}
							</button>
					  ))
					: Object.keys(views).map((v) => (
							<button
								key={v}
								onClick={() => {
									onView(v as View);
									setView(v as View);
								}}
								className={view === v ? styles.active : ""}
							>
								{t(`calendar.${v}`)}
							</button>
					  ))}
			</div>
		</div>
	);
};

export default CalendarToolbar;
