import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../App'
import { InsuranceAPI } from '../../api/API'
import { Insurance, InsuranceStatus, InsuranceType } from '../../types/insurance'
import StatusSelector from '../StatusSelector/StatusSelector'
import styles from './InsuranceCard.module.scss'

interface Props {
    insurance: Insurance
}

export default function InsuranceCard({ insurance }: Props) {

    const { userResponse } = useContext(UserContext)
    const { user } = userResponse

    const [selectedStatus, setSelectedStatus] = useState<InsuranceStatus>(insurance.status)

    useEffect(() => {
        async function updateStatus() {
            const resp = await InsuranceAPI.updateInsuranceStatus(insurance.id, selectedStatus)
            if (resp.error) return

            insurance.status = selectedStatus
        }

        updateStatus()
    }, [selectedStatus])

    if (user?.status === 'user') {
        return (
            <div className={styles.card}>
                <div className={styles.header}>
                    {insurance.type === InsuranceType.Pet && <img src="/img/ico/pet.png" alt="Pet" />}
                    {insurance.type === InsuranceType.Life && <img src="/img/ico/heart.png" alt="Life" />}
                    {insurance.type === InsuranceType.Travel && <img src="/img/ico/travel.png" alt="Travel" />}

                    <h3 className={styles.title}>{insurance.name}</h3>

                    <StatusSelector selected={selectedStatus} setSelected={setSelectedStatus} />


                    <p className={styles.id}>{insurance.number}</p>
                </div>

                <div className={styles.main}>
                    <p className={styles.description}>{insurance.description}</p>

                    <div className={styles.date_wrapper}>
                        <p className={styles.date}>{insurance.start_date}</p>
                        <img className={styles.arrow} src="/img/ico/down-arrow.svg" alt="Arrow" />
                        <p className={styles.date}>{insurance.end_date}</p>
                    </div>
                </div>

                <div className={styles.main} style={{ flexDirection: 'row' }}>
                    <p className={styles.coverage}><span>$</span> {insurance.coverage}.00</p>

                    <div className={styles.price}>Price: <span>$</span><p>{insurance.price}.00</p></div>
                </div>
            </div >
        )
    }

    else return (
        <div className={styles.card}>
            <div className={styles.header}>
                {insurance.type === InsuranceType.Pet && <img src="/img/ico/pet.png" alt="Pet" />}
                {insurance.type === InsuranceType.Life && <img src="/img/ico/heart.png" alt="Life" />}
                {insurance.type === InsuranceType.Travel && <img src="/img/ico/travel.png" alt="Travel" />}

                <h3 className={styles.title}>{insurance.name}</h3>

                <StatusSelector selected={selectedStatus} setSelected={setSelectedStatus} isEditable={true} />

                <p className={styles.id}>{insurance.number}</p>
            </div>

            <div className={styles.main}>
                <p className={styles.description}>{insurance.description}</p>

                <div className={styles.date_wrapper}>
                    <p className={styles.date}>{insurance.start_date}</p>
                    <img className={styles.arrow} src="/img/ico/down-arrow.svg" alt="Arrow" />
                    <p className={styles.date}>{insurance.end_date}</p>
                </div>
            </div>

            <div className={styles.main} style={{ flexDirection: 'row' }}>
                <p className={styles.coverage}><span>$</span> {insurance.coverage}.00</p>

                <div className={styles.price}>Price: <span>$</span><p>{insurance.price}.00</p></div>
            </div>
        </div >
    )
}
