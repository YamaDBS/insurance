export enum InsuranceType {
    Life = 'Life',
    Pet = 'Pet',
    Travel = 'Travel'
}

export enum InsuranceStatus {
    NEW = 'New',
    ACTIVE = 'Active',
    CANCELED = 'Canceled',
    EXPIRED = 'Expired',
    PAID = 'Paid',
    PENDING = 'Pending'
}

export type InsurancesResponse = {
    count: number
    next: string | null
    previous: string | null
    results: Insurance[]
    error: string | null
}

export type InsuranceAPIResponse = {
    coverage: number,
    days_left: number,
    description: string,
    end_date: string
    id: number
    name: string
    number: string
    price: number
    start_date: string
    status: InsuranceStatus
    type: InsuranceType
}

export type InsuranceAPIRequest = {
    coverage: number,
    description: string,
    end_date: string
    name: string
    number: string
    price: number
    start_date: string
    status: InsuranceStatus
    type: InsuranceType
}

export type Insurance = {
    coverage: number,
    days_left: number,
    description: string,
    end_date: string
    id: number
    name: string
    number: string
    price: number
    start_date: string
    status: InsuranceStatus
    type: InsuranceType
}

export type InsuranceResponse = {
    insurance: Insurance | null
    error: string | null
}