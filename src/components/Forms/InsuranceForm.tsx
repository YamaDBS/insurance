import { useEffect } from 'react'
import styles from '../Insurance/Insurance.module.scss'

type InsuranceData = {
    name: string,

    start_date: string,
    end_date: string,

    coverage: number,
}

type Props = InsuranceData & {
    title?: string,
    updateFields: (fields: Partial<InsuranceData>) => void,
    coverageOptions: () => number[],
    name: string,
    start_date: string,
    end_date: string,
}

export default function InsuranceForm({ title, name, start_date, end_date, updateFields, coverageOptions }: Props) {

    function getMaxDate() {
        if (end_date !== '') return new Date(end_date).toISOString().split('T')[0]
        else return new Date(new Date().setFullYear(new Date().getFullYear() + 2)).toISOString().split('T')[0]
    }

    function getMinDate() {
        if (start_date === '') return new Date().toISOString().split('T')[0]
        else return new Date(start_date).toISOString().split('T')[0]
    }

    return (
        <>
            {title !== undefined ? <h1 className={styles.title}>{title}</h1> : null}

            <label>
                <input value={name}
                    onChange={e => updateFields({ name: e.target.value })}
                    required type="text"
                    name="name" />

                <h4>Name your insurance</h4>
            </label>

            <div className={styles.row}>

                <label>
                    <input value={start_date}
                        onChange={e => updateFields({ start_date: e.target.value })}
                        required type="date"
                        max={getMaxDate()}
                        min={new Date().toISOString().split('T')[0]}
                        name="start date" />

                    <h4>Start date</h4>
                </label>

                <label>
                    <input value={end_date}
                        onChange={e => updateFields({ end_date: e.target.value })}
                        required type="date"
                        max={new Date(new Date(getMinDate()).setFullYear(new Date(getMinDate()).getFullYear() + 100)).toISOString().split('T')[0]}
                        min={getMinDate()}
                        name="end date" />

                    <h4>End date</h4>
                </label>
            </div>


            <div className={styles.row}>
                <label>
                    <select
                        onChange={e => updateFields({ coverage: Number(e.target.value) })}
                        required name="coverage"  >
                        <option value="" disabled selected>Select coverage</option>
                        {coverageOptions().map((option, index) => <option key={index + option} value={option}>${option}.00</option>)}
                    </select>

                    <h4>Coverage</h4>
                </label>
            </div>

        </>
    )
}
