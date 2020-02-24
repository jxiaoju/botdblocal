let nodepath = require('path');
let fs = require('fs-extra');
let spawn = require('cross-spawn');
let cwd = process.cwd();
let dynogels = require('dynogels');

let run = props => {
  let { config } = props;
  if (typeof config !== 'string') {
    config = nodepath.join(cwd, 'botConfig.js');
  }
  let configObject = {};
  let env=process.env.NODE_ENV||'development';
  
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
 
  port=+port;
  
  spawn.sync('sls', ['dynamodb', 'remove','--stage',env], { stdio: 'inherit' });
  
  fs.removeSync(nodepath.resolve('.dynamodb'));
  
  spawn.sync('sls', ['dynamodb', 'install','--stage',env], { stdio: 'inherit' });

  setTimeout(()=>{

    let out = {};

    dynogels.AWS.config.update({ endpoint: `http://localhost:${port}`, region });
    let keys = Object.keys(tables);
    keys.forEach(key => {
      let obj = tables[key];
      let model = dynogels.define(obj.tableName, obj);
      out[key] = model;
    });
    dynogels.createTables(function(err) {
      if (err) {
        console.log('Error creating tables: ', err);
      } else {
        console.log('Tables have been created');
      }
    });

  },7000);

  spawn('sls', ['dynamodb', 'start', '--port', port,'--stage',env], {
    stdio: 'inherit'
  });

  console.log(`db start`);

};

module.exports = run;
