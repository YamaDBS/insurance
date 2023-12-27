import React, { useState } from 'react'

import styles from './HiddenField.module.scss'

interface Props {
    text?: string
    children?: React.ReactNode
    canSee: boolean,
    isVisible?: boolean,
}

export default function HiddenField({ text, children, canSee, isVisible: visible }: Props) {
    const [isVisible, setIsVisible] = useState(false)

    if (children) {
        return (
            <div className={styles.field} onClick={(e) => { e.stopPropagation(); if (canSee) setIsVisible(prev => !prev) }}>
                {(isVisible || visible) ? children : "*".repeat(children.toString().length)}
            </div>
        )
    }
    else if (text) return (
        <div className={styles.field} onClick={(e) => { e.stopPropagation(); if (canSee) setIsVisible(prev => !prev) }}>
            {(isVisible || visible) ? text : "*".repeat(text.length)}
        </div>
    )

    return null
}
