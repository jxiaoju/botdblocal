let nodepath = require('path');
// let fs = require('fs-extra');
// let spawn = require('cross-spawn');
let cwd = process.cwd();
var dynamodbLocal = require("dynamodb-localhost");
let dynogels=require('dynogels');

let run = props => {
  let { config } = props;
  if (typeof config !== 'string') {
    config = nodepath.join(cwd, 'botConfig.js');
  }
  let configObject = {};
  try {
    configObject = require(config);
  } catch (e) {
    console.log(e);
    return;
  }
  let { useDatabase } = configObject;
  if (typeof useDatabase !== 'object') {
    console.log(`${config} path don't have useDatabase config`);
    return;
  }
  if (typeof useDatabase.option !== 'object') {
    console.log('must have valid option in useDatabase');
    return;
  }
  let { port = 8089, tables, region = 'us-east-1' } = useDatabase.option;
  dynamodbLocal.remove(function(){
    // console.log('');
    console.log('install process,waiting ......')
    dynamodbLocal.install(function(){
      console.log('install dynamodb');
      dynamodbLocal.start({port,sharedDb:true,inMemory:true});
      let out={};
      dynogels.AWS.config.update({endpoint:`http://localhost:${port}`,region});
      let keys=Object.keys(tables);
      keys.forEach(key => {
        let obj = tables[key];
        let model=dynogels.define(obj.tableName, obj);
        out[key] = model;
      });
      
      dynogels.createTables(function(err) {
        if (err) {
          console.log('Error creating tables: ', err);
        } else {
          console.log('Tables have been created');
        }
      });

    });
  });
};

module.exports = run;
