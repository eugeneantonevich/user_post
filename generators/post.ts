import { SqlConnector } from "../sql/index";
import * as crypto from "crypto";

function generateSinglePost(connection) {
    let title: string = crypto.randomBytes(10).toString('hex');
    let query: string =  'insert into post (title) values (\'' + title + '\')';
    return SqlConnector.query(connection, query);
}

export function generatePosts(connection, number) {
    let insertions = [];
    for(let i = 0; i < 100; ++i) {
        insertions.push(generateSinglePost(connection));
    }                
    return Promise.all(insertions);
}

            
