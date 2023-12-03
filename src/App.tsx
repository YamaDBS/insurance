import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { routes } from './routes';

import { createContext } from "react";
import Insurance, { InsuranceStatus, InsuranceType } from './types/insurance';
import { User } from './types/user';

export const UserContext = createContext<{
    user: User | null;
    setUser: Dispatch<SetStateAction<User | null>>;
}>({ user: null, setUser: () => { } });

export const UserInsurancesContext = createContext<{
    userInsurances: Insurance[];
    setUserInsurances: Dispatch<SetStateAction<Insurance[]>>;
}>({ userInsurances: [], setUserInsurances: () => { } });

export const InsurancesContext = createContext<{
    insurances: Insurance[];
    setInsurances: Dispatch<SetStateAction<Insurance[]>>;
}>({ insurances: [], setInsurances: () => { } });

export const UsersContext = createContext<{
    users: User[];
    setUsers: Dispatch<SetStateAction<User[]>>;
}>({ users: [], setUsers: () => { } });

const UserProvider = UserContext.Provider;
const UserInsurancesProvider = UserInsurancesContext.Provider;
const InsurancesProvider = InsurancesContext.Provider;
const UsersProvider = UsersContext.Provider;

const DEFAULT_USER: User = {
    status: "user",
    gender: "male",
    email: "test@gmail.com",
    first_name: "test",
    id: 1,
    last_name: "test",
    weight: 95,
    birth_date: "2002-11-12",
    phone_number: "+380931231234",
    address: "Peremogy Avenue, 32, Kyiv, 04116",
    passport_number: "123123123",
    profession: "Student",
    month_income: 300,
    illness: " ",
    badHabits: "Smoking",
    surgical_operations: "",
}

const DEFAULT_INSURANCES: Insurance[] = [
    {
        id: 1,
        user_id: 1,
        coverage: 10000,
        type: InsuranceType.Travel,
        creation_date: "2023-07-23",
        status: InsuranceStatus.NEW,
        price: 500,
        description: "Standert travel insurance",
        end_date: "2023-01-17",
        start_date: "2020-08-12",
        agent_id: 1,
        title: "My trip to USA",
    },
    {
        id: 2,
        user_id: 1,
        coverage: 100000,
        type: InsuranceType.Life,
        creation_date: "2022-09-25",
        status: InsuranceStatus.ACTIVE,
        price: 10000,
        description: "Life insurance for old people",
        end_date: "2021-11-02",
        start_date: "2020-01-21",
        agent_id: 2,
        title: "Grandma's",
    },
    {
        id: 3,
        user_id: 2,
        coverage: 100000,
        type: InsuranceType.Pet,
        creation_date: "2021-11-29",
        status: InsuranceStatus.EXPIRED,
        price: 10000,
        description: "Horse insurance",
        end_date: "2020-04-03",
        start_date: "2021-10-19",
        agent_id: 1,
        title: "Donny",
    },
    {
        id: 4,
        user_id: 1,
        coverage: 10000,
        type: InsuranceType.Travel,
        creation_date: "2021-04-25",
        status: InsuranceStatus.PAID,
        price: 500,
        description: "Standert travel insurance",
        end_date: "2022-01-24",
        start_date: "2020-08-27",
        agent_id: null,
        title: "Tommy's trip to Canada",
    },
    {
        id: 1,
        user_id: 1,
        coverage: 10000,
        type: InsuranceType.Travel,
        creation_date: "2023-07-23",
        status: InsuranceStatus.PENDING,
        price: 500,
        description: "Standert travel insurance",
        end_date: "2023-01-17",
        start_date: "2020-08-12",
        agent_id: 1,
        title: "My first trip to USA",
    },
    {
        id: 1,
        user_id: 1,
        coverage: 10000,
        type: InsuranceType.Travel,
        creation_date: "2023-07-23",
        status: InsuranceStatus.CANCELED,
        price: 500,
        description: "Standert travel insurance",
        end_date: "2023-01-17",
        start_date: "2020-08-12",
        agent_id: 2,
        title: "Trip to Israel",
    }
]

