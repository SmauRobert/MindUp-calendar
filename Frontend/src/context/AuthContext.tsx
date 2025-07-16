import {
	createContext,
	useContext,
	useState,
	useEffect,
	type ReactNode,
} from "react";
import { auth } from "../firebaseConfig";
import {
	onAuthStateChanged,
	getIdToken,
	signOut as firebaseSignOut,
	type User as FirebaseUser,
} from "firebase/auth";
import api from "../api/axiosInstance";

export type UserRole = "DEFAULT" | "ADMIN" | "SUPERADMIN";
export type Language = "EN" | "RO";
export interface User {
	uid: string;
	email: string;
	fullName: string | null;
	role: UserRole;
	preferredLanguage: Language;
}

interface AuthContextProps {
	user: User | null;
	loading: boolean;
	logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	const fetchBackendUser = async (firebaseUser: FirebaseUser) => {
		const token = await getIdToken(firebaseUser, true);
		localStorage.setItem("token", token);
		const res = await api.post(`/api/auth/login`, {});
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
				localStorage.removeItem("token");
			}
			setLoading(false);
		});
		return () => unsubscribe();
	}, []);

	const logout = async () => {
		await firebaseSignOut(auth);
		setUser(null);
		localStorage.removeItem("token");
	};

	return (
		<AuthContext.Provider value={{ user, loading, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error("useAuth must be used within AuthProvider");
	return ctx;
};
