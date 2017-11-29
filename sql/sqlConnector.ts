import * as _ from "lodash";
import * as mysql from 'mysql2';
import { SqlConnectionData } from "./index";

export class SqlConnector {

    static connect(connection): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            connection.connect((err) => {
                _.isNil(err) ? resolve(connection) : reject(err);
            });
        })
    }

    static query(connection, queryText: string): Promise<any> {
        return new Promise<string>((resolve, reject) => {
            connection.query(queryText, (err, result) => {
                _.isNil(err) ? resolve(result) : reject(err);
            })
        });
    }

    static queryIgnoreResponse(connection, queryText: string): Promise<any> {
        return new Promise<void>((resolve) => {
            connection.query(queryText, (err, result) => {
                resolve();
            })
        });
    }

    static createConnection(data: SqlConnectionData) {
        return mysql.createConnection({
            user: data.user, 
            password: data.password, 
            host: data.host
        });
    }
}
