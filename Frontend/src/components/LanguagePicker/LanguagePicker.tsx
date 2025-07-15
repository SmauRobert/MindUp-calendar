import { type FC, useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import styles from './LanguagePicker.module.scss'
import gbFlag from '../../assets/gb-flag.svg'
import roFlag from '../../assets/ro-flag.svg'

const LANGS = [
    { code: 'en', flag: gbFlag, label: 'English' },
    { code: 'ro', flag: roFlag, label: 'Română' },
]

const LanguagePicker: FC = () => {
    const { i18n } = useTranslation()
    const [open, setOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!open) return
        const onClick = (e: MouseEvent) => {
            if (!ref.current?.contains(e.target as Node)) setOpen(false)
        }
        document.addEventListener('mousedown', onClick)
        return () => document.removeEventListener('mousedown', onClick)
    }, [open])

    const handleChange = (lang: string) => {
        i18n.changeLanguage(lang)
        localStorage.setItem('appLanguage', lang)
        setOpen(false)
    }

    const currentLang = LANGS.find((l) => l.code === i18n.language) || LANGS[0]

    return (
        <div className={styles.languagePickerWrapper} ref={ref}>
            <button
                className={styles.pickerButton}
                onClick={() => setOpen((o) => !o)}
                aria-label="Change language"
                type="button"
            >
                <img src={currentLang.flag} alt={currentLang.label} />
            </button>
            {open && (
                <div className={styles.dropdown}>
                    {LANGS.map(({ code, flag, label }) => (
                        <button
                            key={code}
                            onClick={() => handleChange(code)}
                            className={i18n.language === code ? styles.active : ''}
                            aria-label={label}
                            type="button"
                        >
                            <img src={flag} alt={label} />
                            <span>{label}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

export default LanguagePicker
