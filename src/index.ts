import express from 'express';
import { UserRoutes } from './Routes/user.routes';
import { UserController } from './Controllers/user.controller';
import { UserService } from './Services/user.service';
import { UserModel } from './Models/user.model';
import { AuthRoutes } from './Routes/auth.routes';
import { AuthController } from './Controllers/auth.controller';
import { ExpenseRoutes } from './Routes/expense.route';
import { ExpenseModel } from './Models/expense.model';
import { ExpenseService } from './Services/expense.service';
import { ExpenseController } from './Controllers/expense.controller';

class App {
    private port: number = 3030;
    private app: express.Application;

    constructor(
        private userRoute: UserRoutes,
        private expenseRoute: ExpenseRoutes,
        private authRoute: AuthRoutes
    ) {
        this.app = express();
        this.app.use(express.json());
    }

    public init() {

        this.app.use('/api/user', this.userRoute.getRouters());

        this.app.use('/api/expense', this.expenseRoute.getRouters());

        this.app.use('/api/auth', this.authRoute.getRouters());

        this.app.listen(this.port, () => {
            console.log(`it works on port ${this.port}`)
        });
    }
}

const userModel = new UserModel();
const userService = new UserService(userModel);
const userController = new UserController(userService);

const expenseModel = new ExpenseModel();
const expenseService = new ExpenseService(expenseModel);
const expenseController = new ExpenseController(expenseService);

const authController = new AuthController(userService);


const authRoutes = new AuthRoutes(
    authController
);

const userRoutes = new UserRoutes(
    userController,
    authRoutes
);

const expenseRoutes = new ExpenseRoutes(
    expenseController,
    authRoutes
);

const app = new App(
    userRoutes,
    expenseRoutes,
    authRoutes
);

app.init();