import React, { useContext, useState } from 'react'
import { InsurancesContext, UserContext, UserInsurancesContext } from '../../../App'
import InsuranceCard from '../../../components/InsuranceCard/InsuranceCard'
import styles from '../../Page.module.scss'


export default function InsurancesTab() {
    const { userInsurances } = useContext(UserInsurancesContext)
    const { user } = useContext(UserContext)

    const { insurances } = useContext(InsurancesContext)

    const [selectedInsurances, setSelectedINsurances] = useState<'my' | 'all' | 'new'>('my')

    const [query, setQuery] = useState('')

    if (user?.status === 'user') {
        return (
            <div className={styles.insurances}>
                {userInsurances.map((insurance, index) => (
                    <InsuranceCard insurance={insurance} key={insurance.id + insurance.price * index} />
                ))}
            </div>
        )
    }

    else if (user?.status === 'agent') {
        return (
            <>
                <div className={styles.header}>

                    <div className={styles.type_selector}>
                        <div className={[styles.item, selectedInsurances === 'my' && styles.active].join(' ')} onClick={() => setSelectedINsurances('my')}>My</div>
                        <div className={[styles.item, selectedInsurances === 'new' && styles.active].join(' ')} onClick={() => setSelectedINsurances('new')}>New</div>
                        <div className={[styles.item, selectedInsurances === 'all' && styles.active].join(' ')} onClick={() => setSelectedINsurances('all')}>All</div>
                    </div>

                    <div className={styles.search}>
                        <input type="text" placeholder="Search..." value={query} onChange={e => setQuery(e.currentTarget.value)} />
                        <button type='button'>
                            <img src="/img/ico/search.svg" alt="search" />
                        </button>
                    </div>
                </div>

                <div className={styles.insurances}>
                    {selectedInsurances === 'all' && insurances
                        .filter(insurance => insurance.title.toLowerCase().includes(query.toLowerCase())
                            || insurance.status.toLowerCase().includes(query.toLowerCase())
                            || insurance.user_id.toString().includes(query.toLowerCase())
                            || insurance.id.toString().includes(query.toLowerCase()))
                        .map((insurance, index) => (
                            <InsuranceCard insurance={insurance} key={insurance.id + insurance.price * index} />
                        ))
                    }

                    {selectedInsurances === 'my' && userInsurances
                        .filter(insurance => insurance.title.toLowerCase().includes(query.toLowerCase())
                            || insurance.status.toLowerCase().includes(query.toLowerCase())
                            || insurance.user_id.toString().includes(query.toLowerCase())
                            || insurance.id.toString().includes(query.toLowerCase()))
                        .map((insurance, index) => (
                            <InsuranceCard insurance={insurance} key={insurance.id + insurance.price * index} />
                        ))
                    }

                    {selectedInsurances === 'new' && insurances.filter(insurance => insurance.agent_id === null)
                        .filter(insurance => insurance.title.toLowerCase().includes(query.toLowerCase())
                            || insurance.status.toLowerCase().includes(query.toLowerCase())
                            || insurance.user_id.toString().includes(query.toLowerCase())
                            || insurance.id.toString().includes(query.toLowerCase()))
                        .map((insurance, index) => (
                            <InsuranceCard insurance={insurance} key={insurance.id + insurance.price * index} />
                        ))
                    }
                </div>
            </>
        )
    }

    else return (
        <div className={styles.insurances}>
            {insurances.map((insurance, index) => (
                <InsuranceCard insurance={insurance} key={insurance.id + insurance.price * index} />
            ))
            }
        </div>
    )
}
