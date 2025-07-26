import { Request, Response } from 'express';
import { UserService } from '../Services/user.service';
import bcrypt from 'bcrypt';

export class UserController {

    constructor(
        private userService: UserService
    ) { }

    public async createUser(req: Request, res: Response): Promise<Response> {
        const body = req.body;

        if (!body.name || !body.email || !body.password) {
            const errors = this.validateErrorCreateUserPayload(req);
            return res.status(400).json({ success: false, errors: errors });
        }

        const result = await this.userService.getUSerByEmail(req.body.email);

        if (result.length) {
            return res.status(400).json({ success: false, error: 'Usuário já cadastrado!' });
        }

        body.password = await this.generatePassHash(body.password);

        await this.userService.createUser(body);

        return res.status(200).json({ success: true, message: 'Usuário cadastrado com sucesso!' });
    }

    public async getUser(req: Request, res: Response): Promise<Response> {
        const user = req.body.user;
        return res.status(200).json({ success: true, data: user });
    }

    public async updateUser(req: Request, res: Response): Promise<Response> {
        const body = req.body;

        if (!body.user.id || !body.name) {
            return res.status(400).json({ success: false, error: 'Payload incoreto!' });
        }

        const name = body.name;
        const userId = body.user.id;

        const payloadUpdate = {
            id: userId,
            name: name
        }

        await this.userService.updateUser(payloadUpdate);

        return res.status(200).json({ success: true, message: 'Usuário atualizado com sucesso!' });
    }

    private async generatePassHash(password: string): Promise<string> {
        return bcrypt.hash(password, 10);
    }

    private validateErrorCreateUserPayload(req: Request): Array<string> {
        const errors: Array<string> = [];

        const body = req.body;

        const dataPayloadRequired = [
            'email',
            'name',
            'password'
        ];

        dataPayloadRequired.forEach((e: string) => {
            if (!body[e]) {
                errors.push(`Campo ${e} nao fornecido!`);
            }
        });

        return errors;
    }

}
