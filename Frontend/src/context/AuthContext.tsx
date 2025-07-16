import {
	createContext,
	useContext,
	useEffect,
	useState,
	type ReactNode,
} from "react";
import {
	type User as FirebaseUser,
	onAuthStateChanged,
	getIdToken,
	signOut,
} from "firebase/auth";
import { auth } from "../firebaseConfig";
import axios from "axios";

type UserRole = "DEFAULT" | "ADMIN" | "SUPERADMIN";
type Language = "EN" | "RO";

export interface User {
	uid: string;
	email: string;
	fullName: string;
	role: UserRole;
	preferredLanguage: Language;
}

interface AuthContextProps {
	user: User | null;
	loading: boolean;
	login: (token: string) => Promise<void>;
	logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	const fetchBackendUser = async (firebaseUser: FirebaseUser) => {
		const token = await getIdToken(firebaseUser, true);
		const backendUrl = import.meta.env.VITE_BACKEND_URL;
		const res = await axios.post(
			`http://${backendUrl}/api/auth/login`,
			{},
			{ headers: { Authorization: `Bearer ${token}` } }
		);
		setUser(res.data);
	};

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
			setLoading(true);
			if (firebaseUser) {
				try {
					await fetchBackendUser(firebaseUser);
				} catch {
					setUser(null);
				}
			} else {
				setUser(null);
			}
			setLoading(false);
		});
		return () => unsubscribe();
	}, []);

	const login = async (token: string) => {
		const backendUrl = import.meta.env.VITE_BACKEND_URL;
		try {
			const res = await axios.post(
				`http://${backendUrl}/api/auth/login`,
				{},
				{ headers: { Authorization: `Bearer ${token}` } }
			);

			setUser(res.data);
		} catch (err: any) {
			throw new Error(
				err?.response?.data?.error ||
					"Login failed. Please check your credentials and email verification."
			);
		}
	};

	const logout = async () => {
		await signOut(auth);
		setUser(null);
	};

	return (
		<AuthContext.Provider value={{ user, loading, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error("useAuth must be used within AuthProvider");
	return ctx;
};
