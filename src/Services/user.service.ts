import { CreateUserInterface, GetUserInterface, UpdateUserInterface } from '../Interfaces/user.interface';
import { UserModel } from '../Models/user.model';

export class UserService {
    constructor(
        private userModel: UserModel
    ) { }

    public async getUSerByEmail(email: string): Promise<Array<GetUserInterface>> {
        const userExists = await this.userModel.getUserByEmail(email);
        return userExists;
    }

    public async createUser(createUser: CreateUserInterface): Promise<any> {
        return await this.userModel.createUser(createUser);
    }

    public async updateUser(updateUser: UpdateUserInterface): Promise<any> {
        return await this.userModel.updateUser(updateUser);
    }
}