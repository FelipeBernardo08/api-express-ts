import { Router } from 'express';
import { AuthController } from '../Controllers/auth.controller';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

export class AuthRoutes {
    private router: Router;
    constructor(
        private authController: AuthController,
    ) {
        this.router = Router();
        this.router.post('/login', this.authController.login.bind(this.authController));
    }

    public getRouters() {
        return this.router;
    }

    public async authMiddleware(req: Request, res: Response, next: NextFunction) {
        try {
            const authHeader = req.headers['authorization'];
            const token = authHeader?.split(' ')[1];

            if (!token) {
                return res.status(401).json({ success: false, error: 'Token não fornecido' });
            }

            const payload = {
                ...req.body,
                user: jwt.verify(token, process.env.SECRET ?? '')
            }

            req.body = payload;
            next();
        } catch (e: any) {
            if (e.name && e.name == 'TokenExpiredError') {
                return res.status(401).json({ success: false, error: 'Token expirado, realize o login novamente!' });
            }
            return res.status(500).json({ sucess: false, error: e.message ?? 'Erro, entre em contato com suporte!' });
        }
    }

}