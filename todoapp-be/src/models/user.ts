import { type Group } from './todos'

export interface User {
    id: number
    email: string
    password: string
    groups: Group[]
}