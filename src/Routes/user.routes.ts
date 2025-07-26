import { Router } from 'express';
import { UserController } from '../Controllers/user.controller';
import { AuthRoutes } from './auth.routes';

export class UserRoutes {
    private router: Router;

    constructor(
        private userController: UserController,
        private authRouters: AuthRoutes
    ) {
        this.router = Router();

        this.router.post('/create', this.userController.createUser.bind(this.userController));

        this.router.put('/update', this.authRouters.authMiddleware, this.userController.updateUser.bind(this.userController));

        this.router.get('/me', this.authRouters.authMiddleware, this.userController.getUser.bind(this.userController));
    }

    public getRouters() {
        return this.router;
    }
}
