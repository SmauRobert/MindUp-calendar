import React from "react";
import {
	BrowserRouter,
	Routes,
	Route,
	Navigate,
	useLocation,
	useParams,
} from "react-router";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import CheckEmailPage from "./pages/CheckEmailPage";
import RequestFormPage from "./pages/RequestFormPage";
import ProfilePage from "./pages/ProfilePage";
import CalendarPage from "./pages/CalendarPage";
import AdministrationPage from "./pages/AdministrationPage";
import NewAdminPage from "./pages/NewAdminPage";
import Navbar from "./components/Navbar/Navbar";

function RedirectAfterLogin() {
	const { user } = useAuth();
	if (!user) return <Navigate to="/login" replace />;
	if (user.role === "ADMIN" || user.role === "SUPERADMIN")
		return <Navigate to="/administration" replace />;
	return <Navigate to={`/calendar/${user.uid}`} replace />;
}

function ProtectedRoute({
	children,
	allowedRoles,
}: {
	children: React.ReactNode;
	allowedRoles?: string[];
}) {
	const { user, loading } = useAuth();
	const location = useLocation();
	if (loading) return <div>Loading...</div>;
	if (!user)
		return <Navigate to="/login" state={{ from: location }} replace />;
	if (allowedRoles && !allowedRoles.includes(user.role))
		return <Navigate to="/" replace />;
	return <>{children}</>;
}

// For profile/calendar: restrict who can view/edit
function ProfileGuard({ children }: { children: React.ReactNode }) {
	const { user } = useAuth();
	const { uid } = useParams();
	if (!user) return <Navigate to="/login" replace />;
	if (user.role === "ADMIN" || user.role === "SUPERADMIN")
		return <>{children}</>;
	if (user.uid === uid) return <>{children}</>;
	return <Navigate to={`/profile/${user.uid}`} replace />;
}
function CalendarGuard({ children }: { children: React.ReactNode }) {
	const { user } = useAuth();
	const { uid } = useParams();
	if (!user) return <Navigate to="/login" replace />;
	if (user.role === "ADMIN" || user.role === "SUPERADMIN")
		return <>{children}</>;
	if (user.uid === uid) return <>{children}</>;
	return <Navigate to={`/calendar/${user.uid}`} replace />;
}

export default function App() {
	return (
		<AuthProvider>
			<BrowserRouter>
				<Navbar />
				<Routes>
					<Route path="/login" element={<LoginPage />} />
					<Route path="/check-email" element={<CheckEmailPage />} />
					<Route path="/" element={<RedirectAfterLogin />} />
					{/* Admin and Superadmin: */}
					<Route
						path="/administration"
						element={
							<ProtectedRoute
								allowedRoles={["ADMIN", "SUPERADMIN"]}
							>
								<AdministrationPage />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/new-admin"
						element={
							<ProtectedRoute allowedRoles={["SUPERADMIN"]}>
								<NewAdminPage />
							</ProtectedRoute>
						}
					/>
					{/* Calendar/Profile are UID-based */}
					<Route
						path="/calendar/:uid"
						element={
							<CalendarGuard>
								<CalendarPage />
							</CalendarGuard>
						}
					/>
					<Route
						path="/profile/:uid"
						element={
							<ProfileGuard>
								<ProfilePage />
							</ProfileGuard>
						}
					/>
					{/* Request Form: only for default users */}
					<Route
						path="/request-form"
						element={
							<ProtectedRoute allowedRoles={["DEFAULT"]}>
								<RequestFormPage />
							</ProtectedRoute>
						}
					/>
					<Route path="*" element={<Navigate to="/" replace />} />
				</Routes>
			</BrowserRouter>
		</AuthProvider>
	);
}
