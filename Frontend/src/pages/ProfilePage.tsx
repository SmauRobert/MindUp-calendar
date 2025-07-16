import { useAuth } from "../context/AuthContext";

export default function ProfilePage() {
	const { user } = useAuth();
	if (!user) return null;
	return (
		<div style={{ padding: 32 }}>
			<h1>Profile</h1>
			<ul>
				<li>
					<b>Email:</b> {user.email}
				</li>
				<li>
					<b>Full Name:</b> {user.fullName}
				</li>
				<li>
					<b>Role:</b> {user.role}
				</li>
				<li>
					<b>Preferred Language:</b> {user.preferredLanguage}
				</li>
			</ul>
		</div>
	);
}
