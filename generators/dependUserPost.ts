import { SqlConnector } from "../sql/index";
import * as random from "random-number";
import { loadavg } from "os";
import * as crypto from "crypto";

function generateSingleDepend(connection) {
    let options = {
        min:  1,
        max:  100,
        integer: true
    };
    let role: string = crypto.randomBytes(3).toString('hex');
    let query: string =  'insert into user_post (id_user, id_post, role) values ('
     + random(options) + ', ' 
     + random(options) + ', ' 
     + '\'' + role + '\')';
     
    return SqlConnector.queryIgnoreResponse(connection, query);
}

export function generateDepends(connection, number) {
    let insertions = [];
    for(let i = 0; i < 100; ++i) {
        insertions.push(generateSingleDepend(connection));
    }                
    return Promise.all(insertions);
}