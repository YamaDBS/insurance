import React, { FormEvent, useContext, useState } from 'react'
import { UserContext, UserInsurancesContext } from '../../App'
import useMultistepForm from '../../hooks/useMultistepForm'
import { InsuranceStatus, InsuranceType } from '../../types/insurance'
import TravelForm from '../Forms/TravelForm'
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
}

export default function TravelInsurance() {
    const [data, setData] = useState(INITIAL_DATA)

    const { user } = useContext(UserContext)
    const { userInsurances, setUserInsurances } = useContext(UserInsurancesContext)

    const [isOrdering, setIsOrdering] = useState(false)

    function updateFields(fields: Partial<typeof INITIAL_DATA>) {
        setData(prev => ({ ...prev, ...fields }))
    }

    const { next, prev, reset, step, isFirstStep, isLastStep } = useMultistepForm([
        <TravelForm {...data} title='Travel information' updateFields={updateFields} />
    ])

    function onSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()

        if (isLastStep && data.travelers.adults + data.travelers.children + data.travelers.seniors > 0) {
            if (user) {
                setUserInsurances(prev => [...prev, {
                    agent_id: null,
                    coverage: 10000,
                    creation_date: new Date().toISOString().split('T')[0],
                    description: 'Travel to ' + data.country,
                    end_date: data.end_date,
                    id: userInsurances.length + 1,
                    price: 1000,
                    start_date: data.start_date,
                    status: InsuranceStatus.NEW,
                    title: 'Travel insurance',
                    type: InsuranceType.Travel,
                    user_id: user.id,
                }])

                setIsOrdering(false)
                reset()
                setData(INITIAL_DATA)
                e.currentTarget.reset()

                alert('Insurance added successfully')
            }
        } else if (data.travelers.adults + data.travelers.children + data.travelers.seniors <= 0) {
            alert('Please select travelers')
        }
        else next()
    }

    return (
        <div className={styles.wrapper} >
            <div className={styles.side_info}>
                <h1 className={styles.title}>Travel Insurance</h1>

                <img className={styles.img} src="./img/travel.jpg" alt="travel" />

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
                    orderBtn={<button className={styles.form_btn} onClick={() => setIsOrdering(true)}>Order now</button>} />
                :
                <form className={styles.form} onSubmit={onSubmit}>
                    {step}

                    <div className={styles.row}>
                        {isFirstStep && <button className={styles.form_btn} type='button' style={{ marginRight: 'auto' }} onClick={() => setIsOrdering(false)}>Back</button>}
                        {!isFirstStep && <button className={styles.form_btn} type='button' style={{ marginRight: 'auto' }} onClick={prev}>Back</button>}
                        {!isLastStep && <button className={styles.form_btn} style={{ marginLeft: 'auto' }} type='submit'>Next</button>}
                        {isLastStep && <button className={[styles.form_btn, styles.submit_bth].join(' ')} type='submit'>Submit</button>}
                    </div>
                </form >
            }
        </div>
    )
}
