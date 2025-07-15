import { type FC, useState } from 'react'
import { FaCalendar, FaPlus, FaUser, FaBars, FaSignOutAlt } from 'react-icons/fa'
import { useNavigate } from 'react-router'
import { useAuth } from '../../context/UserContext'
import LanguagePicker from '../LanguagePicker/LanguagePicker'
import styles from './Navbar.module.scss'

const Navbar: FC = () => {
    const { user, logout } = useAuth()
    const [menuOpen, setMenuOpen] = useState(false)
    const navigate = useNavigate()

    // Only show when logged in
    if (!user) return null

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <header className={styles.navbar}>
            <div className={styles.left}>
                <div className={styles.logo} onClick={() => navigate('/')}>
                    <FaCalendar />
                    <span>Calendar App</span>
                </div>
            </div>
            <nav className={`${styles.links} ${menuOpen ? styles.open : ''}`}>
                <button className={styles.navtab} onClick={() => navigate('/')}>
                    <FaCalendar />
                    <span>Calendar</span>
                </button>
                <button className={styles.navtab} onClick={() => navigate('/form')}>
                    <FaPlus />
                    <span>Request</span>
                </button>
                <button className={styles.navtab} onClick={() => navigate('/profile')}>
                    <FaUser />
                    <span>Profile</span>
                </button>
                <LanguagePicker />
                <button className={styles.navtab} onClick={handleLogout} title="Logout">
                    <FaSignOutAlt />
                    <span>Logout</span>
                </button>
            </nav>
            <button
                className={styles.menuButton}
                onClick={() => setMenuOpen((m) => !m)}
                aria-label="Toggle menu"
            >
                <FaBars />
            </button>
        </header>
    )
}

export default Navbar
