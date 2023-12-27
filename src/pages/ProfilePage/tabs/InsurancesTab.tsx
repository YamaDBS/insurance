import React, { useContext, useEffect, useState } from 'react'
import { InsurancesContext, UserContext } from '../../../App'
import { API, InsuranceAPI } from '../../../api/API'
import InsuranceCard from '../../../components/InsuranceCard/InsuranceCard'
import { useDebounce } from '../../../hooks/useDebounce'
import { InsuranceStatus } from '../../../types/insurance'
import styles from '../../Page.module.scss'


export default function InsurancesTab() {
    const { userResponse } = useContext(UserContext)

    const { user, error } = userResponse

    const { insurances, setInsurances } = useContext(InsurancesContext)

    const [selectedInsurances, setSelectedInsurances] = useState<'my' | 'new'>('my')
    const [sortMetod, setSortMetod] = useState<'start_date' | 'end_date' | 'price' | 'name'>('start_date')
    const [sortDirection, setSortDirection] = useState<'smaller' | 'bigger'>('bigger')

    const [query, setQuery] = useState('')
    const debouncedQuery = useDebounce(query, 1000)

    async function search(query: string) {
        async function fetchInsurances() {
            const resp = await InsuranceAPI.searchInsurances(query, sortMetod, sortDirection)

            if (selectedInsurances === 'new') setInsurances({ ...resp, results: resp.results.filter(insurance => insurance.status === InsuranceStatus.NEW) })
            else setInsurances(resp)
        }

        fetchInsurances()
    }

    useEffect(() => {
        search(debouncedQuery)
    }, [debouncedQuery, selectedInsurances, sortMetod, sortDirection])

    if (user?.status === 'user') {
        return (
            <>
                <div className={styles.header}>
                    <div className={styles.interactive}>

                        <select onChange={(e) => setSortMetod(e.currentTarget.value as typeof sortMetod)} className={styles.sort} name="sortMetod">
                            <option selected disabled value="name">Sort by...</option>

                            <option value="name">Name</option>
                            <option value="start_date">Start date</option>
                            <option value="end_date">End date</option>
                            <option value="price">Price</option>
                            <option value="coverage">Coverage</option>
                        </select>

                        <div className={styles.type_selector}>
                            <button className={[styles.item, sortDirection === 'bigger' ? styles.active : ''].join(' ')} onClick={() => setSortDirection('bigger')}>
                                <img src="/img/ico/arrow-down.svg" alt="arrow" />
                            </button>
                            <button className={[styles.item, sortDirection === 'smaller' ? styles.active : ''].join(' ')} onClick={() => setSortDirection('smaller')}>
                                <img src="/img/ico/arrow-up.svg" alt="arrow" />
                            </button >
                        </div >

                        <div className={styles.search}>
                            <input type="text" placeholder="Search..." value={query} onChange={e => setQuery(e.currentTarget.value)} />
                            <button type='button'>
                                <img src="/img/ico/search.svg" alt="search" />
                            </button>
                        </div>

                    </div >
                </div>

                <div className={styles.insurances}>
                    {insurances.results.length === 0 && <div className={styles.nothing}>
                        <img src="/img/ico/sad_face.svg" alt="sad face" />
                        <p>Nothing found . . .</p>
                    </div>
                    }
                    {insurances.results.map((insurance, index) => (
                        <InsuranceCard insurance={insurance} key={insurance.id + insurance.price * index} />
                    ))}
                </div>
            </>
        )
    }

    else {
        return (
            <>
                <div className={styles.header}>
                    <div className={styles.interactive}>

                        {user?.status === 'agent' &&
                            <div className={styles.type_selector}>
                                <button className={[styles.item, selectedInsurances === 'my' ? styles.active : ''].join(' ')} onClick={() => setSelectedInsurances('my')}>My</button>
                                <button className={[styles.item, selectedInsurances === 'new' ? styles.active : ''].join(' ')} onClick={() => setSelectedInsurances('new')}>New</button >
                            </div >
                        }

                        <select onChange={(e) => setSortMetod(e.currentTarget.value as typeof sortMetod)} className={styles.sort} name="sortMetod">
                            <option value="name">Name</option>
                            <option selected value="start_date">Start date</option>
                            <option value="end_date">End date</option>
                            <option value="price">Price</option>
                            <option value="coverage">Coverage</option>
                        </select>

                        <div className={styles.type_selector}>
                            <button className={[styles.item, sortDirection === 'bigger' ? styles.active : ''].join(' ')} onClick={() => setSortDirection('bigger')}>
                                <img src="/img/ico/arrow-down.svg" alt="arrow" />
                            </button>
                            <button className={[styles.item, sortDirection === 'smaller' ? styles.active : ''].join(' ')} onClick={() => setSortDirection('smaller')}>
                                <img src="/img/ico/arrow-up.svg" alt="arrow" />
                            </button >
                        </div >

                        <div className={styles.search}>
                            <input type="text" placeholder="Search..." value={query} onChange={e => setQuery(e.currentTarget.value)} />
                            <button type='button'>
                                <img src="/img/ico/search.svg" alt="search" />
                            </button>
                        </div>
                    </div >
                </div>

                <div className={styles.insurances}>
                    {insurances.results.length === 0 && <div className={styles.nothing}>
                        <img src="/img/ico/sad_face.svg" alt="sad face" />
                        <p>Nothing found . . .</p>
                    </div>
                    }
                    {insurances.results.map((insurance, index) => (
                        <InsuranceCard insurance={insurance} key={insurance.id + insurance.price * index} />
                    ))}
                </div>
            </>
        )
    }
}
