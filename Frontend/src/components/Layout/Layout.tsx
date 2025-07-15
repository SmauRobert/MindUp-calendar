import { type FC, type ReactNode } from 'react'
import Navbar from '../Navbar/Navbar'
import styles from './Layout.module.scss'

interface LayoutProps {
    children?: ReactNode
}

const Layout: FC<LayoutProps> = ({ children }) => (
    <div className={styles.baseLayout}>
        <Navbar />
        <div className={styles.contentLayout}>
            <main>{children}</main>
        </div>
    </div>
)

export default Layout
