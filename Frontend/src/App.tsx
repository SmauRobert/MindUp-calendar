import { type FC } from 'react'
import { Routes, Route, BrowserRouter, Navigate, Outlet } from 'react-router'
import { useAuth } from './context/UserContext'
import CalendarPage from './pages/CalendarPage'
import ProfilePage from './pages/ProfilePage'
import FormPage from './pages/FormPage'
import LoginPage from './pages/LoginPage'
import AdminPage from './pages/AdminPage'
import './styles/reset.scss'
import './styles/global.scss'

const App: FC = () => {
    const ProtectedRoute = () => {
        const { user } = useAuth()
        return user ? <Outlet /> : <Navigate to="/login" replace />
    }
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route element={<ProtectedRoute />}>
                    <Route path="/" element={<CalendarPage />} />
                    <Route path="/form" element={<FormPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/administration" element={<AdminPage />} />
                </Route>
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
