import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { UserContext } from '../../../App'
import styles from './ProfileButton.module.scss'

export default function ProfileButton() {
    const { userResponse } = useContext(UserContext)
    const { user } = userResponse

    return (
        <>
            {user ?
                <Link to={'/profile'} className={styles.profile} >
                    <img src="/img/ico/user.png" alt="user" />
                    {user.last_name}
                    <p>({user.status})</p>
                    {/* TODO: delete status */}
                </Link >
                :
                <Link to={'/login'} className={styles.profile}>Login</Link>
            }
        </>
    )
}
