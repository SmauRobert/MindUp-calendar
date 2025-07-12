import { type FC } from 'react'
import { Routes, Route, BrowserRouter, Navigate } from 'react-router'
import CalendarPage from './pages/CalendarPage'
import ProfilePage from './pages/ProfilePage'
import FormPage from './pages/MeetingRequest'
import LoginPage from './pages/LoginPage'
import AdminPage from './pages/AdminPage'
import './styles/reset.scss'
import './styles/global.scss'

const App: FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/administration" element={<AdminPage />} />
                <Route path="/" element={<CalendarPage />} />
                <Route path="/form" element={<FormPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
