import { create } from "domain";
import { CreateExpenseInterface, DeleteExpense, GetExpenses } from "../Interfaces/expense.interface";
import { ExpenseModel } from "../Models/expense.model";

export class ExpenseService {

    constructor(
        private expenseModel: ExpenseModel
    ) { }

    public async createExpense(createExpense: CreateExpenseInterface): Promise<any> {
        return await this.expenseModel.creteExpense(createExpense);
    }

    public async readExpensesByUserId(userId: number): Promise<any> {
        const expenses = await this.expenseModel.getExpenseByUserId(userId);

        let totalExpenses = 0;

        expenses.forEach((element: GetExpenses) => {
            totalExpenses += parseFloat(element.value);
        });

        const dataReturnExpense = {
            expenses: expenses,
            total: totalExpenses
        }

        return dataReturnExpense;
    }

    public async removeExpenseByUserIdAndId(deleteExpense: DeleteExpense): Promise<any> {
        return await this.expenseModel.deleteExpense(deleteExpense);
    }

}