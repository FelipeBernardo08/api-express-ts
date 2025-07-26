import { Request, Response } from 'express';
import { ExpenseService } from '../Services/expense.service';
import { DeleteExpense } from '../Interfaces/expense.interface';

export class ExpenseController {

    constructor(
        private expenseService: ExpenseService
    ) { }

    public async createExpense(req: Request, res: Response): Promise<Response> {
        const body = req.body;

        const userId = body.user.id;

        if (!body.title || !body.value) {
            const errors = this.validateErrorCreateUserPayload(req);
            return res.status(400).json({ success: false, errors: errors });
        }

        const payloadCreateExpense = {
            user_id: userId,
            title: body.title,
            value: body.value
        }

        await this.expenseService.createExpense(payloadCreateExpense);

        return res.status(200).json({ success: true, message: 'Despesa criada com sucesso!' });
    }

    public async readExpenses(req: Request, res: Response): Promise<Response> {
        const body = req.body;

        const userId = body.user.id;

        const expenses = await this.expenseService.readExpensesByUserId(userId);

        return res.status(200).json({ success: true, data: expenses });
    }

    public async removeExpense(req: Request, res: Response): Promise<Response> {
        const body = req.body;

        const userId: number = body.user.id;

        const expenseId: number = parseInt(req.params.id);

        if (!expenseId) {
            return res.status(400).json({ success: false, error: 'Id da despesa não fornecido!' });
        }

        const payloadRemoveExpense = {
            id: expenseId,
            user_id: userId
        }

        await this.expenseService.removeExpenseByUserIdAndId(payloadRemoveExpense);

        return res.status(200).json({ success: true, message: 'Despesa excluída com sucesso!' });
    }

    private validateErrorCreateUserPayload(req: Request): Array<string> {
        const errors: Array<string> = [];

        const body = req.body;

        const dataPayloadRequired = [
            'title',
            'value'
        ];

        dataPayloadRequired.forEach((e: string) => {
            if (!body[e]) {
                errors.push(`Campo ${e} nao fornecido!`);
            }
        });

        return errors;
    }
}