import { useState } from "react";
import { useForm } from "react-hook-form";
import { auth } from "../firebaseConfig";
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	sendEmailVerification,
} from "firebase/auth";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

type AuthForm = {
	email: string;
	password: string;
};

export default function LoginPage() {
	const [tab, setTab] = useState<"login" | "register">("login");
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const {
		register,
		handleSubmit,
		formState: {},
		reset,
	} = useForm<AuthForm>();
	const navigate = useNavigate();
	const { login } = useAuth();

	const handleLogin = async (data: AuthForm) => {
		setError("");
		try {
			const userCredential = await signInWithEmailAndPassword(
				auth,
				data.email,
				data.password
			);
			const token = await userCredential.user.getIdToken();
			await login(token);
			navigate("/");
		} catch (e: any) {
			setError(e.message);
		}
	};

	const handleRegister = async (data: AuthForm) => {
		setError("");
		setSuccess("");
		try {
			await createUserWithEmailAndPassword(
				auth,
				data.email,
				data.password
			);
			if (auth.currentUser) {
				await sendEmailVerification(auth.currentUser);
			}
			setSuccess("Check your email to verify your account.");
			reset();
			setTab("login");
			navigate("/check-email");
		} catch (e: any) {
			setError(e.message);
		}
	};

	return (
		<div
			style={{
				display: "flex",
				minHeight: "100vh",
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			<div
				style={{
					width: 350,
					padding: 32,
					background: "#fff",
					borderRadius: 12,
					boxShadow: "0 4px 24px #0002",
				}}
			>
				<div style={{ display: "flex", marginBottom: 24 }}>
					<button
						onClick={() => setTab("login")}
						style={{
							flex: 1,
							background:
								tab === "login" ? "#e9f0fb" : "transparent",
							border: "none",
							borderBottom:
								tab === "login"
									? "2px solid #2772e5"
									: "2px solid #eee",
							padding: "0.75rem",
							cursor: "pointer",
							fontWeight: 600,
						}}
					>
						Login
					</button>
					<button
						onClick={() => setTab("register")}
						style={{
							flex: 1,
							background:
								tab === "register" ? "#e9f0fb" : "transparent",
							border: "none",
							borderBottom:
								tab === "register"
									? "2px solid #2772e5"
									: "2px solid #eee",
							padding: "0.75rem",
							cursor: "pointer",
							fontWeight: 600,
						}}
					>
						Register
					</button>
				</div>
				<form
					onSubmit={handleSubmit(
						tab === "login" ? handleLogin : handleRegister
					)}
				>
					<input
						{...register("email", { required: true })}
						placeholder="Email"
						type="email"
						style={{
							width: "100%",
							marginBottom: 12,
							padding: 10,
							borderRadius: 6,
							border: "1px solid #ddd",
						}}
					/>
					<input
						{...register("password", {
							required: true,
							minLength: 6,
						})}
						placeholder="Password"
						type="password"
						style={{
							width: "100%",
							marginBottom: 16,
							padding: 10,
							borderRadius: 6,
							border: "1px solid #ddd",
						}}
					/>
					<button
						type="submit"
						style={{
							width: "100%",
							padding: 12,
							borderRadius: 6,
							background: "#2772e5",
							color: "#fff",
							border: "none",
							fontWeight: 600,
							marginBottom: 10,
						}}
					>
						{tab === "login" ? "Login" : "Register"}
					</button>
					{error && (
						<div
							style={{
								color: "#e43d40",
								background: "#ffeaea",
								borderRadius: 6,
								padding: 8,
								marginBottom: 8,
							}}
						>
							{error}
						</div>
					)}

					{success && (
						<div style={{ color: "#27ae60", marginBottom: 8 }}>
							{success}
						</div>
					)}
				</form>
			</div>
		</div>
	);
}
