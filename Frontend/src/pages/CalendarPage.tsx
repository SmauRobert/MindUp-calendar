import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router";
import { useAuth } from "../context/AuthContext";
import api from "../api/axiosInstance";
import { Calendar, dateFnsLocalizer, type SlotInfo } from "react-big-calendar";
import { parse, format, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale/en-US";
import { ro } from "date-fns/locale/ro";
import { FaTrash } from "react-icons/fa";
import "react-big-calendar/lib/css/react-big-calendar.css";

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

type Interval = {
	id: string;
	start: string;
	end: string;
	label?: string;
};

type CalendarEvent = {
	id: string;
	title: string;
	start: Date;
	end: Date;
	allDay?: boolean;
};

export default function CalendarPage() {
	const { uid } = useParams();
	const { user } = useAuth();
	const [_, setIntervals] = useState<Interval[]>([]);
	const [editingIntervals, setEditingIntervals] = useState<Interval[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [saving, setSaving] = useState(false);

	const canEdit = !!(
		user &&
		uid &&
		user.uid === uid &&
		user.role === "DEFAULT"
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
				setError(
					e?.response?.data?.error || "Failed to load calendar data."
				);
			}
			setLoading(false);
		};
		fetchIntervals();
	}, [uid]);

	const events: CalendarEvent[] = useMemo(
		() =>
			editingIntervals.map((i) => ({
				id: i.id,
				title: i.label || "Available",
				start: new Date(i.start),
				end: new Date(i.end),
				allDay: false,
			})),
		[editingIntervals]
	);

	const handleSelectSlot = (slot: SlotInfo) => {
		if (!canEdit) return;
		const newStart = slot.start as Date;
		const newEnd = slot.end as Date;
		// Overlap check
		if (
			editingIntervals.some(
				(i) => newStart < new Date(i.end) && newEnd > new Date(i.start)
			)
		) {
			setError("Intervals must not overlap.");
			return;
		}
		const id = Math.random().toString(36).slice(2, 10);
		setEditingIntervals([
			...editingIntervals,
			{
				id,
				start: newStart.toISOString(),
				end: newEnd.toISOString(),
				label: "Available",
			},
		]);
		setError("");
	};

	// Inline delete with trash icon
	function EventComponent({ event }: { event: CalendarEvent }) {
		return (
			<div style={{ display: "flex", alignItems: "center", gap: 6 }}>
				<span>{event.title}</span>
				{canEdit && (
					<span
						title="Delete"
						style={{
							color: "#e43d40",
							cursor: "pointer",
							marginLeft: 8,
							fontSize: 14,
						}}
						onClick={(e) => {
							e.stopPropagation();
							setEditingIntervals((intervals) =>
								intervals.filter((i) => i.id !== event.id)
							);
						}}
					>
						<FaTrash />
					</span>
				)}
			</div>
		);
	}

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
			setSuccess("Calendar updated.");
		} catch (err: any) {
			setError(err?.response?.data?.error || "Failed to save calendar.");
		}
		setSaving(false);
	};

	if (loading) return <div>Loading calendar...</div>;
	if (error && !canEdit)
		return <div style={{ color: "#e43d40" }}>{error}</div>;

	return (
		<div style={{ padding: 12, maxWidth: 1000, margin: "0 auto" }}>
			<h1 style={{ marginBottom: 24 }}>
				{canEdit ? "My Calendar" : "User Calendar"}
			</h1>
			<Calendar
				localizer={localizer}
				events={events}
				defaultView="week"
				views={["week", "day", "agenda"]}
				selectable={canEdit}
				onSelectSlot={handleSelectSlot}
				onSelectEvent={() => {}} // no default
				style={{
					height: 540,
					background: "#fff",
					borderRadius: 12,
					boxShadow: "0 4px 24px #0001",
				}}
				popup
				min={new Date(1970, 1, 1, 7, 0, 0)}
				max={new Date(1970, 1, 1, 21, 0, 0)}
				messages={{
					today: "Today",
					previous: "<",
					next: ">",
					week: "Week",
					day: "Day",
					agenda: "Agenda",
				}}
				components={{
					event: EventComponent,
				}}
			/>
			{canEdit && (
				<button
					style={{
						marginTop: 18,
						background: "#27ae60",
						color: "#fff",
						border: "none",
						borderRadius: 6,
						padding: "11px 32px",
						fontWeight: 600,
						fontSize: "1.1rem",
					}}
					onClick={saveIntervals}
					disabled={saving}
				>
					{saving ? "Saving..." : "Save Calendar"}
				</button>
			)}
			{error && (
				<div style={{ color: "#e43d40", marginTop: 10 }}>{error}</div>
			)}
			{success && (
				<div style={{ color: "#27ae60", marginTop: 10 }}>{success}</div>
			)}
		</div>
	);
}
