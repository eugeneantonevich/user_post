import { SqlConnector } from "../sql/index";
import * as crypto from "crypto";

export function generateRoles(connection) {    
    let insertCreatorQuery: string =  'insert into role (name) values (\'creator\')';
    let insertCreatorPromise = SqlConnector.query(connection, insertCreatorQuery);

    let insertContributorQuery: string =  'insert into role (name) values (\'contributor\')';
    let inserContributorPromise = SqlConnector.query(connection, insertContributorQuery)

    let insertModeratorQuery: string =  'insert into role (name) values (\'moderator\')';
    let insertModeratorPromise = SqlConnector.query(connection, insertModeratorQuery);
    return Promise.all([insertCreatorPromise, inserContributorPromise, insertModeratorPromise]);
}