import axios from "axios";
import { Insurance, InsuranceAPIRequest, InsuranceAPIResponse, InsuranceResponse, InsuranceStatus, InsurancesResponse } from "../types/insurance";
import { Client, ClientAPIResponse, ClientResponse, SEX, User, UserAPIResp, UserResponse, UsersResponse } from './../types/user';

axios.defaults.headers.common['Content-Type'] = 'application/json'

export const DEFAULT_INSURANCES: InsurancesResponse = { count: 0, next: null, previous: null, results: [], error: null }
export const DEFAULT_USERS: UsersResponse = { count: 0, next: null, previous: null, results: [], error: null }
export const DEFAULT_USER: UserResponse = { user: null, error: null }
export const DEFAULT_INSURANCE: InsuranceResponse = { error: null, insurance: null }

export class API {
    public static BASE_URL = 'http://localhost:8000/api/'
    public static token = sessionStorage.getItem('token')

    public static setToken(token: string) {
        sessionStorage.setItem('token', token)

        if (token) axios.defaults.headers.common['Authorization'] = 'Token ' + token
    }
}

export class UserAPI {
    private static filterUser(user: User, query?: string): boolean {
        return Boolean(user.email.includes(query || '')
            || user.phone_number?.includes(query || '')
            || (user.first_name + ' ' + user.last_name).includes(query || '')
            || user.passport_number?.includes(query || ''))
    }

    private static getStatus(user: UserAPIResp): "user" | "agent" | "admin" {
        if (user.is_agent) return "agent"
        else if (user.is_client) return "user"
        else return "admin"
    }

    public static async setAgentSalesKoef(id: number, sales_coef: number): Promise<void> {
        try {
            const token = sessionStorage.getItem('token')

            if (!token) throw new Error('Failed to authenticate... Try to login again.')
            else API.setToken(token)

            await axios.post(API.BASE_URL + 'insurance/redis/?agent=' + id, { sales_coef: sales_coef })
        }
        catch (error: any) {

        }
    }

    public static async getAgentStatistics(id: number): Promise<number> {
        try {
            const token = sessionStorage.getItem('token')

            if (!token) throw new Error('Failed to authenticate... Try to login again.')
            else API.setToken(token)

            const response = await axios.get(API.BASE_URL + 'insurance/redis/?agent=' + id)
            const data = response.data.agent_sales_coef as string

            return Number(data || 0)
        }
        catch (error: any) {
            return 0
        }
    }

    public static async deleteUser(id: number): Promise<void> {
        try {
            const token = sessionStorage.getItem('token')

            if (!token) throw new Error('Failed to authenticate... Try to login again.')
            else API.setToken(token)

            await axios.delete(API.BASE_URL + 'user/all/' + id)
        }
        catch (error: any) {
            const messages: string[] = []

            Object.keys(error.response.data).forEach((key) => messages.push(error.response.data[key]))

            throw new Error(messages.join('\n'))
        }
    }

    public static async getUser(): Promise<UserResponse> {
        try {
            const token = sessionStorage.getItem('token')

            if (!token) throw new Error('Failed to authenticate... Try to login again.')
            else API.setToken(token)


            const response = await axios.get(API.BASE_URL + 'user/me/')

            const data = response.data as UserAPIResp

            if (data.is_client) {
                try {
                    const client = await (await axios.get(API.BASE_URL + 'insurance/me/')).data as Client

                    const user: User = {
                        id: data.id,

                        email: data.email,
                        first_name: client.first_name || '',
                        last_name: client.last_name || '',

                        status: this.getStatus(data),

                        address: client.address || '',
                        birth_date: client.birth_date || '',

                        phone_number: client.phone_number || '',
                        passport_number: client.passport_number || '',

                        profession: client.profession || '',
                        income: client.income || 0,

                        illness: client.illness || '',
                        bad_habits: client.bad_habits || '',
                        surgeries: client.surgeries || '',

                        sex: client.sex || '',
                        weight: client.weight || 0,
                    }

                    return { user: user, error: null }
                }
                catch (error: any) {
                    const user: User = {
                        email: data.email,
                        first_name: '',
                        id: data.id,
                        last_name: data.email,
                        status: this.getStatus(data),
                    }

                    return { user: user, error: null }
                }
            }
            else {
                const user: User = {
                    email: data.email,
                    first_name: '',
                    id: data.id,
                    last_name: data.email,
                    status: this.getStatus(data),
                }

                return { user: user, error: null }
            }
        }
        catch (error: any) {
            return { user: null, error: error.message }
        }
    }

