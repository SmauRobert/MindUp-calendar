import { Routes, Route, Navigate, Outlet, BrowserRouter } from 'react-router'
import CalendarPage from './pages/CalendarPage'
import ProfilePage from './pages/ProfilePage'
import FormPage from './pages/FormPage'
import LoginPage from './pages/LoginPage'
import AdminPage from './pages/AdminPage'
import { useAuth } from './context/UserContext'
import './styles/reset.scss'
import './styles/global.scss'

const ProtectedRoute = () => {
    const { user } = useAuth()
    return user ? <Outlet /> : <Navigate to="/login" replace />
}

const PublicOnlyRoute = () => {
    const { user } = useAuth()
    return user ? <Navigate to="/" replace /> : <Outlet />
}

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<PublicOnlyRoute />}>
                    <Route path="/login" element={<LoginPage />} />
                    {/* You can also add /confirm, /forgot, etc. here */}
                </Route>
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
