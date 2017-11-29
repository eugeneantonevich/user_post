import { SqlOrmConnector, SqlConnectionData } from "../sql";
import * as _ from "lodash";
import { connect } from "tls";

function trasformToContributorUsageView(data): any {
    return _.values(_.transform(data.depends, (result, value) => {
        if (_.isNil(result[value.id_post])) {
            result[value.id_post] = { id: value.id_post, title: data.posts[value.id_post], contributors: [] };
        }
        result[value.id_post].contributors.push({ id: value.id_user, user: data.users[value.id_user], role: data.roles[value.id_role] });
    }, {}));
}

export function selectOrm(connectionData: SqlConnectionData) {
    let connection = SqlOrmConnector.createConnection(connectionData);
    let selected = null;
    let tables = SqlOrmConnector.initialize(connection);
    
    return new Promise<string>((resolve, reject) => {
        tables.UserPost.findAndCountAll( { group: 'id_post' })
            .then((result) => {
                console.log('select complete');                
                return _.transform(result.count, (res, value, index) => {
                    if (value.count > 1) {
                        res.push(result.rows[index].dataValues);
                    }
                }, []);
            })
            .then((depends) => {
                return tables.UserPost.findAll({ where: { id_post: _.map(depends, 'id_post') } });
            })
            .then((depends) => {
                return _.map(depends, 'dataValues');
            })
            .then((depends) => {
                const posts = tables.Post.findAll({ attributes: ['id', 'title'], where: { id: _.map(depends, 'id_post') } });
                const users = tables.User.findAll({ attributes: ['id', 'name'], where: { id: _.map(depends, 'id_user') } });
                const roles = tables.Role.findAll({ attributes: ['id', 'name']});
                return Promise.all([posts, users, roles, depends]);
            })
            .then((result) => {
                const data = {
                    posts: _.mapValues(_.keyBy(_.map(result[0], 'dataValues'), 'id'), 'title'),
                    users: _.mapValues(_.keyBy(_.map(result[1], 'dataValues'), 'id'), 'name'),
                    roles: _.mapValues(_.keyBy(_.map(result[2], 'dataValues'), 'id'), 'name'),
                    depends: result[3]
                }
                resolve(JSON.stringify(trasformToContributorUsageView(data), null, 2));

            })
            .catch((reason) => {
                reject(reason);
            })
        });        
    
}

