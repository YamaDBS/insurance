export type User = {
    id: number

    username: string

    first_name: string
    last_name: string

    email: string
    phone_number?: string
    passport_number?: string

    weight?: number
    gender?: string
    birth_date?: string

    address?: string
    profession?: string

    illness?: string
    badHabits?: string
    surgical_operations?: string

    month_income?: number

    status: 'user' | 'agent' | 'admin'
}