const DEFAULT_USERS: User[] = [
    {
        status: "user",
        gender: "male",
        email: "test@gmail.com",
        first_name: "test",
        id: 1,
        last_name: "test",
        weight: 95,
        birth_date: "2002-11-12",
        phone_number: "+380931231234",
        address: "Peremogy Avenue, 32, Kyiv, 04116",
        passport_number: "123123123",
        profession: "Student",
        month_income: 300,
        illness: " ",
        badHabits: "Smoking",
        surgical_operations: "",
    },
    {
        status: "user",
        gender: "female",
        email: "test2@gmail.com",
        first_name: "test2",
        id: 2,
        last_name: "test2",
        weight: 60,
        birth_date: "1993-01-22",
        phone_number: "+380683334455",
        address: "Peremogy Avenue, 32, Kyiv, 04116",
        passport_number: "32323232323",
        profession: "Surgent",
        month_income: 1000,
        illness: "",
        badHabits: "",
        surgical_operations: "",
    },
    {
        status: "user",
        gender: "male",
        email: "test3@gmail.com",
        first_name: "test3",
        id: 3,
        last_name: "test3",
        weight: 100,
        birth_date: "1998-08-03",
        phone_number: "+380453523",
        address: "Peremogy Avenue, 32, Kyiv, 04116",
        passport_number: "4534523454",
        profession: "Teacher",
        month_income: 500,
        illness: "",
        badHabits: "",
        surgical_operations: "",
    }
]


function App() {
    const [user, setUser] = useState<User | null>(null);
    const [userInsurances, setUserInsurances] = useState<Insurance[]>([]);
    const [insurances, setInsurances] = useState<Insurance[]>([]);
    const [users, setUsers] = useState<User[]>([]);

    const value = { user, setUser }

    useEffect(() => {
        const u: User = JSON.parse(localStorage.getItem('user') || 'null') || DEFAULT_USER
        const i: Insurance[] = JSON.parse(JSON.stringify(DEFAULT_INSURANCES))
        const uu: User[] = JSON.parse(JSON.stringify(DEFAULT_USERS))

        if (u) setUser(u)
        else setUser(null)

        if (u.status === 'user') setUserInsurances(i.filter(insurance => insurance.user_id === u?.id))
        else if (u.status === 'agent') setUserInsurances(i.filter(insurance => insurance.agent_id === u?.id))

        setInsurances(i)
        setUsers(uu)
    }, [])

    useEffect(() => {
        localStorage.setItem('users', JSON.stringify(users || []))
    }, [users]);

    useEffect(() => {
        if (user) localStorage.setItem('user', JSON.stringify(user))
    }, [user]);

    useEffect(() => {
        const uniqueInsurances = [...new Set([...userInsurances, ...insurances])];
        localStorage.setItem('insurances', JSON.stringify(uniqueInsurances || []))
    }, [userInsurances, insurances]);

    return (
        <UserProvider value={value}>
            <UserInsurancesProvider value={{ userInsurances, setUserInsurances }}>
                <InsurancesProvider value={{ insurances, setInsurances }}>
                    <UsersProvider value={{ users, setUsers }}>

                        <BrowserRouter>
                            <Routes>
                                {routes.public.map((route) => <Route key={route.path} path={route.path} element={route.component} />)}
                                {user?.status === 'agent' && routes.agent.map((route) => <Route key={route.path} path={route.path} element={route.component} />)}
                                {user?.status === 'admin' && routes.admin.map((route) => <Route key={route.path} path={route.path} element={route.component} />)}
                            </Routes>
                        </BrowserRouter>

                    </UsersProvider>
                </InsurancesProvider>
            </UserInsurancesProvider>
        </UserProvider>
    );


}

export default App;
