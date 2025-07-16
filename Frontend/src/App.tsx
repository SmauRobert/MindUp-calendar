import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import CheckEmailPage from "./pages/CheckEmailPage";
import CalendarPage from "./pages/CalendarPage";
import RequestFormPage from "./pages/RequestFormPage";
import ProfilePage from "./pages/ProfilePage";
import AdministrationPage from "./pages/AdministrationPage";
import NewAdminPage from "./pages/NewAdminPage";
import Navbar from "./components/Navbar/Navbar";

function ProtectedRoute({
	children,
	allowedRoles,
}: {
	children: React.ReactNode;
	allowedRoles?: string[];
}) {
	const { user, loading } = useAuth();
	if (loading) return <div>Loading...</div>;
	if (!user) return <Navigate to="/login" replace />;
	if (allowedRoles && !allowedRoles.includes(user.role))
		return <Navigate to="/" replace />;
	return <>{children}</>;
}

export default function App() {
	return (
		<AuthProvider>
			<BrowserRouter>
				<Navbar />
				<Routes>
					<Route path="/login" element={<LoginPage />} />
					<Route path="/check-email" element={<CheckEmailPage />} />

					<Route
						path="/"
						element={
							<ProtectedRoute>
								<CalendarPage />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/request-form"
						element={
							<ProtectedRoute>
								<RequestFormPage />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/profile"
						element={
							<ProtectedRoute>
								<ProfilePage />
							</ProtectedRoute>
						}
					/>
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
					<Route path="*" element={<Navigate to="/" replace />} />
				</Routes>
			</BrowserRouter>
		</AuthProvider>
	);
}
