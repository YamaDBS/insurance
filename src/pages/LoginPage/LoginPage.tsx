import { useAutoAnimate } from '@formkit/auto-animate/react';
import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../App';
import { UserAPI } from '../../api/API';
import Header from '../../components/Header/Header';
import styles from './LoginPage.module.scss';

export default function LoginPage() {

    const { userResponse, setUserResponse } = useContext(UserContext);

    const [success, setSuccess] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const [type, setType] = React.useState<'login' | 'register'>('login');

    const navigate = useNavigate()
    const [parent] = useAutoAnimate()

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const data = new FormData(e.currentTarget);

        const password = data.get('password')?.toString();
        const email = data.get('email')?.toString();

        const userType = data.get('type select')?.toString() as 'is_client' | 'is_agent';

        if (userResponse.user?.status === 'admin') {
            if (!password || !email || !userType) return alert('Fill all fields');

            try {
                const resp = await UserAPI.register(email, password, userType);

                if (resp) setSuccess(true)
            }
            catch (err: any) { setError(err.message) }
        }

        else if (type === 'register') {
            if (!password || !email) return alert('Fill all fields');

            try {
                const resp = await UserAPI.register(email, password, 'is_client');

                if (resp) setType('login')
            }
            catch (err: any) { setError(err.message) }
        }
        else if (type === 'login') {
            if (!email || !password) return alert('Fill all fields');

            try {
                const resp = await UserAPI.login(email, password);

                if (resp) setUserResponse(resp)

                if (resp.user?.status === 'admin') navigate('/')
            }
            catch (err: any) { setError(err.message) }
        }
    }

    useEffect(() => {
        if (error) {
            setSuccess(false)

            setTimeout(() => { setError(null) }, 2000);
        }

        if (success) {
            setError(null)

            setTimeout(() => { setSuccess(false) }, 1000);
        }
    }, [error, success])

    useEffect(() => {
        if (userResponse.user?.status === 'admin') setType('register')
        else if (userResponse.user) navigate('/')
    }, [userResponse])

    return (
        <>
            <Header />

            <div className={styles.page}>

                {type === 'login' &&
                    <form onSubmit={onSubmit} className={styles.form}>
                        <h1>Login</h1>

                        <label >
                            <input type="text" required placeholder="email" name='email' />
                            <h4>Email</h4>

                        </label>

                        <label>
                            <input type="password" required placeholder="password" name='password' />
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
                            <input type="email" required placeholder="email" name='email' />
                            <h4>Email</h4>

                        </label>

                        <label>
                            <input type="password" required placeholder="password" name='password' />
                            <h4>Password</h4>
                        </label>

                        {userResponse.user?.status === 'admin' &&
                            <div className={styles.row}>
                                <label className={styles.radio}>
                                    <input type="radio" name="type select" value="is_client" defaultChecked required />
                                    <p>Client</p>
                                </label>

                                <label className={styles.radio}>
                                    <input type="radio" name="type select" value="is_agent" required />
                                    <p>Agent</p>
                                </label>
                            </div>
                        }

                        <div className={styles.footer} ref={parent}>
                            <button className={[styles.button, error !== null ? styles.error : null, success ? styles.success : null].join(' ')} type="submit">Register</button>
                            {error !== null && <h3 className={styles.error}><p>Error:</p> {error}</h3>}
                            {userResponse.user?.status !== 'admin' && <span onClick={() => setType('login')}>Already has an account? Login</span>}
                        </div>

                    </form>
                }
            </div>
        </>

    )
}
