import React, { useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../App';
import { API } from '../../api/API';
import Header from '../../components/Header/Header';
import styles from './LoginPage.module.scss';

export default function LoginPage() {

    const { user, setUser } = useContext(UserContext);

    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);

    const [error, setError] = React.useState<string | null>(null);

    const [type, setType] = React.useState<'login' | 'register'>('login');

    const navigate = useNavigate()

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const username = usernameRef.current?.value;
        const password = passwordRef.current?.value;
        const email = emailRef.current?.value;

        if (type === 'register') {
            if (!username || !password || !email) return alert('Fill all fields');

            try {
                const resp = await API.register(email, password, username);

                if (resp) setType('login')
            }
            catch (err: any) { setError(err.message) }
        }
        else if (type === 'login') {
            if (!username || !password) return alert('Fill all fields');

            try {
                const resp = await API.login(username, password);

                if (resp) setUser(resp)
            }
            catch (err: any) { setError(err.message) }
        }
    }

    useEffect(() => {
        setTimeout(() => { setError(null) }, 1300);
    }, [error])

    useEffect(() => {
        if (user) navigate('/')
    }, [user])

    return (
        <>
            <Header />

            <div className={styles.page}>

                {type === 'login' &&
                    <form onSubmit={onSubmit} className={styles.form}>
                        <h1>Login</h1>

                        <label >
                            <input ref={usernameRef} type="text" required placeholder="username" />
                            <h4>Username</h4>

                        </label>

                        <label>
                            <input ref={passwordRef} type="password" required placeholder="password" />
                            <h4>Password</h4>
                        </label>

                        <div className={styles.footer}>
                            <button className={[styles.button, error && styles.error].join(' ')} type="submit">Login</button>
                            <span onClick={() => setType('register')}>Create new account</span>
                        </div>
                    </form>
                }

                {type === 'register' &&
                    <form onSubmit={onSubmit} className={styles.form}>
                        <h1>Register</h1>

                        <label >
                            <input ref={usernameRef} type="text" required placeholder="username" />
                            <h4>Username</h4>

                        </label>

                        <label >
                            <input ref={emailRef} type="email" required placeholder="email" />
                            <h4>Email</h4>

                        </label>

                        <label>
                            <input ref={passwordRef} type="password" required placeholder="password" />
                            <h4>Password</h4>
                        </label>

                        <div className={styles.footer}>
                            <button className={[styles.button, error && styles.error].join(' ')} type="submit">Register</button>
                            <span onClick={() => setType('login')}>Already has an account? Login</span>
                        </div>
                    </form>
                }
            </div>
        </>

    )
}
