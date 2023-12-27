import { useAutoAnimate } from '@formkit/auto-animate/react'
import React from 'react'
import { InsuranceType } from '../../types/insurance'
import styles from './Insurance.module.scss'
import LifeInsurance from './LifeInsurance'
import PetInsurance from './PetInsurance'
import TravelInsurance from './TravelInsurance'

interface Props {
    type: InsuranceType,
    setInsuranceType: React.Dispatch<React.SetStateAction<InsuranceType>>
}

export default function Insurance({ setInsuranceType, type }: Props) {

    const [parent, enableAnimations] = useAutoAnimate()

    return (
        <div className={styles.insurance_tabs}>

            <div className={styles.wrapper} >
                <div className={[styles.insurance_tab, type === InsuranceType.Travel ? styles.active : null].join(' ')}
                    onClick={() => setInsuranceType(InsuranceType.Travel)}>
                    <img src="/img/ico/travel.png" alt="travel" />
                    <h3>Travel</h3>
                </div>

                <div className={[styles.insurance_tab, type === InsuranceType.Pet ? styles.active : null].join(' ')}
                    onClick={() => setInsuranceType(InsuranceType.Pet)}>
                    <img src="/img/ico/pet.png" alt="pet" />

                    <h3>Pet</h3>
                </div>

                <div className={[styles.insurance_tab, type === InsuranceType.Life ? styles.active : null].join(' ')}
                    onClick={() => setInsuranceType(InsuranceType.Life)}>
                    <img src="/img/ico/heart.png" alt="life" />
                    <h3>Life</h3>
                </div>
            </div>

            <div className={styles.insurance_content} ref={parent}>
                {
                    type === InsuranceType.Travel &&
                    <TravelInsurance />
                }

                {
                    type === InsuranceType.Pet &&
                    <PetInsurance />
                }

                {
                    type === InsuranceType.Life &&
                    <LifeInsurance />
                }
            </div>

        </div>
    )
}
