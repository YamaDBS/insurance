import styles from '../Insurance/Insurance.module.scss'

type UserData = {
    firstName: string,
    lastName: string,
    birthDate: string,
    weight: string,
    gender: string,
}

type Props = UserData & {
    title?: string,
    updateFields: (fields: Partial<UserData>) => void
}

export default function PersonalForm({ title, birthDate, firstName, gender, lastName, weight, updateFields }: Props) {

    return (
        <>
            {title !== undefined ? <h1 className={styles.title}>{title}</h1> : null}

            <label>
                <input value={firstName}
                    onChange={e => updateFields({ firstName: e.target.value })}
                    required type="text" name="first name" />

                <h4>First name</h4>
            </label>

            <label>

                <input value={lastName}
                    onChange={e => updateFields({ lastName: e.target.value })}
                    required type="text" name="last name" />

                <h4>Last name</h4>
            </label>


            <div className={styles.row}>

                <label>
                    <input value={birthDate}
                        onChange={e => updateFields({ birthDate: e.target.value })}
                        required type="date"
                        max={new Date().toISOString().split('T')[0]}
                        min={new Date(new Date().setFullYear(new Date().getFullYear() - 90)).toISOString().split('T')[0]}
                        name="birthDate" />

                    <h4>Birth date</h4>
                </label>
                <label>
                    <div className={styles.unit}>kg</div>
                    <input value={weight}
                        onChange={e => updateFields({ weight: e.target.value })}
                        required type="number" step="0.5" name="weight" />

                    <h4>Weight</h4>
                </label>

                <label>
                    <select value={gender}
                        onChange={e => updateFields({ gender: e.target.value })}
                        required name="gender"  >
                        <option value="" disabled selected>Gender</option>
                        <option value="male">male</option>
                        <option value="female">female</option>
                    </select>

                    <h4>Gender</h4>
                </label>

            </div>
        </>
    )
}
