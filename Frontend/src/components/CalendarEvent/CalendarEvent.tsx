import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import styles from "./CalendarEvent.module.scss";
import { useTranslation } from "react-i18next";
import { type CalendarEventType } from "../CalendarContainer/CalendarContainer";

interface CalendarEventProps {
	event: CalendarEventType;
	canEdit: boolean;
	onDelete: (eventId: string) => void;
	onEdit: (eventId: string) => void;
}

const CalendarEvent: React.FC<CalendarEventProps> = ({
	event,
	canEdit,
	onDelete,
	onEdit,
}) => {
	const { t } = useTranslation();
	return (
		<div className={styles.eventWrapper} title={event.title}>
			<span>{event.title}</span>
			{canEdit && (
				<>
					<span
						className={styles.edit}
						title={t("calendar.edit")}
						tabIndex={0}
						onClick={(e) => {
							e.stopPropagation();
							onEdit(event.id);
						}}
						onKeyDown={(e) => {
							if (e.key === "Enter" || e.key === " ")
								onEdit(event.id);
						}}
					>
						<FaEdit />
					</span>
					<span
						className={styles.trash}
						title={t("calendar.delete")}
						tabIndex={0}
						onClick={(e) => {
							e.stopPropagation();
							onDelete(event.id);
						}}
						onKeyDown={(e) => {
							if (e.key === "Enter" || e.key === " ")
								onDelete(event.id);
						}}
					>
						<FaTrash />
					</span>
				</>
			)}
		</div>
	);
};

export default CalendarEvent;
