import { argv } from "optimist";
import * as _ from "lodash";
import * as definitions from "./definitions";
import {SqlConnectionData} from "./sql";
import * as actions from "./actions";
import { log } from "util";

function printUsage() {
    console.log('usage: \n'
    + ' -c <command> ' 
    + definitions.Command.init + ' / '
    + definitions.Command.select + ' / '
    + definitions.Command.selectOrm + ' , mandatory \n'
    + ' -d <database> database name, default = ' + definitions.Defaults.database + ' \n'
    + ' -u <user> sql connection user name, default = ' + definitions.Defaults.user + ' \n'
    + ' -p <password> sql connection user name, default = ' + definitions.Defaults.password + ' \n'
    + ' -h <host> sql connection user name, default = ' + definitions.Defaults.host);
}

let user: string = _.isNil(argv.u) ? definitions.Defaults.user : argv.u;
let host: string = _.isNil(argv.h) ? definitions.Defaults.host : argv.h;
let password: string = _.isNil(argv.p) ? definitions.Defaults.password : argv.p;
let database: string = _.isNil(argv.d) ? definitions.Defaults.database : argv.d;
let command: string = argv.c;

console.log('user = ' + user + '; password = ' + password + '; database = ' + database + '; host = ' + host);
console.log('command = ' + command);

let executionPromise = null;
let executionComplete = new Promise((resolve, reject) => {
  executionPromise = { resolve, reject };
});

let connectionData = new SqlConnectionData(user, password, host, database);

switch(command) {
    case definitions.Command.init: {
        console.log('try to initialize database');        
        actions.initialize(connectionData)
            .then((result) => {
                executionPromise.resolve(result);
            })
            .catch(err => {
                executionPromise.reject(err);
            });
    }
    break;
    case definitions.Command.select: {
        console.log('try to select');
        actions.select(connectionData)
            .then((result) => {
                executionPromise.resolve(result);
            })
            .catch(err => {
                executionPromise.reject(err);
            });
    }
    break;
    case definitions.Command.selectOrm: {
        console.log('try to select orm');
        actions.selectOrm(connectionData)
            .then((result) => {
                executionPromise.resolve(result);
            })
            .catch(err => {
                executionPromise.reject(err);
            });
    }
    break;
    default: {
        console.log('Invalid input arguments');
        printUsage();
    }    
}


executionComplete.then(
    (result) => {
        console.log(result);
        process.exit(0);
    },
    (err) => {
        console.log('execution error...');
        console.log(err.message);
        process.exit();
    }
  );
  




