import { db } from '../Database/database';
import { CreateUserInterface, UpdateUserInterface } from '../Interfaces/user.interface';

export class UserModel {

    public async getUserByEmail(email: string): Promise<any> {
        const sql = `
            SELECT
                *
            FROM
                users
            WHERE
                email = '${email}'
        `;

        let [resp] = await db.query(sql);

        return resp;
    }

    public async createUser(createUser: CreateUserInterface): Promise<any> {
        const sql = `
            INSERT INTO users
                (name, email, password)
            VALUES
                (?, ?, ?)
        `;

        const params = [createUser.name, createUser.email, createUser.password];

        return await db.query(sql, params);
    }

    public async updateUser(updateUser: UpdateUserInterface): Promise<any> {
        const sql = `
            UPDATE
                users
            SET
                name = ?
            WHERE
                id = ?
        `;

        const params = [updateUser.name, updateUser.id];

        return await db.query(sql, params);
    }
}