    private static async updateEmail(email: string, password: string): Promise<void> {
        try {
            const token = sessionStorage.getItem('token')

            if (!token) throw new Error('Failed to authenticate... Try to login again.')
            else API.setToken(token)

            await axios.put(API.BASE_URL + 'user/me/', { email: email, password: password })
        }
        catch (error: any) {
            const messages: string[] = []

            Object.keys(error.response.data).forEach((key) => messages.push(error.response.data[key]))

            throw new Error(messages.join('\n'))
        }
    }

    public static async getAllAgents(query?: string): Promise<UsersResponse> {
        const response = await this.getAllUsers(query)
        const agents = response.results.filter(user => user.status === 'agent')

        const arr = agents.map(async agent => {
            const scoef = await this.getAgentStatistics(agent.id)
            return { ...agent, sales_coef: scoef } as User
        })

        const resp = await Promise.all(arr)

        return { ...response, results: resp }
    }

    public static async getAllClients(query?: string): Promise<UsersResponse> {
        const response = await this.getAllUsers(query)
        const clients = response.results.filter(user => user.status === 'user')

        return { ...response, results: clients }
    }

    public static async getAllUsers(query?: string): Promise<UsersResponse> {
        try {
            const token = sessionStorage.getItem('token')

            if (!token) throw new Error('Failed to authenticate... Try to login again.')
            else API.setToken(token)

            const response = await axios.get(API.BASE_URL + `user/all`, {
                headers: {
                    'Authorization': 'Token ' + token
                }
            })

            const resp = response.data as { count: number, next: string | null, previous: string | null, results: UserAPIResp[] }

            const currentUser = await this.getUser()

            const arr = resp.results.map(user => UserAPI.getClient(user.id))
            const clientData = (await Promise.all(arr)).filter(el => el.client !== null)

            const clients: User[] = resp.results.map(user => {
                const client = clientData.find(el => el.client?.id === user.id)

                if (client && client.client) {
                    return {
                        email: user.email,
                        first_name: client.client.first_name || '',
                        id: user.id,
                        last_name: client.client.last_name || '',
                        status: this.getStatus(user),
                        address: client.client.address || '',
                        birth_date: client.client.birth_date || '',
                        phone_number: client.client.phone_number || '',
                        profession: client.client.profession || '',
                        bad_habits: client.client.bad_habits || '',
                        illness: client.client.illness || '',
                        surgeries: client.client.surgeries || '',
                        income: client.client.income || 0,
                        passport_number: client.client.passport_number || '',
                        sex: client.client.sex || '',
                        weight: client.client.weight || 0,
                    } as User
                } else {
                    return {
                        email: user.email,
                        first_name: '',
                        id: user.id,
                        last_name: user.email,
                        status: this.getStatus(user),
                        username: user.email,
                    } as User
                }

            }).filter(user => this.filterUser(user, query)).filter(user => user.id !== currentUser.user?.id)

            return { count: resp.count, next: resp.next, previous: resp.previous, results: clients, error: null }

        }
        catch (error: any) {
            const messages: string[] = []

            Object.keys(error.response.data).forEach((key) => messages.push(error.response.data[key]))

            return { ...DEFAULT_USERS, error: messages.join('\n') }
        }
    }

