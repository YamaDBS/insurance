import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../../App'
import Header from '../../components/Header/Header'
import LoginPage from '../LoginPage/LoginPage'
import styles from '../Page.module.scss'
import ClientsTab from './tabs/ClientsTab'
import InsurancesTab from './tabs/InsurancesTab'
import ProfileTab from './tabs/ProfileTab'

const tabs = {
    user: {
        tabs: [
            {
                name: 'profile',
                icon: 'user.png'
            },
            {
                name: 'insurances',
                icon: 'file.png'
            }
        ]
    },
    agent: {
        tabs: [
            {
                name: 'insurances',
                icon: 'file.png'
            },
            {
                name: 'clients',
                icon: 'people.png'
            }
        ],
    },
    admin: {
        tabs: [
            {
                name: 'insurances',
                icon: 'file.png'
            },
            {
                name: 'users',
                icon: 'people.png'
            },
            {
                name: 'add user',
                icon: 'add_client.svg'
            }
        ],
    }
}

export default function ProfilePage() {
    const [currentPage, setCurrentPage] = useState('profile')
    const { userResponse, setUserResponse } = useContext(UserContext)

    const { user, error } = userResponse

    useEffect(() => {
        if (user?.status === 'admin') setCurrentPage('insurances')
        if (user?.status === 'agent') setCurrentPage('clients')
    }, [user])

    const navigate = useNavigate()

    return (
        <>
            <Header />

            {user &&
                <div className={styles.page}>
                    <aside className={styles.sidebar}>
                        <menu>
                            <ul>
                                {tabs[user.status].tabs.map((tab) =>
                                    <li key={tab.name}
                                        onClick={() => setCurrentPage(tab.name)}
                                        className={tab.name === currentPage ? styles.active : ''}>

                                        <img src={"./img/ico/" + tab.icon} alt={tab.name} />
                                        <p>{tab.name}</p>
                                    </li>
                                )}
                            </ul>
                        </menu>

                        <button className={styles.logout} type='button' onClick={() => {
                            setUserResponse({ user: null, error: null })
                            navigate('/')
                        }}>
                            <img src="/img/ico/logout.png" alt="logout" />
                            <p>Logout</p>
                        </button>
                    </aside>

                    <main className={styles.main}>
                        {user.status === 'user' && currentPage === 'profile' && <ProfileTab userResponse={userResponse} setUserResponse={setUserResponse} />}
                        {currentPage === 'insurances' && <InsurancesTab />}
                        {(user.status === 'agent' || user.status === 'admin') && (currentPage === 'clients' || currentPage === 'users') && <ClientsTab />}
                        {user.status === 'admin' && currentPage === 'add user' && <LoginPage />}
                    </main>
                </div >
            }
        </>
    )
}
