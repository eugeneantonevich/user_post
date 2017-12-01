import { SqlOrmConnector, SqlConnectionData } from "../sql";
import * as _ from "lodash";
import { connect } from "tls";
import * as sequelize from "sequelize";

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
    console.log('init success');
    const Op = sequelize.Op;

    return new Promise<string>((resolve, reject) => {        
        tables.Post.findAll( {
            attributes: ['id', [sequelize.fn('COUNT', sequelize.col('users.id')), 'user_count']],
            having: {
                user_count: { gt: 1 }
            },
            include: [ 
                { 
                    model: tables.User,
                    attributes: []                    
                } 
            ]
            ,group: ['post.id']
        })
        .then((posts) => {
            return tables.Post.findAll({
                where: {
                    id: { in: _.map(posts, 'id')}
                },
                attributes: ['id', 'title'],
                include: {
                    model: tables.User,
                    attributes: ['name'],
                    through: { attributes: ['role'] }
                }
            })
        })
        .then((depends) => {
            resolve(JSON.stringify(depends, null, 2))
        })
        .catch((reason) => {
            reject(reason);
        })            
    });    
}

