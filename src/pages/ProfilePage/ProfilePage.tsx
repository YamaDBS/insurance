import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../../App'
import Header from '../../components/Header/Header'
import styles from '../Page.module.scss'
import InsurancesTab from './tabs/InsurancesTab'
import ProfileTab from './tabs/ProfileTab'
import UsersTab from './tabs/UsersTab'

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
                name: 'profile',
                icon: 'user.png'
            },
            {
                name: 'insurances',
                icon: 'file.png'
            },
            {
                name: 'users',
                icon: 'people.png'
            }
        ],
    },
    admin: {
        tabs: [
            {
                name: 'profile',
                icon: 'user.png'
            },
            {
                name: 'insurances',
                icon: 'file.png'
            },
            {
                name: 'users',
                icon: 'people.png'
            },
            {
                name: 'agents',
                icon: 'work.svg'
            }
        ],
    },
}

export default function ProfilePage() {
    const [currentPage, setCurrentPage] = useState('profile')
    const { user, setUser } = useContext(UserContext)

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

                        <select style={{ marginTop: 'auto' }} name="user" id="user"
                            onChange={e => {
                                if (e.currentTarget.value === 'admin'
                                    || e.currentTarget.value === 'agent'
                                    || e.currentTarget.value === 'user'
                                )
                                    setUser({ ...user, status: e.currentTarget.value })
                            }}
                        >
                            <option value="">Change user type</option>
                            <option value="user">User</option>
                            <option value="agent">Agent</option>
                            <option value="admin">Admin</option>
                        </select>

                        <button className={styles.logout} type='button' onClick={() => {
                            setUser(null)
                            navigate('/')
                        }}>
                            <img src="./img/ico/logout.png" alt="logout" />
                            <p>Logout</p>
                        </button>
                    </aside>

                    <main className={styles.main}>
                        {currentPage === 'profile' && <ProfileTab />}
                        {currentPage === 'insurances' && <InsurancesTab />}
                        {user.status === 'agent' && currentPage === 'users' && <UsersTab />}
                    </main>
                </div >
            }
        </>
    )
}
