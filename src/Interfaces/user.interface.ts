export interface CreateUserInterface {
    name: string,
    email: string,
    password: string
}

export interface UpdateUserInterface {
    name: string,
    id: number
}

export interface GetUserInterface {
    id: number,
    name: string,
    email: string,
    password: string
}

