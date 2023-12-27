import React, { FormEvent, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserContext, UserInsurancesContext } from '../../App'
import { API, InsuranceAPI } from '../../api/API'
import useMultistepForm from '../../hooks/useMultistepForm'
import { InsuranceStatus, InsuranceType } from '../../types/insurance'
import TravelForm, { TravelData } from '../Forms/TravelForm'
import styles from './Insurance.module.scss'
import InsuranceInfo from './InsuranceInfo'

const INITIAL_DATA = {
    start_date: '',
    end_date: '',
    country: '',
    travelers: {
        adults: 0,
        children: 0,
        seniors: 0,
    },
    travel_type: '',
    coverage: 0,
    price: 0,
    name: '',
}

const TravelInsuranceCoverage = {
    "": [],
    "EU": [3000, 6000, 10000, 20000],
    'USA': [5000, 10000, 20000, 30000],
    'Mexico': [5000, 10000, 20000, 30000],
    'Canada': [5000, 10000, 20000, 30000],
    'China': [5000, 10000, 20000, 30000],
    'Japan': [5000, 10000, 20000, 30000],
    'Australia': [5000, 10000, 20000, 30000],
    'Turkey': [5000, 10000, 20000, 30000],
    'Egypt': [5000, 10000, 20000, 30000],
    'Israel': [5000, 10000, 20000, 30000],
    'South Africa': [5000, 10000, 20000, 30000],
}

const TravelInsuranceTypeKoefs = {
    'standard': 1,
    'work': 1.5,
    'active': 2,
    'extreme': 3,
    'other': 1,
}

export function calculateCoverage(data: {
    travelers: {
        adults: number,
        children: number,
        seniors: number,
    },
    country: string,
    travel_type: string,
}) {
    const { adults, children, seniors } = data.travelers
    const { country, travel_type } = data

    if (!country || adults + children + seniors === 0 || !travel_type) return []

    const standardCoverage = TravelInsuranceCoverage[country as keyof typeof TravelInsuranceCoverage]

    const coverage = standardCoverage.map(coverage => coverage * (adults + children * 0.5 + seniors * 0.5) * TravelInsuranceTypeKoefs[travel_type as keyof typeof TravelInsuranceTypeKoefs])

    return coverage.map(coverage => Math.round(coverage))
}

function calculatePrice(data: {
    start_date: string,
    end_date: string,
    travelers: {
        adults: number,
        children: number,
        seniors: number,
    },
    coverage: number,
}) {
    const { adults, children, seniors } = data.travelers
    const { coverage, end_date, start_date } = data

    const peopleKoef = adults * 1 + children * 0.5 + seniors * 0.5

    const days = (new Date(end_date).getTime() - new Date(start_date).getTime()) / (1000 * 3600 * 24)

    const price = (peopleKoef * 0.2) * coverage / 100 * days

    return Math.round(price)
}

export default function TravelInsurance() {
    const [data, setData] = useState(INITIAL_DATA)

    const { userResponse } = useContext(UserContext)
    const { user, error } = userResponse

    const navigate = useNavigate()

    const [isOrdering, setIsOrdering] = useState(false)

    function updateFields(fields: Partial<typeof INITIAL_DATA>) {
        setData(prev => ({ ...prev, ...fields }))
    }

    const { next, prev, reset, step, isFirstStep, isLastStep } = useMultistepForm([
        <TravelForm {...data} title='Travel information' updateFields={updateFields} />
    ])

    function isOrderingToggle() {
        if (!user) {
            navigate('/login')
        } else if (user.status === 'admin' || user.status === 'agent') {
            alert('You can not order insurance as admin or agent')
            setIsOrdering(false)
        } else {
            setIsOrdering(true)
        }
    }

    async function onSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()

        if (isLastStep && data.travelers.adults + data.travelers.children + data.travelers.seniors > 0) {
            let numberError = "insurance with this number already exists."

            const { adults, children, seniors } = data.travelers
            let description = 'Travel to: ' + data.country + '\n'

            description += 'For:'

            if (adults > 0) description += ' ' + adults + ' adults,'
            if (children > 0) description += ' ' + children + ' children,'
            if (seniors > 0) description += ' ' + seniors + ' seniors,'

            do {
                try {
                    const result = await InsuranceAPI.createInsurance({
                        name: data.name,
                        description: description,
                        number: "",

                        coverage: data.coverage,
                        price: calculatePrice(data),

                        start_date: data.start_date,
                        end_date: data.end_date,

                        status: InsuranceStatus.NEW,
                        type: InsuranceType.Travel,
                    })

                    if (result.error) throw new Error(result.error)
                    else {
                        numberError = ''
                        alert('Insurance added successfully')
                    }

                    setIsOrdering(false)
                    reset()
                    setData(INITIAL_DATA)

                } catch (error: any) {
                    if (error.message !== "insurance with this number already exists.") {
                        alert(error.message)
                        break
                    }
                }
            } while (numberError === "insurance with this number already exists.")

        } else if (data.travelers.adults + data.travelers.children + data.travelers.seniors <= 0) {
            alert('Please select travelers')
        }
        else next()
    }

    return (
        <div className={styles.wrapper} >
            <div className={styles.side_info}>
                <h1 className={styles.title}>Travel Insurance</h1>

                <img className={styles.img} src="/img/travel.jpg" alt="travel" />

                <div className={styles.info}>

                    <h3>Why travel insurance?</h3>
                    <p>
                        Travel insurance is a type of insurance that covers the costs and losses associated with traveling. It is useful protection for those traveling domestically or abroad.
                    </p>

                </div>


            </div>

            {!isOrdering ?
                <InsuranceInfo items={[
                    <p><span>COVID-19</span> - амбулаторна допомога <span>1 000 євро</span>, невідкладна та стаціонар - <span>30 000 євро</span></p>,
                    <p>Невідкладна медична допомога до <span>30 000 євро</span></p>,
                    <p>Невідкладна стоматологічна допомога</p>
                ]}
                    orderBtn={<button className={styles.form_btn} onClick={isOrderingToggle}>Order now</button>} />
                :
                <form className={styles.form} onSubmit={onSubmit}>
                    {step}

                    <div className={styles.row}>
                        {isFirstStep && <button className={styles.form_btn} type='button' style={{ marginRight: 'auto' }} onClick={() => setIsOrdering(false)}>Back</button>}
                        {!isFirstStep && <button className={styles.form_btn} type='button' style={{ marginRight: 'auto' }} onClick={prev}>Back</button>}
                        {!isLastStep && <button className={styles.form_btn} style={{ marginLeft: 'auto' }} type='submit'>Next</button>}
                        <div className={styles.price}>
                            Price: <span>${calculatePrice(data) || 0}</span>
                        </div>
                        {isLastStep && <button className={[styles.form_btn, styles.submit_bth].join(' ')} type='submit'>Submit</button>}
                    </div>
                </form >
            }
        </div>
    )
}
