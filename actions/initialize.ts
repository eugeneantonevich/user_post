import { SqlConnector, SqlConnectionData } from "../sql";
import { generateUsers } from "../generators/user";
import { generatePosts } from "../generators/post";
import { generateRoles } from "../generators/role";
import { generateDepends } from "../generators/dependUserPost";

function initialize(connectionData: SqlConnectionData): Promise<string> {
    let connection = SqlConnector.createConnection(connectionData);

    return new Promise<string>((resolve, reject) => {
        console.log('connect to sql');                
        SqlConnector.connect(connection)
            .then(() => {
                console.log('drop database ' + connectionData.database);
                return SqlConnector.queryIgnoreResponse(connection, 'drop database ' + connectionData.database);
            })
            .then(() => {
                console.log('create database ' + connectionData.database);
                return SqlConnector.query(connection, 'create database ' + connectionData.database);
            })
            .then(() => {
                console.log('user database ' + connectionData.database);
                return SqlConnector.query(connection, 'use ' + connectionData.database);
            })
            .then(() => {                
                console.log('crate table user');
                return SqlConnector.query(connection, 'create table user '
                + '( id int auto_increment primary key, name VARCHAR(255), createdAt date, updatedAt date)');
            })
            .then(() => {
                console.log('crate table post');
                return SqlConnector.query(connection, 
                    'create table post (id INT auto_increment primary key, title VARCHAR(255), createdAt date, updatedAt date)');
            })
            .then(() => {
                console.log('crate table role');
                return SqlConnector.query(connection, 
                    'create table role (id INT auto_increment primary key, name VARCHAR(255), createdAt date, updatedAt date)');
            })
            .then(() => {
                console.log('crate table user_post');
                return SqlConnector.query(connection, ' create table user_post '
                + '('
                + ' id_user int not null, '
                + ' id_post int not null, '
                + ' role varchar(100) not null, '
                + ' PRIMARY KEY (id_user, id_post),'

                + ' FOREIGN KEY (id_user)'
                + ' REFERENCES user(id),'
                    
                + ' FOREIGN KEY (id_post)'
                + ' REFERENCES post(id),'

                + ' createdAt date, updatedAt date'
                + ')');
            })
            .then(() => {
                console.log('generate users');
                return generateUsers(connection, 100);
            })
            .then(() => {
                console.log('generate posts');
                return generatePosts(connection, 100);
            })
            .then(() => {
                console.log('generate roles');
                return generateRoles(connection);
            })
            .then(() => {
                console.log('generate depend');
                return generateDepends(connection, 120);
            })
            .then(() => {
                resolve('initialize success');
            })
            .catch((reason) => {
                reject(reason);
            })
    });
}

export {initialize};