export enum InsuranceType {
    Life = 'life',
    Pet = 'pet',
    Travel = 'travel'
}

export enum InsuranceStatus {
    NEW = 'new',
    ACTIVE = 'active',
    CANCELED = 'canceled',
    EXPIRED = 'expired',
    PAID = 'paid',
    PENDING = 'pending'
}

type Insurance = {
    id: number
    description: string
    title: string

    price: number
    coverage: number

    type: InsuranceType
    status: InsuranceStatus

    end_date: string
    start_date: string
    creation_date: string

    user_id: number
    agent_id: number | null
}

export default Insurance