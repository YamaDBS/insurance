import React, { ReactElement } from 'react'
import styles from './Insurance.module.scss'

interface Props {
    items: ReactElement[],
    orderBtn?: ReactElement,
}



export default function InsuranceInfo({ items, orderBtn }: Props) {
    return (
        <div className={styles.form}
            style={{
                alignItems: 'center',
                justifyContent: 'center',
                gap: '50px',
            }}
        >
            <div className={styles.items}>
                {items.map((item, i) => {
                    return (
                        <div key={i} className={styles.item}>
                            {item}
                        </div>
                    )
                })}
            </div>

            {orderBtn}
        </div>
    )
}