    public static async getAgentUsers(query?: string): Promise<UsersResponse> {
        try {
            const token = sessionStorage.getItem('token')

            if (!token) throw new Error('Failed to authenticate... Try to login again.')
            else API.setToken(token)

            const agent = await this.getUser()

            const response = await axios.get(API.BASE_URL + `insurance/agents/${agent.user?.id}`, {
                headers: {
                    'Authorization': 'Token ' + token
                }
            })

            const info = await this.getAllUsers(query)
            const data = response.data.clients as ClientAPIResponse[]

            const users = data.map(client => {
                const user = info.results.find(el => el.email === client.user)

                if (user) return user
                else return {
                    email: client.user,
                    first_name: '',
                    id: 0,
                    last_name: client.user,
                    status: 'user',
                    username: client.user,
                    address: client.address,
                    birth_date: client.birth_date,
                    phone_number: client.phone_number,
                    profession: client.profession,
                    bad_habits: client.bad_habits,
                    illness: client.illness,
                    surgeries: client.surgeries,
                    income: client.income,
                    passport_number: client.passport_number,
                    sex: client.sex,
                    weight: client.weight,
                } as User
            })

            return { count: users.length, next: response.data.next, previous: response.data.previous, results: users, error: null }

        }
        catch (error: any) {
            const messages: string[] = []

            Object.keys(error.response.data).forEach((key) => messages.push(error.response.data[key]))
            return { ...DEFAULT_USERS, error: messages.join('\n') }
        }
    }


    public static async login(email: string, password: string): Promise<UserResponse> {
        try {
            const response = await axios.post(API.BASE_URL + 'user/login/', {
                email: email,
                password: password
            })

            const token = response.data.token
            sessionStorage.setItem('token', token)
            API.setToken(token)

            const user = await this.getUser()
            return user
        }
        catch (error: any) {
            const messages: string[] = []

            Object.keys(error.response.data).forEach((key) => messages.push(error.response.data[key]))

            return { error: messages.join('\n'), user: null }
        }
    }

    public static async register(email: string, password: string, userType: 'is_client' | 'is_agent'): Promise<User> {
        try {
            const isClient = userType === 'is_client'
            const isAgent = userType === 'is_agent'

            const response = await axios.post(API.BASE_URL + 'user/register/', {
                email: email,
                password: password,
                is_client: isClient,
                is_agent: isAgent,
            })

            const user = response.data as User

            return user
        }
        catch (error: any) {
            const messages: string[] = []

            Object.keys(error.response.data).forEach((key) => messages.push(error.response.data[key]))

            throw new Error(messages.join('\n'))
        }
    }


    public static async getClient(id: number): Promise<ClientResponse> {
        try {
            const token = sessionStorage.getItem('token')

            if (!token) throw new Error('Failed to authenticate... Try to login again.')
            else API.setToken(token)

            const response = await axios.get(API.BASE_URL + 'insurance/clients/' + id)

            const data = response.data as ClientAPIResponse

            const insurances = data.insurances.map(insurance => {
                const ins: Insurance = {
                    id: insurance.id,
                    name: insurance.name,
                    number: insurance.number,
                    coverage: insurance.coverage,
                    price: insurance.price,
                    start_date: insurance.start_date,
                    end_date: insurance.end_date,
                    days_left: insurance.days_left,
                    description: insurance.description,
                    status: insurance.status,
                    type: insurance.type,
                }

                return ins
            })

            const client: Client = {
                first_name: data.user.split(' ').at(0) || '',
                id: id,
                last_name: data.user.split(' ').at(1) || '',
                phone_number: data.phone_number,
                address: data.address,
                birth_date: data.birth_date,
                profession: data.profession,
                sex: data.sex as SEX,
                weight: data.weight,
                illness: data.illness,
                bad_habits: data.bad_habits,
                surgeries: data.surgeries,
                income: data.income,
                passport_number: data.passport_number,
                insurances: insurances,
            }

            return { client: client, error: null }
        }
        catch (error: any) {
            const messages: string[] = []

            Object.keys(error.response.data).forEach((key) => messages.push(error.response.data[key]))

            return { client: null, error: messages.join('\n') }
        }
    }

