import React, { useContext, useState } from 'react'
import { UserContext } from '../App'
import Header from '../components/Header/Header'
import Insurance from '../components/Insurance/Insurance'
import { InsuranceType } from '../types/insurance'



export default function HomePage() {
    const [insuranceType, setInsuranceType] = useState<InsuranceType>(InsuranceType.Travel)

    return (
        <>
            <Header setInsuranceType={setInsuranceType} type={insuranceType} />

            <main>
                <Insurance setInsuranceType={setInsuranceType} type={insuranceType} />
            </main>

        </>
    )
}
