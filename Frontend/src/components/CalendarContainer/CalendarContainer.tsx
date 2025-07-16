import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axiosInstance";
import {
	Calendar,
	dateFnsLocalizer,
	type SlotInfo,
	type View,
} from "react-big-calendar";
import { parse, format, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale/en-US";
import { ro } from "date-fns/locale/ro";
import CalendarEvent from "../CalendarEvent/CalendarEvent";
import CalendarToolbar from "../CalendarToolbar/CalendarToolbar";
import CalendarLegend from "../CalendarLegend/CalendarLegend";
import styles from "./CalendarContainer.module.scss";
import { useTranslation } from "react-i18next";

const locales = {
	"en-US": enUS,
	ro: ro,
};
const localizer = dateFnsLocalizer({
	format,
	parse,
	startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
	getDay,
	locales,
});

export type Interval = {
	id: string;
	start: string;
	end: string;
	label?: string;
};

export type CalendarEventType = {
	id: string;
	title: string;
	start: Date;
	end: Date;
	allDay?: boolean;
};

export default function CalendarContainer() {
	const { t } = useTranslation();
	const { uid } = useParams();
	const { user } = useAuth();
	const [_, setIntervals] = useState<Interval[]>([]);
	const [editingIntervals, setEditingIntervals] = useState<Interval[]>([]);
	const [loading, setLoading] = useState(true);
	const [view, setView] = useState<View>("week");
	const [date, setDate] = useState<Date>(new Date());
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [saving, setSaving] = useState(false);
	const [modalOpen, setModalOpen] = useState(false);
	const [modalIntervalId, setModalIntervalId] = useState<string | null>(null);

	const canEdit = !!(
		user &&
		uid &&
		user.uid === uid &&
		user.role === "DEFAULT"
	);

	const currentEditingInterval = editingIntervals.find(
		(i) => i.id === modalIntervalId
	);

	useEffect(() => {
		if (!uid) return;
		const fetchIntervals = async () => {
			setLoading(true);
			try {
				const res = await api.get(`/api/calendar/${uid}`);
				setIntervals(res.data);
				setEditingIntervals(res.data);
			} catch (e: any) {
				setError(e?.response?.data?.error || t("calendar.errorLoad"));
			}
			setLoading(false);
		};
		fetchIntervals();
		// eslint-disable-next-line
	}, [uid]);

	const events: CalendarEventType[] = useMemo(
		() =>
			editingIntervals.map((i) => ({
				id: i.id,
				title: i.label || t("calendar.available"),
				start: new Date(i.start),
				end: new Date(i.end),
				allDay: false,
			})),
		[editingIntervals, t]
	);

	const handleSelectSlot = (slot: SlotInfo) => {
		if (!canEdit) return;
		const newStart = slot.start as Date;
		const newEnd = slot.end as Date;
		const now = new Date();
		const sixMonthsFromNow = new Date();
		sixMonthsFromNow.setMonth(now.getMonth() + 6);

		// Disallow intervals that end in the past
		if (newEnd <= now) {
			setError(t("calendar.errorInPast"));
			return;
		}
		// Disallow intervals that start more than 6 months in advance
		if (newStart > sixMonthsFromNow) {
			setError(t("calendar.errorTooFar"));
			return;
		}
		// Overlap check
		if (
			editingIntervals.some(
				(i) => newStart < new Date(i.end) && newEnd > new Date(i.start)
			)
		) {
			setError(t("calendar.errorOverlap"));
			return;
		}
		const id = Math.random().toString(36).slice(2, 10);
		setEditingIntervals([
			...editingIntervals,
			{
				id,
				start: newStart.toISOString(),
				end: newEnd.toISOString(),
				label: t("calendar.available"),
			},
		]);
		setError("");
	};

	const handleDeleteEvent = (eventId: string) => {
		setEditingIntervals((intervals) =>
			intervals.filter((i) => i.id !== eventId)
		);
		setError("");
	};

	const saveIntervals = async () => {
		setSaving(true);
		setError("");
		setSuccess("");
		try {
			await api.put(`/api/calendar/me`, {
				intervals: editingIntervals.map(({ start, end, label }) => ({
					start,
					end,
					label,
				})),
			});
			setIntervals(editingIntervals);
			setSuccess(t("calendar.successSave"));
		} catch (err: any) {
			setError(err?.response?.data?.error || t("calendar.errorSave"));
		}
		setSaving(false);
	};

	const handleEditEvent = (eventId: string) => {
		setModalIntervalId(eventId);
		setModalOpen(true);
	};

	const handleSaveLabel = (newLabel: string) => {
		if (!modalIntervalId) return;
		setEditingIntervals((intervals) =>
			intervals.map((i) =>
				i.id === modalIntervalId
					? {
							...i,
							label: newLabel.trim() || t("calendar.available"),
					  }
					: i
			)
		);
		setModalOpen(false);
		setModalIntervalId(null);
	};

	if (loading)
		return <div className={styles.loading}>{t("calendar.loading")}</div>;
	if (error && !canEdit) return <div className={styles.error}>{error}</div>;

	return (
		<div className={styles.container}>
			<h1 className={styles.heading}>
				{canEdit
					? t("calendar.myCalendar")
					: t("calendar.userCalendar")}
			</h1>
			<Calendar
				localizer={localizer}
				events={events}
				defaultView={view}
				view={view}
				date={date}
				onNavigate={setDate}
				onView={setView}
				views={["week", "day", "agenda"]}
				components={{
					event: (props) => (
						<CalendarEvent
							{...props}
							canEdit={canEdit}
							onDelete={handleDeleteEvent}
							onEdit={handleEditEvent}
						/>
					),
					toolbar: (props) => (
						<CalendarToolbar {...props} setView={setView} />
					),
				}}
				selectable={canEdit}
				onSelectSlot={handleSelectSlot}
				style={{
					height: 540,
					borderRadius: 12,
				}}
				popup
				min={new Date(1970, 1, 1, 7, 0, 0)}
				max={new Date(1970, 1, 1, 21, 0, 0)}
				messages={{
					today: t("calendar.today"),
					previous: t("calendar.previous"),
					next: t("calendar.next"),
					week: t("calendar.week"),
					day: t("calendar.day"),
					agenda: t("calendar.agenda"),
					date: t("calendar.date"),
					time: t("calendar.time"),
					event: t("calendar.event"),
					noEventsInRange: t("calendar.noEvents"),
				}}
			/>
			<CalendarLegend />
			{canEdit && (
				<button
					className={styles.saveButton}
					onClick={saveIntervals}
					disabled={saving}
				>
					{saving ? t("calendar.saving") : t("calendar.save")}
				</button>
			)}
			{error && <div className={styles.error}>{error}</div>}
			{success && <div className={styles.success}>{success}</div>}
		</div>
	);
}
