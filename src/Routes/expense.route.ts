import { Router } from 'express';
import { ExpenseController } from '../Controllers/expense.controller';
import { AuthRoutes } from './auth.routes';

export class ExpenseRoutes {
    private router: Router;

    constructor(
        private expenseController: ExpenseController,
        private authRouters: AuthRoutes
    ) {
        this.router = Router();

        this.router.post('/create', this.authRouters.authMiddleware, this.expenseController.createExpense.bind(this.expenseController));

        this.router.get('/read', this.authRouters.authMiddleware, this.expenseController.readExpenses.bind(this.expenseController));

        this.router.delete('/delete/:id', this.authRouters.authMiddleware, this.expenseController.removeExpense.bind(this.expenseController));
    }

    public getRouters() {
        return this.router;
    }

}