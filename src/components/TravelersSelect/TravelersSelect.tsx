import React, { Dispatch, SetStateAction, useState } from 'react';
import styles from './TravelersSelect.module.scss';

interface Props {
    travelers: {
        adults: number,
        children: number,
        seniors: number,
    },
    max: {
        adults: number,
        children: number,
        seniors: number,
    },
    min: {
        adults: number,
        children: number,
        seniors: number,
    },
    setTravelersAmount: Dispatch<SetStateAction<{
        adults: number;
        children: number;
        seniors: number;
    }>>
}

export default function TravelersSelect({ travelers, max, min, setTravelersAmount }: Props) {

    function changeTravelersAmount(type: keyof typeof travelers, operation: 'add' | 'sub') {
        const { adults, children, seniors } = travelers

        if (operation === 'add') {
            if (adults + seniors <= 0 && type === 'children') return

            else if (type === 'adults' && adults < max.adults) setTravelersAmount(prev => ({ ...prev, adults: prev.adults + 1 }))
            else if (type === 'children' && children < max.children) setTravelersAmount(prev => ({ ...prev, children: prev.children + 1 }))
            else if (type === 'seniors' && seniors < max.seniors) setTravelersAmount(prev => ({ ...prev, seniors: prev.seniors + 1 }))
        }
        else {
            if (type === 'adults' && adults > min.adults) setTravelersAmount(prev => ({ ...prev, adults: prev.adults - 1 }))
            else if (type === 'children' && children > min.children) setTravelersAmount(prev => ({ ...prev, children: prev.children - 1 }))
            else if (type === 'seniors' && seniors > min.seniors) setTravelersAmount(prev => ({ ...prev, seniors: prev.seniors - 1 }))
        }
    }

    function getAllTravelers() {
        const { adults, children, seniors } = travelers

        return adults + children + seniors
    }

    const [isEditing, setIsEditing] = useState(false)

    return (
        <div className={[styles.wrapper, isEditing ? styles.active : null].join(' ')}>
            <h3 className={styles.title} onClick={(e) => { e.stopPropagation(); setIsEditing(prev => !prev) }}>Travelers: <span style={{ fontWeight: 900 }}>{getAllTravelers()}</span></h3>
            {isEditing &&
                <div className={styles.options}>
                    <div className={styles.option}>
                        <h4>Adults</h4>
                        <div className={styles.select}>
                            <button type='button' className={styles.btn}
                                onClick={() => changeTravelersAmount('adults', 'sub')}>-</button>

                            <span>{travelers.adults}</span>

                            <button type='button' className={styles.btn}
                                onClick={() => changeTravelersAmount('adults', 'add')}>+</button>
                        </div>
                    </div>

                    <div className={styles.option}>
                        <h4>Children</h4>
                        <div className={styles.select}>
                            <button type='button' className={styles.btn}
                                onClick={() => changeTravelersAmount('children', 'sub')}>-</button>

                            <span>{travelers.children}</span>

                            <button type='button' className={styles.btn}
                                onClick={() => changeTravelersAmount('children', 'add')}>+</button>
                        </div>
                    </div>

                    <div className={styles.option}>
                        <h4>Seniors</h4>
                        <div className={styles.select}>
                            <button type='button' className={styles.btn}
                                onClick={() => changeTravelersAmount('seniors', 'sub')}>-</button>

                            <span>{travelers.seniors}</span>

                            <button type='button' className={styles.btn}
                                onClick={() => changeTravelersAmount('seniors', 'add')}>+</button>
                        </div>

                    </div>
                </div>
            }

        </div>
    )
}
