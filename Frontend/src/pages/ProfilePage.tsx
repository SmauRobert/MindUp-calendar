import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { useTranslation } from "react-i18next";

type UserRole = "DEFAULT" | "ADMIN" | "SUPERADMIN";
type Language = "EN" | "RO";

type ProfileUser = {
	uid: string;
	email: string;
	fullName: string | null;
	role: UserRole;
	preferredLanguage: Language;
};

export default function ProfilePage() {
	const { uid } = useParams();
	const { user, loading } = useAuth();
	const { i18n } = useTranslation();
	const [profile, setProfile] = useState<ProfileUser | null>(null);
	const [editName, setEditName] = useState("");
	const [saving, setSaving] = useState(false);
	const [success, setSuccess] = useState("");
	const [error, setError] = useState("");

	// Only allow editing if current user matches profile uid
	const canEdit = user && profile && user.uid === profile.uid;

	useEffect(() => {
		if (!uid) return;
		const fetchProfile = async () => {
			try {
				const backendUrl = import.meta.env.VITE_BACKEND_URL;
				const res = await axios.get(
					`http://${backendUrl}/api/users/${uid}`,
					{
						headers: {
							Authorization: `Bearer ${
								localStorage.getItem("token") || ""
							}`,
						},
					}
				);
				setProfile(res.data);
				setEditName(res.data.fullName || "");
			} catch (err) {
				setProfile(null);
			}
		};
		fetchProfile();
	}, [uid]);

	const handleSave = async () => {
		if (!profile) return;
		setSaving(true);
		setError("");
		setSuccess("");
		try {
			const backendUrl = import.meta.env.VITE_BACKEND_URL;
			await axios.patch(
				`http://${backendUrl}/api/users/me`,
				{ fullName: editName },
				{
					headers: {
						Authorization: `Bearer ${
							localStorage.getItem("token") || ""
						}`,
					},
				}
			);
			setSuccess("Profile updated.");
			setProfile({ ...profile, fullName: editName });
		} catch (err: any) {
			setError("Failed to update profile.");
		}
		setSaving(false);
	};

	const handleLanguageChange = async (lang: Language) => {
		if (!profile) return;
		try {
			const backendUrl = import.meta.env.VITE_BACKEND_URL;
			await axios.patch(
				`http://${backendUrl}/api/users/me/language`,
				{ preferredLanguage: lang },
				{
					headers: {
						Authorization: `Bearer ${
							localStorage.getItem("token") || ""
						}`,
					},
				}
			);
			setProfile({ ...profile, preferredLanguage: lang });
			i18n.changeLanguage(lang.toLowerCase());
		} catch {
			setError("Failed to change language.");
		}
	};

	if (loading) return <div>Loading...</div>;
	if (!profile) return <div>User not found.</div>;

	return (
		<div style={{ padding: 32, maxWidth: 500, margin: "0 auto" }}>
			<h1 style={{ marginBottom: 16 }}>
				{canEdit ? "My Profile" : "Profile"}
			</h1>
			<ul style={{ marginBottom: 16 }}>
				<li>
					<b>Email:</b> {profile.email}
				</li>
				<li>
					<b>Role:</b> {profile.role}
				</li>
				<li>
					<b>Preferred Language:</b>{" "}
					<select
						value={profile.preferredLanguage}
						onChange={(e) =>
							handleLanguageChange(e.target.value as Language)
						}
						disabled={!canEdit}
						style={{ marginLeft: 8, minWidth: 80 }}
					>
						<option value="EN">EN</option>
						<option value="RO">RO</option>
					</select>
				</li>
			</ul>
			<div style={{ marginBottom: 16 }}>
				<b>Full Name:</b>
				{canEdit ? (
					<input
						value={editName}
						onChange={(e) => setEditName(e.target.value)}
						style={{
							marginLeft: 8,
							padding: 6,
							borderRadius: 6,
							border: "1px solid #ddd",
						}}
					/>
				) : (
					<span style={{ marginLeft: 8 }}>
						{profile.fullName || "N/A"}
					</span>
				)}
				{canEdit && (
					<button
						onClick={handleSave}
						style={{
							marginLeft: 12,
							background: "#2772e5",
							color: "#fff",
							border: "none",
							padding: "6px 18px",
							borderRadius: 5,
							fontWeight: 600,
						}}
						disabled={saving}
					>
						{saving ? "Saving..." : "Save"}
					</button>
				)}
			</div>
			{error && (
				<div style={{ color: "#e43d40", marginBottom: 8 }}>{error}</div>
			)}
			{success && (
				<div style={{ color: "#27ae60", marginBottom: 8 }}>
					{success}
				</div>
			)}

			{/* Placeholder for requests list */}
			<div style={{ marginTop: 36 }}>
				<h3>User Requests</h3>
				<p>(Feature coming soon...)</p>
			</div>
		</div>
	);
}
