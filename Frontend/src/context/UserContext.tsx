import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

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
    login: (token: string, user: User) => void
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

    // Load from localStorage on mount
    useEffect(() => {
        const storedToken = localStorage.getItem('token')
        const storedUser = localStorage.getItem('user')
        if (storedToken && storedUser) {
            setToken(storedToken)
            setUser(JSON.parse(storedUser))
        }
    }, [])

    const login = (jwt: string, userObj: User) => {
        setToken(jwt)
        setUser(userObj)
        localStorage.setItem('token', jwt)
        localStorage.setItem('user', JSON.stringify(userObj))
    }

    const logout = () => {
        setToken(null)
        setUser(null)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
    }

    return (
        <UserContext.Provider value={{ user, token, login, logout }}>
            {children}
        </UserContext.Provider>
    )
}
