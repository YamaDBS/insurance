import React from 'react'
import Insurance, { InsuranceStatus, InsuranceType } from '../../types/insurance'
import styles from './InsuranceCard.module.scss'

interface Props {
    insurance: Insurance
}

export default function InsuranceCard({ insurance }: Props) {
    return (
        <div className={styles.card}>
            <div className={styles.header}>
                {insurance.type === InsuranceType.Pet && <img src="./img/ico/pet.png" alt="Pet" />}
                {insurance.type === InsuranceType.Life && <img src="./img/ico/heart.png" alt="Life" />}
                {insurance.type === InsuranceType.Travel && <img src="./img/ico/travel.png" alt="Travel" />}

                <h3 className={styles.title}>{insurance.title}</h3>

                {insurance.status === InsuranceStatus.NEW && <div className={[styles.status, styles.new].join(' ')}>New</div>}
                {insurance.status === InsuranceStatus.ACTIVE && <div className={[styles.status, styles.active].join(' ')}>Active</div>}
                {insurance.status === InsuranceStatus.CANCELED && <div className={[styles.status, styles.cancelled].join(' ')}>Canceled</div>}
                {insurance.status === InsuranceStatus.EXPIRED && <div className={[styles.status, styles.expired].join(' ')}>Expired</div>}
                {insurance.status === InsuranceStatus.PENDING && <div className={[styles.status, styles.pending].join(' ')}>Pending</div>}
                {insurance.status === InsuranceStatus.PAID && <div className={[styles.status, styles.paid].join(' ')}>Paid</div>}

                <p className={styles.date}>{insurance.creation_date}</p>
                <p className={styles.id}>id: {insurance.id}</p>
            </div>

            <div className={styles.main}>
                <p className={styles.description}>{insurance.description}</p>

                <div className={styles.date_wrapper}>
                    <p className={styles.date}>{insurance.start_date}</p>
                    <img className={styles.arrow} src="./img/ico/down-arrow.svg" alt="Arrow" />
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
