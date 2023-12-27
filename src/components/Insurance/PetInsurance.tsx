import React, { FormEvent, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserContext, UserInsurancesContext } from '../../App'
import { API, InsuranceAPI } from '../../api/API'
import useMultistepForm from '../../hooks/useMultistepForm'
import { InsuranceStatus, InsuranceType } from '../../types/insurance'
import InsuranceForm from '../Forms/InsuranceForm'
import PetForm, { pets } from '../Forms/PetForm'
import styles from './Insurance.module.scss'
import InsuranceInfo from './InsuranceInfo'

const INITIAL_DATA = {
    name: '',
    pet_name: '',
    type: '',
    birthDate: '',
    weight: '',
    breed: '',
    sex: '',
    start_date: '',
    end_date: '',
    coverage: 0,
}

function calculatePrice(data: typeof INITIAL_DATA) {
    const { coverage } = data

    return Math.round(coverage * 0.1)
}

export default function PetInsurance() {
    const [data, setData] = useState(INITIAL_DATA)

    const [isOrdering, setIsOrdering] = useState(false)

    function updateFields(fields: Partial<typeof INITIAL_DATA>) {
        setData(prev => ({ ...prev, ...fields }))
    }

    const { next, prev, reset, step, isFirstStep, isLastStep } = useMultistepForm([
        <PetForm {...data} title='Pet information' updateFields={updateFields} />,
        <InsuranceForm {...data} title='Insurance information' updateFields={updateFields} coverageOptions={() => [100, 1000, 2000, 5000, 10000, 20000, 50000]} />
    ])

    const { userResponse, setUserResponse } = useContext(UserContext)

    const { user, error } = userResponse

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

    async function onSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()

        if (isLastStep) {
            let numberError = "insurance with this number already exists."

            do {
                try {
                    const result = await InsuranceAPI.createInsurance({
                        name: data.name,
                        description: `Pet: ${data.pet_name} (${data.type}, ${data.breed}, ${data.weight})`,
                        number: "",

                        coverage: data.coverage,
                        price: calculatePrice(data),

                        start_date: data.start_date,
                        end_date: data.end_date,

                        status: InsuranceStatus.NEW,
                        type: InsuranceType.Pet,
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
                <h1 className={styles.title}>Pet Insurance</h1>

                <img className={styles.img} src="/img/pets.webp" alt="pets" />

                <div className={styles.info}>

                    <h3>Why Pet Insurance?</h3>

                    <p>
                        Pet insurance is a safety net to help protect you against unexpected costs related to your pet. The most obvious reason to have insurance on your cat or dog is to cover veterinary bills. However, it can seem like an unnecessary expense if you never have any accidents or illnesses.
                    </p>

                </div>


            </div>

            {!isOrdering ?
                <InsuranceInfo items={[
                    <p>Страхування для подорожей</p>,
                    <p>Страхування життя і здоров'я улюбленця</p>,
                    <p>Невідкладні операції до <span>10 000 євро</span></p>,
                    <p>Невідкладна ветеринарна допомога</p>
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
