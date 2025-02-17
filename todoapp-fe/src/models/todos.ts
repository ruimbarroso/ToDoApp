export interface ToDo {
    id: number
    name: string
    is_complete: boolean
    due_date: Date
    group_id: number
}

export interface Group {
    id: number
    name: string
    description: string
    color: string
    todos: ToDo[]
    user_id: number
}