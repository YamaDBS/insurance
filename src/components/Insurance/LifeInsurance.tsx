import { FormEvent, memo, useContext, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserContext, UserInsurancesContext } from '../../App'
import { API, InsuranceAPI } from '../../api/API'
import useMultistepForm from '../../hooks/useMultistepForm'
import { InsuranceStatus, InsuranceType } from '../../types/insurance'
import ContactInformationForm from '../Forms/ContactForm'
import FinancialDataForm from '../Forms/FinancialForm'
import InsuranceForm from '../Forms/InsuranceForm'
import PersonalDataForm from '../Forms/PersonalForm'
import PersonalHealthForm from '../Forms/PersonalHealthForm'
import styles from './Insurance.module.scss'
import InsuranceInfo from './InsuranceInfo'

const INITIAL_DATA = {
    name: '',
    start_date: '',
    end_date: '',
    coverage: 0,
    price: 0,

    firstName: '',
    lastName: '',
    birthDate: '',
    weight: 0,
    sex: '',
    bad_habits: '',
    illness: '',
    phone_number: '',
    email: '',
    address: '',
    passport_number: '',
    profession: '',
    income: 0,
    surgeries: '',
}

function calculatePrice(data: typeof INITIAL_DATA) {
    const { coverage } = data

    return Math.round(coverage * 0.2)
}

export default function LifeInsurance() {
    const [data, setData] = useState(INITIAL_DATA)

    const [isOrdering, setIsOrdering] = useState(false)
    const { userResponse } = useContext(UserContext)
    const { user, error } = userResponse

    function updateFields(fields: Partial<typeof INITIAL_DATA>) {
        setData(prev => ({ ...prev, ...fields }))
    }

    useEffect(() => {
        if (user) {
            setData(prev => ({
                ...prev,
                address: user.address || '',
                email: user.email || '',
                firstName: user.first_name || '',
                lastName: user.last_name || '',
                phone_number: user.phone_number || '',
                passport_number: user.passport_number || '',
                profession: user.profession || '',
                income: user.income || 0,
                bad_habits: user.bad_habits || '',
                illness: user.illness || '',
                surgeries: user.surgeries || '',
                birthDate: user.birth_date || '',
                sex: user.sex || '',
                weight: user.weight || 0,
            }))
        }
    }, [])

    function calculateCoverage(): number[] {
        const age = new Date().getFullYear() - new Date(data.birthDate).getFullYear() || 18
        const income = data.income || 250
        const start_date = new Date(data.start_date || new Date().toISOString().split('T')[0])
        const end_date = new Date(data.end_date || new Date().toISOString().split('T')[0])

        const delta_month = (end_date.getFullYear() - start_date.getFullYear()) * 12 + (end_date.getMonth() - start_date.getMonth())

        let coverage = 0

        if (age < 18) {
            coverage = income * 12
        } else if (age >= 18 && age <= 65) {
            coverage = income * 12 * (65 - age)
        } else if (age > 65) {
            coverage = income * 12 * (70 - age)
        }

        coverage = Math.round(coverage * (delta_month / 50))

        return [coverage, coverage * 2, coverage * 3]
    }

    const navigate = useNavigate()
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


    const { next, prev, reset, step, isFirstStep, isLastStep } = useMultistepForm([
        <PersonalDataForm {...data} title='Personal information' updateFields={updateFields} />,
        <PersonalHealthForm {...data} title='Health information' updateFields={updateFields} />,
        <ContactInformationForm {...data} title='Contact information' updateFields={updateFields} />,
        <FinancialDataForm {...data} title='Financial information' updateFields={updateFields} />,
        <InsuranceForm {...data} title='Insurance information' updateFields={updateFields} coverageOptions={calculateCoverage} />
    ])


    async function onSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()

        if (isLastStep) {
            let numberError = "insurance with this number already exists."

            let description = `Life insurance for ${data.firstName} ${data.lastName}`
            description += `Birth date: ${data.birthDate}`

            if (data.illness) description += `Illness: ${data.illness}`
            if (data.surgeries) description += `Surgeries: ${data.surgeries}`
            if (data.bad_habits) description += `Bad habits: ${data.bad_habits}`

            data.address && (description += `Address: ${data.address}`)
            data.email && (description += `Email: ${data.email}`)
            data.phone_number && (description += `Phone number: ${data.phone_number}`)
            data.passport_number && (description += `Passport number: ${data.passport_number}`)
            data.profession && (description += `Profession: ${data.profession}`)
            data.income && (description += `Income: ${data.income}`)
            data.weight && (description += `Weight: ${data.weight}`)

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
                        type: InsuranceType.Life,
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
        }
        else next()
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.side_info}>
                <h1 className={styles.title}>Life Insurance</h1>
                <img className={styles.img} src="/img/human.jpg" alt="human" />

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
                        <p>Оплата приватної швидкої допомоги</p>
                    ]}
                        orderBtn={<button className={styles.form_btn} onClick={isOrderingToggle}>Order now</button>}
                    />
                    :
                    <form className={styles.form} onSubmit={onSubmit}>
                        {step}

                        <div className={styles.row}>
                            {isOrdering && isFirstStep && <button className={styles.form_btn} type='button' onClick={() => setIsOrdering(false)}>Back</button>}
                            {!isFirstStep && <button className={styles.form_btn} type='button' style={{ marginRight: 'auto' }} onClick={prev}>Back</button>}
                            {!isLastStep && <button className={styles.form_btn} style={{ marginLeft: 'auto' }} type='submit'>Next</button>}
                            {isLastStep && <div className={styles.price} style={{}}> Price: <span>${calculatePrice(data) || 0}</span></div>}
                            {isLastStep && <button className={[styles.form_btn, styles.submit_bth].join(' ')} type='submit'>Submit</button>}
                        </div>
                    </form >
            }
        </div >
    )
}
