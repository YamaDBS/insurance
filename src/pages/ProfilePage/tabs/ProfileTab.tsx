import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../../App'
import { API } from '../../../api/API'
import styles from '../../Page.module.scss'

export default function ProfileTab() {
    function getSelectedGender(gender: string) {
        if (user?.gender === gender) return { selected: true }
        return { selected: false }
    }

    const { user, setUser } = useContext(UserContext)

    const [birthDate, setBirthDate] = useState(user?.birth_date || '')

    const [success, setSuccess] = useState<boolean | null>(null)
    const [error, setError] = useState<boolean | null>(null)

    useEffect(() => {
        if (!user) return

        setBirthDate(user?.birth_date || '')
    }, [user])

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        try {
            const formData = new FormData(e.currentTarget)
            const data = Object.fromEntries(formData.entries())

            if (!user) return

            const u = { ...user }

            if (data['first name'] && data['first name'] !== '') u.first_name = data['first name']?.toString()
            if (data['last name'] && data['last name'] !== '') u.last_name = data['last name']?.toString()
            if (data['birthDate'] && data['birthDate'] !== '') u.birth_date = data['birthDate']?.toString()
            if (data['weight'] && data['weight'] !== '') u.weight = Number(data['weight']?.toString())
            if (data['gender'] && data['gender'] !== '') u.gender = data['gender']?.toString()
            if (data['phone number'] && data['phone number'] !== '') u.phone_number = data['phone number']?.toString()
            if (data['email'] && data['email'] !== '') u.email = data['email']?.toString()
            if (data['address'] && data['address'] !== '') u.address = data['address']?.toString()
            if (data['passport number'] && data['passport number'] !== '') u.passport_number = data['passport number']?.toString()
            if (data['profession'] && data['profession'] !== '') u.profession = data['profession']?.toString()
            if (data['month income'] && data['month income'] !== '') u.month_income = Number(data['month income']?.toString() || 0)
            if (data['illness'] && data['illness'] !== '') u.illness = data['illness']?.toString()
            if (data['bad habits'] && data['bad habits'] !== '') u.badHabits = data['bad habits']?.toString()
            if (data['surgical operations'] && data['surgical operations'] !== '') u.surgical_operations = data['surgical operations']?.toString()

            const newUser = await API.updateUser(u)

            if (newUser) setUser(newUser)

            setSuccess(true)
            e.currentTarget.reset()
        }
        catch (err) {
            console.log(err)
            setError(true)
        }
    }

    useEffect(() => {
        if (success) {
            setError(null)

            setTimeout(() => {
                setSuccess(null)
            }, 2000)
        }

        if (error) {
            setSuccess(null)

            setTimeout(() => {
                setError(null)
            }, 2000)
        }
    }, [success, error])

    return (
        <>
            {!!user &&
                <div className={styles.profile}>
                    <form className={styles.info} onSubmit={onSubmit}>
                        <div className={styles.row2}>
                            <label>
                                <input placeholder={user.first_name} type="text" name="first name" />

                                <h4>First name</h4>
                            </label>

                            <label>
                                <input placeholder={user.last_name} type="text" name="last name" />

                                <h4>Last name</h4>
                            </label>
                        </div>

                        <div className={styles.row3}>

                            <label>
                                <input value={birthDate}
                                    onChange={(e) => setBirthDate(e.target.value)}
                                    type="date"
                                    max={new Date().toISOString().split('T')[0]}
                                    min={new Date(new Date().setFullYear(new Date().getFullYear() - 90)).toISOString().split('T')[0]}
                                    name="birthDate" />

                                <h4>Birth date</h4>
                            </label>

                            <label>
                                <select
                                    name="gender">
                                    <option value="" disabled {...getSelectedGender('')} >Gender</option>
                                    <option {...getSelectedGender('male')} value="male">male</option>
                                    <option {...getSelectedGender('female')} value="female">female</option>
                                </select>

                                <h4>Gender</h4>
                            </label>

                            <label>
                                <div className={styles.unit}>kg</div>
                                <input placeholder={String(user.weight || '')} type="number" step="0.5" name="weight" />

                                <h4>Weight</h4>
                            </label>

                        </div>


                        <div className={styles.row3}>
                            <label>
                                <input
                                    placeholder={user.phone_number} type="tel" name="phone number" />

                                <h4>Phone number</h4>
                            </label>

                            <label>
                                <input placeholder={user.email}
                                    type="email" name="email" />

                                <h4>Email</h4>
                            </label>

                            <label>
                                <input placeholder={
                                    user.passport_number ? 'Enter another passport number' : 'Enter your passport number'
                                } type="password" name="passport number" />

                                <h4>Passport number</h4>
                            </label>

                        </div>

                        <div className={styles.row}>
                            <label>
                                <input placeholder={user.address} type="text" name="address" />

                                <h4>Address</h4>
                            </label>
                        </div>


                        <div className={styles.row2}>
                            <label>
                                <input placeholder={user.profession} type="text" name="profession" />

                                <h4>Profession</h4>
                            </label>

                            <label>
                                <div className={styles.unit}>$</div>
                                <input placeholder={String(user.month_income || '')} type="number" name="month income" />

                                <h4>Month income</h4>
                            </label>
                        </div>

                        <div className={styles.row3}>
                            <label>
                                <input placeholder={user.illness} type="text" name="illness" />

                                <h4>Illness</h4>
                            </label>

                            <label>
                                <input placeholder={user.badHabits} type="text" name="bad habits" />

                                <h4>Bad habits</h4>
                            </label>

                            <label>
                                <input placeholder={user.surgical_operations} type="text" name="surgical operations" />

                                <h4>Surgical operations</h4>
                            </label>
                        </div>

                        <button type='submit' className={[styles.update_btn, success && styles.success, error && styles.error].join(' ')}>Update</button>
                    </form>

                </div>
            }
        </>
    )
}
