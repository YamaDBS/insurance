import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { UserContext } from '../../App'
import { InsuranceType } from '../../types/insurance'
import styles from './Header.module.scss'
import ProfileButton from './ProfileButton/ProfileButton'

interface Props {
    setInsuranceType?: React.Dispatch<React.SetStateAction<InsuranceType>>,
    type?: InsuranceType
}

export default function Header({ setInsuranceType, type }: Props) {
    const { user, setUser } = useContext(UserContext)

    return (
        <header>
            <div className={styles.header}>
                <div className={styles.menu}>
                    <Link className={styles.home} to={'/'}>
                        <img src="./img/logo.png" alt="logo" />
                        <h1>Insurance</h1>
                    </Link>

                    <ProfileButton />

                </div>

            </div>
        </header >
    )
}
