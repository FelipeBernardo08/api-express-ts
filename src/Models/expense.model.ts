import { db } from '../Database/database';
import { CreateExpenseInterface, DeleteExpense } from "../Interfaces/expense.interface";

export class ExpenseModel {

    constructor() { }

    public async creteExpense(createExpense: CreateExpenseInterface): Promise<any> {
        const sql = `
            INSERT INTO
                expenses (user_id, title, value)
            VALUES
                (?, ?, ?)
        `;

        const params = [createExpense.user_id, createExpense.title, createExpense.value];

        return await db.query(sql, params);
    }

    public async getExpenseByUserId(userId: number): Promise<any> {
        const sql = `
            SELECT
                *
            FROM
                expenses
            WHERE
                user_id = ?
        `;

        const params = [userId];

        const [resp] = await db.query(sql, params);

        return resp;
    }

    public async deleteExpense(deleteExpense: DeleteExpense): Promise<any> {
        const sql = `
            DELETE FROM
                expenses
            WHERE
                user_id = ?
            AND
                id = ?
        `;

        const params = [deleteExpense.user_id, deleteExpense.id];

        return await db.query(sql, params);
    }

}