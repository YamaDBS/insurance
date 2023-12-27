import { Insurance, InsuranceAPIResponse } from "./insurance"

export type User = {
    id: number

    first_name: string
    last_name: string

    email: string
    phone_number?: string
    passport_number?: string

    weight?: number
    sex?: SEX
    birth_date?: string

    address?: string
    profession?: string

    illness?: string
    bad_habits?: string
    surgeries?: string

    income?: number

    status: 'user' | 'agent' | 'admin'

    sales_coef?: number
}

export enum SEX {
    MALE = 'Male',
    FEMALE = 'Female'
}

export type UsersResponse = {
    count: number
    next: string | null
    previous: string | null
    results: User[]
    error: string | null
}

export type UserAPIResp = {
    email: string
    is_staff: boolean
    is_agent: boolean
    is_client: boolean
    id: number
}

export type UserResponse = {
    user: User | null
    error: string | null
}

export type AgentsAPIResponse = {
    count: number
    next: string | null
    previous: string | null
    results: AgentsAPIResponseResults
    error: string | null
}

export type AgentsAPIResponseResults = {
    user: string,
    clients: ClientAPIResponse[]
}[]

export type ClientAPIResponse = {
    user: string,
    agent: string,
    phone_number: string,
    passport_number: string,
    address: string,
    birth_date: string,
    profession: string,
    income: number,
    sex: SEX,
    weight: number,
    illness: string,
    bad_habits: string,
    surgeries: string,

    insurances: InsuranceAPIResponse[]
}

export type ClientResponse = {
    client: Client | null,
    error: string | null
}

export type Client = {
    id: number,

    first_name: string,
    last_name: string,

    phone_number: string,
    passport_number: string,
    address: string,

    birth_date: string,
    profession: string,
    income: number,

    sex: SEX,
    weight: number,

    illness: string,
    bad_habits: string,
    surgeries: string,

    insurances: Insurance[]
}