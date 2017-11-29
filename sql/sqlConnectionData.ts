export class SqlConnectionData {
    private _host: string;
    private _user: string;
    private _password: string;
    private _database: string;

    constructor(user: string, password: string, host: string, database: string) {
        this._database = database;
        this._user = user;
        this._password = password;
        this._host = host;
    }

    get host(): string {
        return this._host;
    }

    get user(): string {
        return this._user;
    }

    get password(): string {
        return this._password;
    }

    get database(): string {
        return this._database;
    }
}