import styles from '../Insurance/Insurance.module.scss'

type UserHealthData = {
    illness: string,
    bad_habits: string,
    surgeries: string,
}

type Props = UserHealthData & {
    title?: string,
    updateFields: (fields: Partial<UserHealthData>) => void
}

export default function PersonalHealthForm({ title, bad_habits, illness, surgeries, updateFields }: Props) {

    return (
        <>
            {title !== undefined ? <h1 className={styles.title}>{title}</h1> : null}

            <label>
                <input value={illness}
                    onChange={e => updateFields({ illness: e.target.value })}
                    type="text" name="Illness" />

                <h4>Illness</h4>
            </label>

            <label>
                <input value={bad_habits}
                    onChange={e => updateFields({ bad_habits: e.target.value })}
                    type="text" name="Bad habits" />

                <h4>Bad habits</h4>
            </label>

            <label>
                <input value={surgeries}
                    onChange={e => updateFields({ surgeries: e.target.value })}
                    type="text" name="Surgical operations" />

                <h4>Surgical operations</h4>
            </label>
        </>
    )
}
