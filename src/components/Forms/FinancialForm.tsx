import styles from '../Insurance/Insurance.module.scss'

type UserFinancialData = {
    profession: string,
    income: number,
}

type Props = UserFinancialData & {
    title?: string,
    updateFields: (fields: Partial<UserFinancialData>) => void
}

export default function FinancialForm({ title, income, profession, updateFields }: Props) {

    return (
        <>
            {title !== undefined ? <h1 className={styles.title}>{title}</h1> : null}

            <div className={styles.row}>
                <label>
                    <input value={profession}
                        onChange={e => updateFields({ profession: e.target.value })}
                        required type="text" name="profession" />

                    <h4>Profession</h4>
                </label>

                <label>
                    <div className={styles.unit}>$</div>
                    <input value={income}
                        onChange={e => updateFields({ income: Number(e.target.value || 0) })}
                        required type="text" name="Month income" />

                    <h4>Month income</h4>
                </label>
            </div>
        </>
    )
}
