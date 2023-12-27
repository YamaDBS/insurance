import { useAutoAnimate } from '@formkit/auto-animate/react'
import { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserContext, UsersContext } from '../../../App'
import { API, UserAPI } from '../../../api/API'
import HiddenField from '../../../components/HiddenField/HiddenField'
import { useDebounce } from '../../../hooks/useDebounce'
import styles from '../../Page.module.scss'


export default function ClientsTab() {
    const { userResponse, setUserResponse } = useContext(UserContext)
    const { user } = userResponse

    const { usersResponse, setUsersResponse } = useContext(UsersContext)
    const { results: users } = usersResponse

    const [selectedUsers, setSelectedUsers] = useState<'my' | 'all'>('my')

    const [selectedStatus, setSelectedStatus] = useState<'clients' | 'agents' | 'all'>('clients')

    const [query, setQuery] = useState('')
    const debouncedQuery = useDebounce(query, 500)

    const [parent] = useAutoAnimate()

    useEffect(() => {
        if (user?.status === 'admin') setSelectedUsers('all')
    }, [user])

    async function search(query: string) {

        if (user?.status === 'admin') {
            async function fetchUsers(query?: string) {
                if (selectedStatus === 'clients') {
                    const resp = await UserAPI.getAllClients(query)
                    setUsersResponse(resp)
                }
                else if (selectedStatus === 'agents') {
                    const resp = await UserAPI.getAllAgents(query)
                    setUsersResponse(resp)
                }
                else if (selectedStatus === 'all') {
                    const resp = await UserAPI.getAllUsers(query)
                    setUsersResponse(resp)
                }
            }

            fetchUsers(query)
        }

        else if (user?.status === 'agent') {
            async function fetchUsers(query?: string) {
                if (selectedUsers === 'my') {
                    const resp = await UserAPI.getAgentUsers(query)
                    setUsersResponse(resp)
                }
                else if (selectedUsers === 'all') {
                    const resp = await UserAPI.getAllClients(query)
                    setUsersResponse(resp)
                }
            }

            fetchUsers(query)
        }
    }

    async function updateSalesCoef(id: number, sales_coef: number) {
        try {
            await UserAPI.setAgentSalesKoef(id, sales_coef)

            const resp = await UserAPI.getAllAgents(query)
            setUsersResponse(resp)

            search(debouncedQuery)
        } catch (err: any) {
            alert(err.message)
        }
    }

    async function deleteUser(id: number) {
        try {
            await UserAPI.deleteUser(id)

            search(debouncedQuery)
        } catch (err: any) {
            alert(err.message)
        }
    }

    useEffect(() => {
        search(debouncedQuery)
    }, [debouncedQuery, selectedUsers, selectedStatus])

    return (
        <>
            <div className={styles.header}>
                <div className={styles.interactive}>

                    {user?.status === 'agent' &&
                        <div className={styles.type_selector}>
                            <button className={[styles.item, selectedUsers === 'my' ? styles.active : ''].join(' ')} onClick={() => setSelectedUsers('my')}>My</button>
                            <button className={[styles.item, selectedUsers === 'all' ? styles.active : ''].join(' ')} onClick={() => setSelectedUsers('all')}>All</button>
                        </div >
                    }

                    {user?.status === 'admin' &&
                        <div className={styles.type_selector}>
                            <button className={[styles.item, selectedStatus === 'clients' ? styles.active : ''].join(' ')} onClick={() => setSelectedStatus('clients')}>Clients</button>
                            <button className={[styles.item, selectedStatus === 'agents' ? styles.active : ''].join(' ')} onClick={() => setSelectedStatus('agents')}>Agents</button>
                            <button className={[styles.item, selectedStatus === 'all' ? styles.active : ''].join(' ')} onClick={() => setSelectedStatus('all')}>All</button>
                        </div >
                    }

                    <div className={styles.search}>
                        <input type="text" placeholder="Search..." value={query} onChange={e => setQuery(e.currentTarget.value)} />
                        <button type='button' onClick={() => search(query)}>
                            <img src="/img/ico/search.svg" alt="search" />
                        </button>
                    </div>

                </div>

                {users.length !== 0 && <div className={styles.title} style={(user?.status === 'admin' && selectedStatus === 'agents') ? { gridTemplateColumns: "repeat(8, 1fr)" } : {}}>
                    <div className={styles.id}>ID</div>
                    <div className={styles.name}>Name</div>
                    <div className={styles.sex}>Sex</div>
                    <div className={styles.email}>Email</div>
                    <div className={styles.phone_number}>Phone number</div>
                    <div className={styles.passport_number}>Passport number</div>
                    {user?.status === 'admin' && selectedStatus === 'agents' && <div>Sales koef</div>}
                </div>}
            </div>

            <div className={styles.users} ref={parent}>
                {users.length === 0 && <div className={styles.nothing}>
                    <img src="/img/ico/sad_face.svg" alt="sad face" />
                    <p>Nothing found . . .</p>
                </div>
                }
                {users.map((u) => {
                    if (!u) return null

                    return (
                        <div className={styles.user} key={u.email} style={(user?.status === 'admin' && selectedStatus === 'agents') ? { gridTemplateColumns: "repeat(8, 1fr)" } : {}}>
                            <div>{u.id}</div>
                            <div>{u.first_name} {u.last_name}</div>
                            <div>{u.sex || "None"}</div>
                            <div>{u.email}</div>
                            <div>{u.phone_number || "None"}</div>


                            <HiddenField isVisible={!Boolean(u.passport_number)} canSee={true}>{u.passport_number || "None"}</HiddenField>

                            {user?.status === 'admin' && selectedStatus === 'agents' &&

                                <div>K<input className={styles.input} type="number"
                                    onChange={async (e) => { await updateSalesCoef(u.id, Number(e.currentTarget.value || '0')) }} value={u.sales_coef} />
                                </div>
                            }

                            <div className={styles.btns}>

                                {u.status === 'user' ?
                                    <Link to={`/client/${u.id}`} className={[styles.btn, styles.open].join(' ')}>
                                        <img src="/img/ico/link.svg" alt="open" />
                                    </Link>
                                    : <div style={{ marginLeft: '45px' }}></div>
                                }

                                {user?.status === 'admin' &&
                                    <button className={[styles.btn, styles.delete].join(' ')} onClick={async () => await deleteUser(u.id)} type='button' >
                                        <img src="/img/ico/delete.svg" alt="delete" />
                                    </button>
                                }
                            </div>

                        </div>
                    )
                })}
            </div >

        </>

    )
}
