import React, { FormEvent, useContext, useState } from 'react'
import { UserContext, UserInsurancesContext } from '../../App'
import useMultistepForm from '../../hooks/useMultistepForm'
import { InsuranceStatus, InsuranceType } from '../../types/insurance'
import PetForm from '../Forms/PetForm'
import styles from './Insurance.module.scss'
import InsuranceInfo from './InsuranceInfo'

const INITIAL_DATA = {
    name: '',
    type: '',
    birthDate: '',
    weight: '',
    breed: '',
    gender: '',
}

export default function PetInsurance() {
    const [data, setData] = useState(INITIAL_DATA)

    const [isOrdering, setIsOrdering] = useState(false)

    function updateFields(fields: Partial<typeof INITIAL_DATA>) {
        setData(prev => ({ ...prev, ...fields }))
    }

    const { next, prev, reset, step, isFirstStep, isLastStep } = useMultistepForm([
        <PetForm {...data} title='Pet information' updateFields={updateFields} />
    ])

    const { user, setUser } = useContext(UserContext)
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
                    description: data.type + ' insurance',
                    end_date: '',
                    id: userInsurances.length + 1,
                    price: 1000,
                    start_date: new Date().toISOString().split('T')[0],
                    status: InsuranceStatus.NEW,
                    title: data.name + ' insurance',
                    type: InsuranceType.Pet,
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
                <h1 className={styles.title}>Pet Insurance</h1>

                <img className={styles.img} src="./img/pets.webp" alt="pets" />

                <div className={styles.info}>

                    <h3>Why Pet Insurance?</h3>

                    <p>
                        Pet insurance is a safety net to help protect you against unexpected costs related to your pet. The most obvious reason to have insurance on your cat or dog is to cover veterinary bills. However, it can seem like an unnecessary expense if you never have any accidents or illnesses.
                    </p>

                </div>


            </div>

            {!isOrdering ?
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
                        {isOrdering && <button className={styles.form_btn} type='button' onClick={() => setIsOrdering(false)}>Back</button>}
                        {!isFirstStep && <button className={styles.form_btn} type='button' style={{ marginRight: 'auto' }} onClick={prev}>Back</button>}
                        {!isLastStep && <button className={styles.form_btn} style={{ marginLeft: 'auto' }} type='submit'>Next</button>}
                        {isLastStep && <button className={[styles.form_btn, styles.submit_bth].join(' ')} type='submit'>Submit</button>}
                    </div>
                </form >
            }
        </div>
    )
}
