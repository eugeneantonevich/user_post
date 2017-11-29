import { SqlConnector, SqlConnectionData } from "../sql";
import * as _ from "lodash";

function trasformToContributorUsageView(data): any {    
    return _.values(_.transform(data, (result, value) => {
        if (_.isNil(result[value.post_id])) {
            result[value.post_id] = _.assign(_.pick(value, ['post_id', 'title']), { contributors: [] });
        }
        result[value.post_id].contributors.push( _.pick(value, ['user_id', 'role', 'user']));
    }, {}));    
}

export function select(connectionData: SqlConnectionData): Promise<string> {
    let connection = SqlConnector.createConnection(connectionData);
    let selected = null;
    return new Promise<string>((resolve, reject) => {
        console.log('connect to sql');                
        SqlConnector.connect(connection)
            .then(() => {
                console.log('use database ' + connectionData.database);
                return SqlConnector.query(connection, 'use ' + connectionData.database);
            })
            .then(() => {
                return SqlConnector.queryIgnoreResponse(connection, 'drop view v;');
            })
            .then(() => {
              console.log('select');
              return SqlConnector.query(connection, 
                '	create view v as \n'
                +   'SELECT up.id_user, up.id_post, up.id_role FROM user_post up \n '
                +   'WHERE  id_post in \n'
                +   '( \n'
                +   'SELECT id_post FROM user_post \n'
                +   'GROUP BY id_post \n'
                +   'HAVING COUNT(id_post) > 1 \n'
                +   ');')
            .then(() => {
                return SqlConnector.query(connection, 
                    'select post.id post_id, user.id user_id, post.title title, user.name user, role.name role from post \n'
                +   'inner join v on post.id = v.id_post \n'
                +   'inner join user on user.id = v.id_user \n'
                +   'inner join role on role.id = v.id_role \n'
                +   'order by post.id; \n'
                )
            })
            .then((result) => {
                selected = result;
                return SqlConnector.query(connection, 'drop view v;');
            })
            .then(() => {
                resolve(JSON.stringify(trasformToContributorUsageView(selected), null, 2));
            })
            .catch((reason) => {
                reject(reason);
            })
        });
    });
}