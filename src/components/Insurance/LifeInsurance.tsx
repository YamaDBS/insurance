import { FormEvent, useContext, useState } from 'react'
import { UserContext, UserInsurancesContext } from '../../App'
import useMultistepForm from '../../hooks/useMultistepForm'
import { InsuranceStatus, InsuranceType } from '../../types/insurance'
import ContactInformationForm from '../Forms/ContactForm'
import FinancialDataForm from '../Forms/FinancialForm'
import PersonalDataForm from '../Forms/PersonalForm'
import PersonalHealthForm from '../Forms/PersonalHealthForm'
import styles from './Insurance.module.scss'
import InsuranceInfo from './InsuranceInfo'

const INITIAL_DATA = {
    firstName: '',
    lastName: '',
    birthDate: '',
    weight: '',
    gender: '',
    badHabits: '',
    illness: '',
    phone_number: '',
    email: '',
    address: '',
    passport_number: '',
    profession: '',
    month_income: '',
    surgical_operations: '',
}

export default function LifeInsurance() {
    const [data, setData] = useState(INITIAL_DATA)

    const [isOrdering, setIsOrdering] = useState(false)

    function updateFields(fields: Partial<typeof INITIAL_DATA>) {
        setData(prev => ({ ...prev, ...fields }))
    }

    const { next, prev, step, reset, isFirstStep, isLastStep } = useMultistepForm([
        <PersonalDataForm title='Personal info' {...data} updateFields={updateFields} />,
        <PersonalHealthForm title='Health info' {...data} updateFields={updateFields} />,
        <ContactInformationForm title='Contact info' {...data} updateFields={updateFields} />,
        <FinancialDataForm title='Financial info' {...data} updateFields={updateFields} />
    ])

    const { user } = useContext(UserContext)
    const { userInsurances, setUserInsurances } = useContext(UserInsurancesContext)

    function onSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()

        if (isLastStep) {
            console.log(data)

            if (user) {
                setUserInsurances(prev => [...prev, {
                    agent_id: null,
                    coverage: 10000,
                    creation_date: new Date().toISOString().split('T')[0],
                    description: 'Life insurance',
                    end_date: '',
                    id: userInsurances.length + 1,
                    price: 1000,
                    start_date: new Date().toISOString().split('T')[0],
                    status: InsuranceStatus.NEW,
                    title: data.firstName + ' ' + data.lastName + ' insurance',
                    type: InsuranceType.Life,
                    user_id: user.id,
                }])

                setIsOrdering(false)
                reset()
                setData(INITIAL_DATA)
                e.currentTarget.reset()

                alert('Insurance added successfully')
            }

        } else next()

    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.side_info}>
                <h1 className={styles.title}>Life Insurance</h1>
                <img className={styles.img} src="./img/human.jpg" alt="human" />

                <div className={styles.info}>

                    <h3>Why Life Insurance?</h3>

                    <p>
                        Life insurance is a contract between an insurer and a policyholder in which the insurer guarantees payment of a death benefit to named beneficiaries upon the death of the insured. The insurance company promises a death benefit in consideration of the payment of premium by the insured.
                    </p>

                </div>

            </div>

            {
                !isOrdering ?
                    <InsuranceInfo items={[
                        <p><span>COVID-19</span> - амбулаторна допомога <span>1 000 євро</span>, невідкладна та стаціонар - <span>30 000 євро</span></p>,
                        <p>Невідкладна медична допомога до <span>30 000 євро</span></p>,
                        <p>Невідкладна стоматологічна допомога</p>
                    ]}
                        orderBtn={<button className={styles.form_btn} onClick={() => setIsOrdering(true)}>Order now</button>}
                    />
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
        </div >
    )
}
