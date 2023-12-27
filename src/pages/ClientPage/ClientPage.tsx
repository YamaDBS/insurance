import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UserContext } from '../../App';
import { API, DEFAULT_USER, UserAPI } from '../../api/API';
import Header from '../../components/Header/Header';
import InsuranceCard from '../../components/InsuranceCard/InsuranceCard';
import { Insurance } from '../../types/insurance';
import { User, UserResponse } from '../../types/user';
import ProfileTab from '../ProfilePage/tabs/ProfileTab';

import style from './ClientPage.module.scss';

export default function ClientPage() {

    const { userResponse } = useContext(UserContext);
    const { user, error } = userResponse;

    const [currentUser, setCurrentUser] = useState<UserResponse>(DEFAULT_USER)

    const [insurances, setInsurances] = useState<Insurance[]>([])

    const navigate = useNavigate();

    const { id } = useParams();

    useEffect(() => {
        if (!user) navigate('/')
    }, [user])

    useEffect(() => {
        if (!id) return

        async function getUser() {
            const resp = await UserAPI.getClient(Number(id))

            if (resp.error || !resp.client) return

            const user = {
                id: resp.client.id,
                first_name: resp.client.first_name,
                last_name: resp.client.last_name,
                address: resp.client.address,
                bad_habits: resp.client.bad_habits,
                birth_date: resp.client.birth_date,
                income: resp.client.income,
                sex: resp.client.sex,
                illness: resp.client.illness,
                passport_number: resp.client.passport_number,
                profession: resp.client.profession,
                surgeries: resp.client.surgeries,
                weight: resp.client.weight,
                phone_number: resp.client.phone_number,
                status: 'user',
                email: "",
            } as User

            setInsurances(resp.client.insurances)

            setCurrentUser({ error: null, user: user })
        }

        getUser();
    }, [id])

    return (
        <div className={style.page}>
            <Header />
            <ProfileTab userResponse={currentUser} setUserResponse={setCurrentUser} />

            {insurances.length > 0 &&
                <div className={style.insurances}>
                    <div className={style.insurance_header}>
                        <h2>Страховки</h2>
                    </div>

                    <div className={style.insurances_wrapper}>
                        {insurances.map(insurance => (<InsuranceCard insurance={insurance} key={insurance.number} />))}
                    </div>
                </div>
            }
        </div>
    )
}
