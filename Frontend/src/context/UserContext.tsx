import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { AuthApi, type LoginResponse } from '../utils/authApi'

export type UserRole = 'DEFAULT' | 'ADMIN' | 'SUPERADMIN'

export interface User {
    name: string
    email: string
    role: UserRole
    isConfirmed: boolean
}

interface AuthContextType {
    user: User | null
    token: string | null
    login: (email: string, password: string) => Promise<void>
    register: (name: string, email: string, password: string) => Promise<void>
    logout: () => void
}

const UserContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
    const ctx = useContext(UserContext)
    if (!ctx) throw new Error('useAuth must be used within a UserProvider')
    return ctx
}

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null)
    const [token, setToken] = useState<string | null>(null)

    useEffect(() => {
        const storedToken = localStorage.getItem('token')
        const storedUser = localStorage.getItem('user')
        if (storedToken && storedUser) {
            setToken(storedToken)
            setUser(JSON.parse(storedUser))
        }
    }, [])

    const login = async (email: string, password: string) => {
        const data = await AuthApi.login(email, password)
        setToken(data.token)
        setUser(data.user)
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
    }

    const register = async (name: string, email: string, password: string) => {
        await AuthApi.register(name, email, password)
    }

    const logout = () => {
        setToken(null)
        setUser(null)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
    }

    return (
        <UserContext.Provider value={{ user, token, login, register, logout }}>
            {children}
        </UserContext.Provider>
    )
}