    public static async updateClientSelf(client: User, password?: string): Promise<UserResponse> {
        try {
            const token = sessionStorage.getItem('token')

            if (!token) throw new Error('Failed to authenticate... Try to login again.')
            else API.setToken(token)

            console.log(client.birth_date)

            const response = await axios.put(API.BASE_URL + 'insurance/me/', {
                user: client.first_name + ' ' + client.last_name,
                address: client.address,
                birth_date: '2000-01-01',
                bad_habits: client.bad_habits,
                illness: client.illness,
                income: client.income,
                passport_number: client.passport_number,
                phone_number: client.phone_number,
                profession: client.profession,
                sex: client.sex,
                surgeries: client.surgeries,
                weight: client.weight,
                insurances: [],
            })

            const data = response.data as ClientAPIResponse

            const resp: User = {
                ...client,
                ...data,
            }

            if (client.email && password) {
                await this.updateEmail(client.email, password)

                resp.email = client.email
            }

            return { user: resp, error: null }
        }
        catch (error: any) {
            const messages: string[] = []

            Object.keys(error.response.data).forEach((key) => messages.push(error.response.data[key]))

            return { user: null, error: messages.join('\n') }
        }
    }

    public static async updateClient(client: User): Promise<UserResponse> {
        try {
            const token = sessionStorage.getItem('token')

            if (!token) throw new Error('Failed to authenticate... Try to login again.')
            else API.setToken(token)

            const c = { ...client }

            if (c.first_name.split('').every(el => el === ' ')) c.first_name = ''
            if (c.last_name.split('').every(el => el === ' ')) c.last_name = ''
            if (c.address?.split('').every(el => el === ' ') || !c.address) c.address = 'none'
            if (c.birth_date?.split('').every(el => el === ' ')) c.birth_date = ''
            if (c.profession?.split('').every(el => el === ' ')) c.profession = ''
            if (c.illness?.split('').every(el => el === ' ')) c.illness = ''
            if (c.bad_habits?.split('').every(el => el === ' ')) c.bad_habits = ''
            if (c.surgeries?.split('').every(el => el === ' ')) c.surgeries = ''
            if (c.passport_number?.split('').every(el => el === ' ')) c.passport_number = ''
            if (c.phone_number?.split('').every(el => el === ' ')) c.phone_number = ''

            const response = await axios.put(API.BASE_URL + 'insurance/clients/' + client.id, {
                user: client.first_name + ' ' + client.last_name,
                address: client.address,
                birth_date: client.birth_date,
                bad_habits: client.bad_habits,
                illness: client.illness,
                income: client.income,
                passport_number: client.passport_number,
                phone_number: client.phone_number,
                profession: client.profession,
                sex: client.sex,
                surgeries: client.surgeries,
                weight: client.weight,
            })

            const data = response.data as ClientAPIResponse

            const resp: User = {
                ...client,
                ...data,
            }

            return { user: resp, error: null }
        }
        catch (error: any) {
            const messages: string[] = []

            Object.keys(error.response.data).forEach((key) => messages.push(error.response.data[key]))

            return { user: null, error: messages.join('\n') }
        }
    }
}

export class InsuranceAPI {
    public static async getAllInsurances(): Promise<InsurancesResponse> {
        try {
            const response = await axios.get(API.BASE_URL + 'insurance/insurances')

            const data = response.data as InsurancesResponse

            return { ...data, error: null }
        }
        catch (error: any) {
            const messages: string[] = []

            Object.keys(error.response.data).forEach((key) => messages.push(error.response.data[key]))

            return { ...DEFAULT_INSURANCES, error: messages.join('\n') }
        }
    }

