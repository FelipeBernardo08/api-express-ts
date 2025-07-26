export interface CreateExpenseInterface {
    title: string,
    value: number,
    user_id: number
}

export interface GetExpenses {
    title: string,
    value: string,
    user_id: number,
    id: number
}

export interface UpdateExpense {
    id: number,
    user_id: number
}

export interface DeleteExpense {
    id: number,
    user_id: number
}