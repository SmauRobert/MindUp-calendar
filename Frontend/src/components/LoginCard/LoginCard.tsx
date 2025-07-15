import { type FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styles from './LoginCard.module.scss'
import LanguagePicker from '../LanguagePicker/LanguagePicker'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const LoginCard: FC = () => {
    const { t } = useTranslation()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [touched, setTouched] = useState<{ email?: boolean; password?: boolean }>({})
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({})

    const validate = () => {
        const errs: typeof errors = {}
        if (!email) {
            errs.email = t('login.errors.emailRequired')
        } else if (!emailRegex.test(email)) {
            errs.email = t('login.errors.emailInvalid')
        }
        if (!password) {
            errs.password = t('login.errors.passwordRequired')
        }
        setErrors(errs)
        return Object.keys(errs).length === 0
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (validate()) {
            alert('Login successful (stub)')
        }
    }

    const handleBlur = (field: 'email' | 'password') => {
        setTouched((t) => ({ ...t, [field]: true }))
        validate()
    }

    return (
        <div className={styles.centerContainer}>
            <div className={styles.cardWrapper}>
                <LanguagePicker />
                <div className={styles.loginCard}>
                    <h2>{t('login.title')}</h2>
                    <form onSubmit={handleSubmit} noValidate>
                        <div className={styles.inputGroup}>
                            <label htmlFor="login-email">{t('login.email')}</label>
                            <input
                                type="email"
                                id="login-email"
                                value={email}
                                autoComplete="username"
                                onChange={(e) => setEmail(e.target.value)}
                                onBlur={() => handleBlur('email')}
                                aria-invalid={!!errors.email}
                                aria-describedby="email-error"
                                required
                            />
                            {touched.email && errors.email && (
                                <span id="email-error" className={styles.error} aria-live="polite">
                                    {errors.email}
                                </span>
                            )}
                        </div>
                        <div className={styles.inputGroup}>
                            <label htmlFor="login-password">{t('login.password')}</label>
                            <div className={styles.passwordInput}>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="login-password"
                                    value={password}
                                    autoComplete="current-password"
                                    onChange={(e) => setPassword(e.target.value)}
                                    onBlur={() => handleBlur('password')}
                                    aria-invalid={!!errors.password}
                                    aria-describedby="password-error"
                                    required
                                />
                                <button
                                    type="button"
                                    tabIndex={0}
                                    onClick={() => setShowPassword((v) => !v)}
                                    className={styles.togglePassword}
                                    aria-label={
                                        showPassword
                                            ? t('login.hidePassword')
                                            : t('login.showPassword')
                                    }
                                >
                                    {showPassword ? '🙈' : '👁️'}
                                </button>
                            </div>
                            {touched.password && errors.password && (
                                <span
                                    id="password-error"
                                    className={styles.error}
                                    aria-live="polite"
                                >
                                    {errors.password}
                                </span>
                            )}
                        </div>
                        <button
                            className={styles.submitBtn}
                            type="submit"
                            disabled={!email || !password || Object.keys(errors).length > 0}
                        >
                            {t('login.submit')}
                        </button>
                        <div className={styles.footerLinks}>
                            <a href="#" tabIndex={0}>
                                {t('login.forgot')}
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default LoginCard
