import { SqlConnector } from "../sql/index";
import * as crypto from "crypto";

function generateSingleUser(connection) {
    let name: string = crypto.randomBytes(10).toString('hex');
    let query: string =  'insert into user (name) values (\'' + name + '\')';
    return SqlConnector.query(connection, query);
}

export function generateUsers(connection, number) {
    let insertions = [];
    for(let i = 0; i < 100; ++i) {
        insertions.push(generateSingleUser(connection));
    }                
    return Promise.all(insertions);
}

