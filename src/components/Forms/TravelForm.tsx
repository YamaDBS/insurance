import { useEffect, useState } from 'react'
import styles from '../Insurance/Insurance.module.scss'
import { calculateCoverage } from '../Insurance/TravelInsurance'
import TravelersSelect from '../TravelersSelect/TravelersSelect'

export type TravelData = {
    start_date: string,
    end_date: string,
    country: string,
    travelers: {
        adults: number,
        children: number,
        seniors: number,
    },
    coverage: number,
    travel_type: string,
    name: string,
}

type Props = TravelData & {
    title?: string,
    updateFields: (fields: Partial<TravelData>) => void
}

export default function TravelForm({ title, country, end_date, travel_type, start_date, travelers, name, updateFields }: Props) {

    function getMaxDate() {
        if (end_date !== '') return new Date(end_date).toISOString().split('T')[0]
        else return new Date(new Date().setFullYear(new Date().getFullYear() + 2)).toISOString().split('T')[0]
    }

    function getMinDate() {
        if (start_date === '') return new Date().toISOString().split('T')[0]
        else return new Date(start_date).toISOString().split('T')[0]
    }

    const [travelersAmount, setTravelersAmount] = useState(travelers)

    useEffect(() => {
        updateTravelersAmount()
    }, [travelersAmount.adults, travelersAmount.children, travelersAmount.seniors])

    function updateTravelersAmount() {
        const { adults, children, seniors } = travelersAmount

        updateFields({ travelers: { adults, children, seniors } })
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
                        max={new Date(new Date(getMinDate()).setFullYear(new Date(getMinDate()).getFullYear() + 2)).toISOString().split('T')[0]}
                        min={getMinDate()}
                        name="end date" />

                    <h4>End date</h4>
                </label>


                <label>
                    <select value={travel_type}
                        onChange={e => updateFields({ travel_type: e.target.value })}
                        required name="Travel type"  >
                        <option value="" disabled selected>Travel type</option>
                        <option value="standard">Just traveling</option>
                        <option value="work">Work</option>
                        <option value="active">Active</option>
                        <option value="extreme">Extreme</option>
                        <option value="other">Other</option>
                    </select>

                    <h4>Travel type</h4>
                </label>

                <label >
                    <div className={styles.row}>
                        <TravelersSelect travelers={travelers}
                            max={{ adults: 5, children: 3, seniors: 5 }}
                            min={{ adults: 1, children: 0, seniors: 0 }}
                            setTravelersAmount={setTravelersAmount}
                        />
                    </div>

                    <h4>Travelers <span style={{ color: 'red' }}>*</span></h4>
                </label>

            </div>

            <div className={styles.row}>

                <label>
                    <select value={country}
                        onChange={e => updateFields({ country: e.target.value })}
                        required name="country"  >
                        <option value="" disabled selected>Select country</option>
                        <option value="USA">USA</option>
                        <option value="Canada">Canada</option>
                        <option value="Mexico">Mexico</option>
                        <option value="EU">Europe (Any EU country) </option>
                        <option value="China">China</option>
                        <option value="Japan">Japan</option>
                        <option value="Australia">Australia</option>
                        <option value="Turkey">Turkey</option>
                        <option value="Egypt">Egypt</option>
                        <option value="Israel">Israel</option>
                        <option value="South Africa">South Africa</option>
                    </select>

                    <h4>Country</h4>
                </label>


                <label>
                    <select
                        onChange={e => updateFields({ coverage: Number(e.target.value) })}
                        required name="coverage"  >
                        <option value="" disabled selected>Select coverage</option>

                        {calculateCoverage({ travelers, country, travel_type })?.map((coverage, i) =>
                            <option key={coverage + i} value={coverage}>${coverage}.00</option>)
                        }

                    </select>

                    <h4>Coverage</h4>
                </label>
            </div>
        </>
    )
}
