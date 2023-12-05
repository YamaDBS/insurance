import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { routes } from './routes';

import { get } from 'http';
import { createContext } from "react";
import { API } from './api/API';
import Insurance from './types/insurance';
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

function App() {
    const [user, setUser] = useState<User | null>(null);
    const [userInsurances, setUserInsurances] = useState<Insurance[]>([]);
    const [insurances, setInsurances] = useState<Insurance[]>([]);
    const [users, setUsers] = useState<User[]>([]);

    const value = { user, setUser }

    useEffect(() => {

        async function getUser() {
            const user = await API.getUser()

            if (user) setUser(user)
            else setUser(null)
        }

        async function getAllInsurances() {
            const insurances = await API.getAllInsurances()

            setInsurances(insurances)
        }

        getUser();
        getAllInsurances();
    }, [])

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
