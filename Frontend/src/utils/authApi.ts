import { type User } from '../context/UserContext'
export type LoginResponse = {
    token: string
    user: User
}

const backendHost = import.meta.env.VITE_BACKEND_HOST
const PROTOCOL = window.location.protocol.replace(':', '')
const BASE_URL = `${PROTOCOL}://${backendHost}`

export const AuthApi = {
    async login(email: string, password: string): Promise<LoginResponse> {
        const res = await fetch(`${BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        })
        if (!res.ok) throw await res.json()
        return res.json()
    },

    async register(name: string, email: string, password: string) {
        const res = await fetch(`${BASE_URL}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password }),
        })
        if (!res.ok) throw await res.json()
        return res.json()
    },
}
