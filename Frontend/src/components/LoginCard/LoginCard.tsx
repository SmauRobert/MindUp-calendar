import { type FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styles from './LoginCard.module.scss'
import LanguagePicker from '../LanguagePicker/LanguagePicker'
import { useAuth } from '../../context/UserContext'
import { useNavigate } from 'react-router'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const LoginCard: FC = () => {
    const { t } = useTranslation()
    const { login, register } = useAuth()
    const navigate = useNavigate()

    const [mode, setMode] = useState<'login' | 'register'>('login')
    const [fields, setFields] = useState({ email: '', password: '', name: '' })
    const [touched, setTouched] = useState<{ email?: boolean; password?: boolean; name?: boolean }>(
        {},
    )
    const [errors, setErrors] = useState<{ email?: string; password?: string; name?: string }>({})
    const [apiError, setApiError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    const validate = () => {
        const errs: typeof errors = {}
        if (!fields.email) errs.email = t('login.errors.emailRequired')
        else if (!emailRegex.test(fields.email)) errs.email = t('login.errors.emailInvalid')
        if (!fields.password) errs.password = t('login.errors.passwordRequired')
        if (mode === 'register' && !fields.name) errs.name = t('register.errors.nameRequired')
        setErrors(errs)
        return Object.keys(errs).length === 0
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFields({ ...fields, [e.target.name]: e.target.value })
        setTouched({ ...touched, [e.target.name]: true })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setApiError(null)
        setSuccess(false)
        if (!validate()) return

        setLoading(true)
        try {
            if (mode === 'login') {
                try {
                    await login(fields.email, fields.password)
                    navigate('/')
                } catch (err: any) {
                    if (err.error === 'no_email') setApiError(t('login.errors.noAccount'))
                    else if (err.error === 'wrong_password')
                        setApiError(t('login.errors.wrongPassword'))
                    else if (err.error === 'not_confirmed') {
                        navigate('/confirm', { state: { email: fields.email } })
                        return
                    } else setApiError(t('login.errors.unknown'))
                }
            } else {
                try {
                    await register(fields.name, fields.email, fields.password)
                    setSuccess(true)
                    setMode('login')
                    setFields({ email: fields.email, password: '', name: '' })
                } catch (err: any) {
                    if (err.error === 'register_failed' && err.message === 'Email already exists.')
                        setApiError(t('register.errors.emailExists'))
                    else setApiError(t('register.errors.unknown'))
                }
            }
        } finally {
            setLoading(false)
        }
    }

    const formClass = mode === 'login' ? styles.loginForm : styles.registerForm

    return (
        <div className={styles.centerContainer}>
            <div className={styles.cardWrapper}>
                <LanguagePicker />
                <div className={styles.loginCard}>
                    <div className={styles.tabSwitch}>
                        <button
                            className={mode === 'login' ? styles.activeTab : ''}
                            onClick={() => {
                                setMode('login')
                                setApiError(null)
                                setSuccess(false)
                            }}
                            type="button"
                        >
                            {t('login.tab')}
                        </button>
                        <button
                            className={mode === 'register' ? styles.activeTab : ''}
                            onClick={() => {
                                setMode('register')
                                setApiError(null)
                                setSuccess(false)
                            }}
                            type="button"
                        >
                            {t('register.tab')}
                        </button>
                    </div>
                    <form
                        className={formClass}
                        onSubmit={handleSubmit}
                        autoComplete="on"
                        noValidate
                    >
                        {mode === 'register' && (
                            <div className={styles.inputGroup}>
                                <label htmlFor="register-name">{t('register.name')}</label>
                                <input
                                    id="register-name"
                                    name="name"
                                    type="text"
                                    value={fields.name}
                                    onChange={handleChange}
                                    onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                                    aria-invalid={!!errors.name}
                                    aria-describedby="name-error"
                                    autoFocus={mode === 'register'}
                                    required
                                />
                                {touched.name && errors.name && (
                                    <span id="name-error" className={styles.error}>
                                        {errors.name}
                                    </span>
                                )}
                            </div>
                        )}
                        <div className={styles.inputGroup}>
                            <label htmlFor="login-email">{t('login.email')}</label>
                            <input
                                id="login-email"
                                name="email"
                                type="email"
                                value={fields.email}
                                onChange={handleChange}
                                onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                                aria-invalid={!!errors.email}
                                aria-describedby="email-error"
                                required
                                autoFocus={mode === 'login'}
                                autoComplete="username"
                            />
                            {touched.email && errors.email && (
                                <span id="email-error" className={styles.error}>
                                    {errors.email}
                                </span>
                            )}
                        </div>
                        <div className={styles.inputGroup}>
                            <label htmlFor="login-password">{t('login.password')}</label>
                            <input
                                id="login-password"
                                name="password"
                                type="password"
                                value={fields.password}
                                onChange={handleChange}
                                onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                                aria-invalid={!!errors.password}
                                aria-describedby="password-error"
                                required
                                autoComplete={
                                    mode === 'login' ? 'current-password' : 'new-password'
                                }
                            />
                            {touched.password && errors.password && (
                                <span id="password-error" className={styles.error}>
                                    {errors.password}
                                </span>
                            )}
                        </div>
                        <button className={styles.submitBtn} type="submit" disabled={loading}>
                            {loading
                                ? t('login.loading')
                                : mode === 'login'
                                ? t('login.submit')
                                : t('register.submit')}
                        </button>
                    </form>
                    {apiError && (
                        <div className={styles.error} style={{ textAlign: 'center' }}>
                            {apiError}
                        </div>
                    )}
                    {success && mode === 'login' && (
                        <div className={styles.successMsg}>{t('register.success')}</div>
                    )}
                    <div className={styles.footerLinks}>
                        {mode === 'login' ? (
                            <a href="#" tabIndex={0}>
                                {t('login.forgot')}
                            </a>
                        ) : (
                            <span style={{ color: 'transparent', userSelect: 'none' }}>.</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginCard
