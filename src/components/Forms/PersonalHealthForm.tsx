import styles from '../Insurance/Insurance.module.scss'

type UserHealthData = {
    illness: string,
    badHabits: string,
    surgical_operations: string,
}

type Props = UserHealthData & {
    title?: string,
    updateFields: (fields: Partial<UserHealthData>) => void
}

export default function PersonalHealthForm({ title, badHabits, illness, surgical_operations, updateFields }: Props) {

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
                <input value={badHabits}
                    onChange={e => updateFields({ badHabits: e.target.value })}
                    type="text" name="Bad habits" />

                <h4>Bad habits</h4>
            </label>

            <label>
                <input value={surgical_operations}
                    onChange={e => updateFields({ surgical_operations: e.target.value })}
                    type="text" name="Surgical operations" />

                <h4>Surgical operations</h4>
            </label>
        </>
    )
}
