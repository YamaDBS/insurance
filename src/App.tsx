import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { routes } from './routes';

import { createContext } from "react";
import { API, DEFAULT_INSURANCES, DEFAULT_USER, DEFAULT_USERS, InsuranceAPI, UserAPI } from './api/API';
import { InsurancesResponse } from './types/insurance';
import { UserResponse, UsersResponse } from './types/user';

export const UserContext = createContext<{
    userResponse: UserResponse;
    setUserResponse: Dispatch<SetStateAction<UserResponse>>;
}>({ userResponse: DEFAULT_USER, setUserResponse: () => { } });

export const UserInsurancesContext = createContext<{
    userInsurances: InsurancesResponse;
    setUserInsurances: Dispatch<SetStateAction<InsurancesResponse>>;
}>({ userInsurances: DEFAULT_INSURANCES, setUserInsurances: () => { } });

export const InsurancesContext = createContext<{
    insurances: InsurancesResponse;
    setInsurances: Dispatch<SetStateAction<InsurancesResponse>>;
}>({ insurances: DEFAULT_INSURANCES, setInsurances: () => { } });

export const UsersContext = createContext<{
    usersResponse: UsersResponse;
    setUsersResponse: Dispatch<SetStateAction<UsersResponse>>;
}>({ usersResponse: DEFAULT_USERS, setUsersResponse: () => { } });

const UserProvider = UserContext.Provider;
const InsurancesProvider = InsurancesContext.Provider;
const UsersProvider = UsersContext.Provider;

function App() {
    const [userResponse, setUserResponse] = useState<UserResponse>(DEFAULT_USER);
    const [insurances, setInsurances] = useState<InsurancesResponse>(DEFAULT_INSURANCES);
    const [usersResponse, setUsersResponse] = useState<UsersResponse>(DEFAULT_USERS);

    const value = { userResponse, setUserResponse }

    useEffect(() => {

        async function getUser() {
            const user = await UserAPI.getUser()
            setUserResponse(user)
        }

        async function getAllInsurances() {
            const data = await InsuranceAPI.getAllInsurances()

            if (!data) return

            setInsurances(data)
        }

        getUser();
        getAllInsurances();
    }, [])

    return (
        <UserProvider value={value}>
            <InsurancesProvider value={{ insurances, setInsurances }}>
                <UsersProvider value={{ usersResponse, setUsersResponse }}>

                    <BrowserRouter>
                        <Routes>
                            {routes.public.map((route) => <Route key={route.path} path={route.path} element={route.component} />)}
                            {userResponse.user?.status === 'agent' && routes.agent.map((route) => <Route key={route.path} path={route.path} element={route.component} />)}
                            {userResponse.user?.status === 'admin' && routes.admin.map((route) => <Route key={route.path} path={route.path} element={route.component} />)}
                        </Routes>
                    </BrowserRouter>

                </UsersProvider>
            </InsurancesProvider>
        </UserProvider>
    );


}

export default App;
