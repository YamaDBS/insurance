import { useContext, useState } from 'react'
import { InsurancesContext, UserContext, UsersContext } from '../../../App'
import styles from '../../Page.module.scss'


export default function UsersTab() {

    const { user } = useContext(UserContext)
    const { users } = useContext(UsersContext)

    const { insurances } = useContext(InsurancesContext)

    const [selectedInsurances, setSelectedINsurances] = useState<'my' | 'all'>('my')
    const [query, setQuery] = useState('')

    if (user?.status === 'agent') {
        return (
            <>
                <div className={styles.header}>

                    <div className={styles.type_selector}>
                        <div className={[styles.item, selectedInsurances === 'my' && styles.active].join(' ')} onClick={() => setSelectedINsurances('my')}>My</div>
                        <div className={[styles.item, selectedInsurances === 'all' && styles.active].join(' ')} onClick={() => setSelectedINsurances('all')}>All</div>
                    </div>

                    <div className={styles.search}>
                        <input type="text" placeholder="Search..." value={query} onChange={e => setQuery(e.currentTarget.value)} />
                        <button type='button'>
                            <img src="/img/ico/search.svg" alt="search" />
                        </button>
                    </div>
                </div>

                <div className={styles.users}>
                    {selectedInsurances === 'all' && users
                        .filter(u => u.first_name.toLowerCase().includes(query.toLowerCase())
                            || u.last_name.toLowerCase().includes(query.toLowerCase())
                            || u.id.toString().includes(query.toLowerCase()))
                        .map((u, index) => (
                            <div className={styles.user} key={u.id + u.last_name + index}>
                                <div className={styles.id}>{u.id}</div>
                                <div className={styles.name}>{u.first_name} {u.last_name}</div>
                                <div className={styles.gender}>{u.gender}</div>
                                <div className={styles.email}>{u.email}</div>
                                <div className={styles.phone_number}>{u.phone_number}</div>
                                <div className={styles.passport_number}>{u.passport_number}</div>
                            </div>
                        ))
                    }

                    {selectedInsurances === 'my' && users
                        .filter(u => insurances.filter(insurance => insurance.user_id === u.id).some(ins => ins.agent_id === user.id))
                        .filter(u => u.first_name.toLowerCase().includes(query.toLowerCase())
                            || u.last_name.toLowerCase().includes(query.toLowerCase())
                            || u.id.toString().includes(query.toLowerCase()))
                        .map((u, index) => (
                            <div className={styles.user} key={u.id + u.last_name + index}>
                                <div className={styles.id}>{u.id}</div>
                            </div>
                        ))
                    }
                </div>
            </>
        )
    }

    return (
        <div className={styles.users}>

        </div>
    )
}
