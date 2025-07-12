import { type FC, type ReactNode } from 'react'
import styles from './Layout.module.scss'
import { FaCalendar, FaPlus, FaUser } from 'react-icons/fa6'

interface LayoutProps {
    children?: ReactNode
}

const Layout: FC<LayoutProps> = ({ children }) => {
    return (
        <div className={styles.baseLayout}>
            <div className={styles.contentLayout}>
                <nav>
                    <FaCalendar className={styles.navtab} />
                    <FaPlus className={styles.navtab} />
                    <FaUser className={styles.navtab} />
                </nav>
                <main>{children}</main>
            </div>
        </div>
    )
}

export default Layout
