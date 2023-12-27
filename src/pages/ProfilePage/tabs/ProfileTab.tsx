import { useAutoAnimate } from '@formkit/auto-animate/react'
import React, { createRef, useContext, useEffect, useState } from 'react'
import { UserContext } from '../../../App'
import { UserAPI } from '../../../api/API'
import { SEX, User, UserResponse } from '../../../types/user'
import styles from '../../Page.module.scss'

interface Props {
    userResponse: UserResponse
    setUserResponse?: React.Dispatch<React.SetStateAction<UserResponse>>
}

export default function ProfileTab({ userResponse, setUserResponse }: Props) {
    const { userResponse: currentUser, setUserResponse: setCurrentUser } = useContext(UserContext)

    const { user, error } = userResponse

    const [parent] = useAutoAnimate()

    function getSelectedGender(sex: string) {
        if (user?.sex === sex) return { selected: true }
        return { selected: false }
    }

    const [birthDate, setBirthDate] = useState(user?.birth_date || '')

    const [formSuccess, setFormSuccess] = useState<boolean | null>(null)
    const [formError, setFormError] = useState<boolean | null>(null)

    const formRef = createRef<HTMLFormElement>()

    const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false)

    function isClientEditing() {
        return user?.id === currentUser.user?.id
    }

    useEffect(() => {
        if (!user) return

        setBirthDate(user.birth_date || '')
    }, [user])

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        try {
            const formData = new FormData(e.currentTarget)
            const data = Object.fromEntries(formData.entries())

            if (!user) return

            const u: User = { ...user }

            if (data['first name'] && data['first name'] !== '') u.first_name = data['first name']?.toString()
            if (data['last name'] && data['last name'] !== '') u.last_name = data['last name']?.toString()
            if (data['birthDate'] && data['birthDate'] !== '') u.birth_date = data['birthDate']?.toString()
            if (data['weight'] && data['weight'] !== '') u.weight = Number(data['weight']?.toString())
            if (data['sex'] && data['sex'] !== '') u.sex = data['sex']?.toString() as SEX
            if (data['phone number'] && data['phone number'] !== '') u.phone_number = data['phone number']?.toString()
            if (data['email'] && data['email'] !== '') u.email = data['email']?.toString()
            if (data['address'] && data['address'] !== '') u.address = data['address']?.toString()
            if (data['passport number'] && data['passport number'] !== '') u.passport_number = data['passport number']?.toString()
            if (data['profession'] && data['profession'] !== '') u.profession = data['profession']?.toString()
            if (data['month income'] && data['month income'] !== '') u.income = Number(data['month income']?.toString() || 0)
            if (data['illness'] && data['illness'] !== '') u.illness = data['illness']?.toString()
            if (data['bad habits'] && data['bad habits'] !== '') u.bad_habits = data['bad habits']?.toString()
            if (data['surgical operations'] && data['surgical operations'] !== '') u.surgeries = data['surgical operations']?.toString()

            let password: string | undefined = undefined
            if (data['password'] && data['password'] !== '') password = data['password']?.toString()

            let resp: UserResponse = { error: null, user: null }

            if (isClientEditing()) {
                resp = await UserAPI.updateClientSelf(u, password)
            }
            else resp = await UserAPI.updateClient(u)

            if (resp.error) throw new Error(resp.error)
            if (setUserResponse !== undefined) setUserResponse(resp)

            setFormSuccess(true)
        }
        catch (err: any) {
            setFormError(true)
        } finally {
            formRef.current?.reset()
        }
    }

    useEffect(() => {
        if (formSuccess) {
            setFormError(null)

            setTimeout(() => {
                setFormSuccess(null)
            }, 2000)
        }

        if (formError) {
            setFormSuccess(null)

            setTimeout(() => {
                setFormError(null)
            }, 2000)
        }
    }, [formSuccess, formError])

    return (
        <>
            {user &&
                <div className={styles.profile}>
                    <form className={styles.info} onSubmit={onSubmit} ref={formRef}>
                        <div className={isClientEditing() ? styles.row5 : styles.row4}>
                            <label>
                                {isClientEditing() ?
                                    <input placeholder={user.first_name} type="text" name="first name" />
                                    :
                                    <p>{user.first_name}</p>
                                }

                                <h4>First name</h4>
                            </label>

                            <label>
                                {isClientEditing() ?
                                    <input placeholder={user.last_name} type="text" name="last name" />
                                    :
                                    <p>{user.last_name}</p>
                                }

                                <h4>Last name</h4>
                            </label>

                            <label>
                                <input placeholder={user.phone_number} type="tel" name="phone number" />

                                <h4>Phone number</h4>
                            </label>

                            {isClientEditing() &&
                                <label>
                                    <input placeholder={user.email} type="email" name="email" onChange={(e) => { e.currentTarget.value.length !== 0 ? setIsPasswordVisible(true) : setIsPasswordVisible(false) }} />

                                    <h4>Email</h4>
                                </label>
                            }

                            <label>
                                <input placeholder={user.passport_number} type="password" name="passport number" />

                                <h4>Passport number</h4>
                            </label>
                        </div>

                        <div className={styles.row5}>

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
                                    name="sex">
                                    <option value="" disabled {...getSelectedGender('')} >Gender</option>
                                    <option {...getSelectedGender('Male')} value="Male">male</option>
                                    <option {...getSelectedGender('Female')} value="Female">female</option>
                                </select>

                                <h4>Gender</h4>
                            </label>

                            <label>
                                <div className={styles.unit}>kg</div>
                                <input placeholder={String(user.weight || '')} type="number" step="0.5" name="weight" />

                                <h4>Weight</h4>
                            </label>
                            <label>
                                <input placeholder={user.profession} type="text" name="profession" />

                                <h4>Profession</h4>
                            </label>

                            <label>
                                <div className={styles.unit}>$</div>
                                <input placeholder={String(user.income || '')} type="number" name="month income" />

                                <h4>Month income</h4>
                            </label>
                        </div>

                        <div className={styles.row}>
                            <label>
                                <input placeholder={user.address} type="text" name="address" />

                                <h4>Address</h4>
                            </label>
                        </div>

                        <div className={styles.row3}>
                            <label>
                                <input placeholder={user.illness} type="text" name="illness" />

                                <h4>Illness</h4>
                            </label>

                            <label>
                                <input placeholder={user.bad_habits} type="text" name="bad habits" />

                                <h4>Bad habits</h4>
                            </label>

                            <label>
                                <input placeholder={user.surgeries} type="text" name="surgical operations" />

                                <h4>Surgical operations</h4>
                            </label>
                        </div>

                        <div className={styles.submit} ref={parent}>
                            {isPasswordVisible &&
                                <label>
                                    <input type="password" required placeholder='Your password' name='password' />

                                    <h4>Password</h4>
                                </label>
                            }

                            <button type='submit' className={[styles.update_btn, formSuccess && styles.success, formError && styles.error].join(' ')}>Update</button>
                        </div>
                    </form>

                </div>
            }

        </>
    )
}
