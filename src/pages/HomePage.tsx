import React, { useState } from 'react'
import Header from '../components/Header/Header'
import Insurance from '../components/Insurance/Insurance'
import { InsuranceType } from '../types/insurance'
import styles from './Page.module.scss'

export default function HomePage() {
    const [insuranceType, setInsuranceType] = useState<InsuranceType>(InsuranceType.Travel)

    return (
        <div className={styles.page} style={{ paddingBottom: 0 }}>
            <Header setInsuranceType={setInsuranceType} type={insuranceType} />

            <main className={styles.main} style={{ margin: 0 }}>
                <Insurance setInsuranceType={setInsuranceType} type={insuranceType} />
            </main>

        </div>
    )
}
