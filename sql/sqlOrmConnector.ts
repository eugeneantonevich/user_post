import * as _ from "lodash";
import { SqlConnectionData } from "./index";
import { Sequelize } from "sequelize"

export class SqlOrmConnector {

    static initialize(sequelize) {
        const User = sequelize.define('user', {            
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            name: {
                type: Sequelize.STRING,              
            }
        },
        {
            freezeTableName: true
        });

        const Role = sequelize.define('role', {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                primaryKey: true
              },
            name: {
                type: Sequelize.STRING,              
            }
        },
        {
            freezeTableName: true
        });

        const Post = sequelize.define('post', {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            title: {
                type: Sequelize.STRING,              
            }
        }, 
        {
            freezeTableName: true
        });
        
        const UserPost = sequelize.define('user_post', {}, { freezeTableName: true });
        
        UserPost.belongsTo(User, {foreignKey: 'id_user', targetKey: 'id'});
        UserPost.belongsTo(Post, {foreignKey: 'id_post', targetKey: 'id'});
        UserPost.belongsTo(Role, {foreignKey: 'id_role', targetKey: 'id'});

        return { User, Role, UserPost, Post };        
    }
    

    static createConnection(data: SqlConnectionData) {
        const Op = Sequelize.Op;
        return new Sequelize(
            data.database,
            data.user,
            data.password,
            {
                operatorsAliases: Op,
                host: data.host,
                port: 3306,
                dialect: 'mysql'
            }
        );        
    }
}
