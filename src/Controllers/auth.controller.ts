import { Request, Response } from 'express';
import { UserService } from '../Services/user.service';
import { GetUserInterface } from '../Interfaces/user.interface';
import Redis from 'ioredis';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import 'dotenv/config';

export class AuthController {

    private secret: string = process.env.SECRET ?? '';
    private redis: Redis;
    private redisHost: string = process.env.REDIS_HOST ?? '';
    private redisPort: string = process.env.REDIS_PORT ?? '';

    constructor(
        private userService: UserService,
    ) {
        this.redis = new Redis({
            host: this.redisHost,
            port: parseInt(this.redisPort)
        });
    }

    public async login(req: Request, res: Response) {
        const body = req.body;

        if (!body.login || !body.password) {
            const errors = this.validateErrorLoginPayload(req);
            return res.status(400).json({ sucess: false, errors: errors });
        }

        const login = body.login;
        const password = body.password;

        const userCache = await this.getUserOnCacheByEmail(login);

        if (!userCache.length) {
            const user = await this.userService.getUSerByEmail(login);

            if (!user.length) {
                return res.status(404).json({ success: false, error: 'Usuario nao cadastrado!' });
            }

            if (!bcrypt.compare(user[0].password, password)) {
                return res.status(400).json({ success: false, error: 'Senha incorreta!' });
            }

            await this.redis.set(`user:${login}`, JSON.stringify(user), 'EX', 60);

            const token = jwt.sign({ id: user[0].id, email: user[0].email, name: user[0].name, pass: user[0].password }, this.secret, { expiresIn: '1h' });

            return res.status(200).json({ success: true, token: token });
        }

        if (!bcrypt.compare(userCache[0].password, password)) {
            return res.status(400).json({ success: false, error: 'Senha incorreta!' });
        }

        const token = jwt.sign({ login: userCache[0].email, name: userCache[0].name, pass: userCache[0].password }, this.secret, { expiresIn: '1h' });

        return res.status(200).json({ success: true, token: token });

    }

    private validateErrorLoginPayload(req: Request): Array<string> {
        const errors: Array<string> = [];

        const body = req.body;

        const dataPayloadRequired = [
            'login',
            'password'
        ];

        dataPayloadRequired.forEach((e: string) => {
            if (!body[e]) {
                errors.push(`Campo ${e} nao fornecido!`);
            }
        });

        return errors;
    }

    private async getUserOnCacheByEmail(email: string): Promise<Array<GetUserInterface>> {
        const dataRedis: string | null = await this.redis.get(`user:${email}`);
        if (!dataRedis) {
            return [];
        }
        const user: Array<GetUserInterface> = JSON.parse(dataRedis);
        return user;
    }

}