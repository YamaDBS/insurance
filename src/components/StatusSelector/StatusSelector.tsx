import React from 'react'
import { InsuranceStatus } from '../../types/insurance'
import styles from './StatusSelector.module.scss'

interface Props {
    selected: InsuranceStatus
    setSelected: React.Dispatch<React.SetStateAction<InsuranceStatus>>
    isEditable?: boolean
}

export default function StatusSelector({ selected, setSelected, isEditable }: Props) {

    const [isOpened, setIsOpened] = React.useState(false)

    function getStyle(status: InsuranceStatus) {
        if (status === InsuranceStatus.NEW) return styles.new
        if (status === InsuranceStatus.ACTIVE) return styles.active
        if (status === InsuranceStatus.CANCELED) return styles.cancelled
        if (status === InsuranceStatus.EXPIRED) return styles.expired
        if (status === InsuranceStatus.PENDING) return styles.pending
        if (status === InsuranceStatus.PAID) return styles.paid
    }

    return (
        <>
            <div className={styles.wrapper}>
                <div className={[styles.header, getStyle(selected)].join(' ')} onClick={() => isEditable && setIsOpened(prev => !prev)}>
                    <p className={styles.status}>{selected}</p>

                    {isEditable && <img className={styles.arrow} src="/img/ico/single-arrow-down.svg" alt="Arrow" />}
                </div>

                {isOpened &&
                    <div className={styles.elements}>
                        <div className={[styles.element, getStyle(InsuranceStatus.NEW)].join(' ')} onClick={() => { setSelected(InsuranceStatus.NEW); setIsOpened(false) }}>
                            <p className={styles.status}>{InsuranceStatus.NEW}</p>
                        </div>

                        <div className={[styles.element, getStyle(InsuranceStatus.ACTIVE)].join(' ')} onClick={() => { setSelected(InsuranceStatus.ACTIVE); setIsOpened(false) }}>
                            <p className={styles.status}>{InsuranceStatus.ACTIVE}</p>
                        </div>

                        <div className={[styles.element, getStyle(InsuranceStatus.CANCELED)].join(' ')} onClick={() => { setSelected(InsuranceStatus.CANCELED); setIsOpened(false) }}>
                            <p className={styles.status}>{InsuranceStatus.CANCELED}</p>
                        </div>

                        <div className={[styles.element, getStyle(InsuranceStatus.EXPIRED)].join(' ')} onClick={() => { setSelected(InsuranceStatus.EXPIRED); setIsOpened(false) }}>
                            <p className={styles.status}>{InsuranceStatus.EXPIRED}</p>
                        </div>

                        <div className={[styles.element, getStyle(InsuranceStatus.PENDING)].join(' ')} onClick={() => { setSelected(InsuranceStatus.PENDING); setIsOpened(false) }}>
                            <p className={styles.status}>{InsuranceStatus.PENDING}</p>
                        </div>

                        <div className={[styles.element, getStyle(InsuranceStatus.PAID)].join(' ')} onClick={() => { setSelected(InsuranceStatus.PAID); setIsOpened(false) }}>
                            <p className={styles.status}>{InsuranceStatus.PAID}</p>
                        </div>

                    </div>
                }
            </div>

            {isOpened && <div className={styles.popup} onClick={(e) => { e.stopPropagation(); setIsOpened(false) }}></div>}
        </>
    )
}