    public static async updateInsuranceStatus(id: number, status: InsuranceStatus): Promise<InsuranceResponse> {
        try {
            const token = sessionStorage.getItem('token')

            if (!token) throw new Error('Failed to authenticate... Try to login again.')

            const response = await axios.put(API.BASE_URL + 'insurance/insurances/?search=' + id, { status: status })

            const data = response.data as InsuranceAPIResponse

            return { insurance: data, error: null }
        }
        catch (error: any) {
            const messages: string[] = []

            if (error.response.data.status) {
                return { insurance: null, error: error.response.data.status[0] }
            } else {
                Object.keys(error.response.data).forEach((key) => messages.push(error.response.data[key]))

                return { insurance: null, error: messages.join('\n') }
            }
        }
    }

    public static async searchInsurances(query: string, sort?: 'start_date' | 'name' | 'end_date' | 'coverage' | 'price', sortDirection?: 'bigger' | 'smaller'): Promise<InsurancesResponse> {
        try {
            const response = await axios.get(API.BASE_URL + 'insurance/insurances?search=' + query)
            const insurances = response.data as InsurancesResponse

            let sorted = []

            switch (sort) {
                case 'coverage':
                    sorted = [...insurances.results].sort((a, b) => {
                        if (sortDirection === 'bigger') return b.coverage - a.coverage
                        else return a.coverage - b.coverage
                    })
                    break

                case 'end_date':
                    sorted = [...insurances.results].sort((a, b) => {
                        if (sortDirection === 'bigger') return b.end_date.localeCompare(a.end_date)
                        else return a.end_date.localeCompare(b.end_date)
                    })
                    break

                case 'name':
                    sorted = [...insurances.results].sort((a, b) => {
                        if (sortDirection === 'bigger') return a.name.localeCompare(b.name)
                        else return b.name.localeCompare(a.name)
                    })
                    break


                case 'price':
                    sorted = [...insurances.results].sort((a, b) => {
                        if (sortDirection === 'bigger') return b.price - a.price
                        else return a.price - b.price
                    })
                    break

                case 'start_date':
                    sorted = [...insurances.results].sort((a, b) => {
                        if (sortDirection === 'bigger') return b.start_date.localeCompare(a.start_date)
                        else return a.start_date.localeCompare(b.start_date)
                    })
                    break


                default:
                    sorted = [...insurances.results]
            }

            return { ...insurances, results: sorted, error: null }
        }
        catch (error: any) {
            const messages: string[] = []

            Object.keys(error.response.data).forEach((key) => messages.push(error.response.data[key]))
            return { ...DEFAULT_INSURANCES, error: messages.join('\n') }
        }
    }

    public static async createInsurance(insurance: InsuranceAPIRequest): Promise<InsuranceResponse> {
        function getRandomNumber(): string {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
            const numbers = '0123456789'

            let result = ''

            for (let i = 0; i < 2; i++) {
                result += chars.charAt(Math.floor(Math.random() * chars.length))
            }

            for (let i = 0; i < 5; i++) {
                result += numbers.charAt(Math.floor(Math.random() * numbers.length))
            }

            for (let i = 0; i < 2; i++) {
                result += chars.charAt(Math.floor(Math.random() * chars.length))
            }

            return result
        }

        try {
            const token = sessionStorage.getItem('token')

            if (!token) throw new Error('Failed to authenticate... Try to login again.')
            else API.setToken(token)

            const response = await axios.post(API.BASE_URL + 'insurance/insurances/', { ...insurance, number: getRandomNumber() })

            const data = response.data as InsuranceAPIResponse

            return { insurance: data, error: null }
        }
        catch (error: any) {
            if (error.response.data.number) {
                return { insurance: null, error: error.response.data.number[0] }
            } else if (error.response.data.name) {
                return { insurance: null, error: error.response.data.name[0] }
            } else {
                const messages: string[] = []

                Object.keys(error.response.data).forEach((key) => messages.push(error.response.data[key]))

                return { insurance: null, error: error.message }
            }
        }
    }
}