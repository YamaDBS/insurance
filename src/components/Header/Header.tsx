import React from 'react'
import { Link } from 'react-router-dom'
import styles from './Header.module.scss'
import ProfileButton from './ProfileButton/ProfileButton'

export default function Header() {

    return (
        <header>
            <div className={styles.header}>
                <div className={styles.menu}>
                    <Link className={styles.home} to={'/'}>
                        <img src="/img/logo.png" alt="logo" />
                        <h1>Insurance</h1>
                    </Link>

                    <ProfileButton />

                </div>

            </div>
        </header >
    )
}
