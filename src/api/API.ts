import axios from "axios"
import Insurance from "../types/insurance"
import { User } from "../types/user"

axios.defaults.headers.common['Content-Type'] = 'application/json'

export class API {
    public static readonly BASE_URL = 'http://127.0.0.1:8000/api/'

    public static async getUser(): Promise<User | undefined> {
        try {
            const token = sessionStorage.getItem('token')

            if (!token) return undefined

            const response = await axios.get(API.BASE_URL + 'user/me/', {
                headers: {
                    'Authorization': 'Token ' + token
                }
            })
            const user = response.data as User

            user.first_name = 'John'
            user.last_name = 'Doe'
            user.status = 'user'

            return user
        }
        catch (error) {
            return undefined
        }
    }

    public static async updateUser(user: User): Promise<User | undefined> {
        try {
            const token = sessionStorage.getItem('token')

            if (!token) return undefined

            const response = await axios.put(API.BASE_URL + 'user/me/', user, {
                headers: {
                    'Authorization': 'Token ' + token
                }
            })
            const newUser = response.data as User

            return newUser
        }
        catch (error) {
            return undefined
        }
    }

    public static async login(username: string, password: string): Promise<User | undefined> {
        try {
            const response = await axios.post(API.BASE_URL + 'user/login/', {
                username: username,
                password: password
            })

            const token = response.data.token
            sessionStorage.setItem('token', token)

            const user = await API.getUser()
            return user
        }
        catch (error) {
            return undefined
        }
    }

    public static async register(email: string, password: string, username: string): Promise<User | undefined> {
        try {
            const response = await axios.post(API.BASE_URL + 'user/register/', {
                email: email,
                password: password,
                username: username
            })

            const user = response.data as User

            return user
        }
        catch (error) {
            return undefined
        }
    }

    public static async getAllInsurances(): Promise<Insurance[]> {
        try {
            const response = await axios.get(API.BASE_URL + 'insurance/insurances/')
            const insurances = response.data as Insurance[]

            return insurances
        }
        catch (error) {
            return []
        }
    }

    public static async searchInsurances(query: string): Promise<Insurance[]> {
        try {
            const response = await axios.get(API.BASE_URL + 'insurance/insurances/?search=' + query)
            const insurances = response.data as Insurance[]

            return insurances
        }
        catch (error) {
            return []
        }
    }

    // public static async getInsurance(id: number): Promise<Insurance | undefined> {
    //     try {
    //         const response = await axios.get(API.BASE_URL + 'insurance/insurances/' + id + '/')
    //         const insurance = response.data as Insurance

    //         return insurance
    //     }
    //     catch (error) {
    //         return undefined
    //     }
    // }

    // public static async createInsurance(insurance: Insurance): Promise<Insurance | undefined> {
    //     try {
    //         const response = await axios.post(API.BASE_URL + 'insurance/insurances/', insurance)
    //         const newInsurance = response.data as Insurance

    //         return newInsurance
    //     }
    //     catch (error) {
    //         return undefined
    //     }
    // }

    // public static async updateInsurance(insurance: Insurance): Promise<Insurance | undefined> {
    //     try {
    //         const response = await axios.put(API.BASE_URL + 'insurance/insurances/' + insurance.id + '/', insurance)
    //         const newInsurance = response.data as Insurance

    //         return newInsurance
    //     }
    //     catch (error) {
    //         return undefined
    //     }
    // }

    // public static async deleteInsurance(id: number): Promise<boolean> {
    //     try {
    //         await axios.delete(API.BASE_URL + 'insurance/insurances/' + id + '/')
    //         return true
    //     }
    //     catch (error) {
    //         return false
    //     }
    // }

    public static async getUserInsurances(): Promise<Insurance[]> {
        try {
            const response = await axios.get(API.BASE_URL + 'insurance/user-insurances/')
            const insurances = response.data as Insurance[]

            return insurances
        }
        catch (error) {
            return []
        }
    }
}