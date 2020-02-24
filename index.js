#!/usr/bin/env node

const nodepath = require('path');
const program = require('commander');
const fs = require('fs-extra');
let packageInfo=fs.readJsonSync(nodepath.join(__dirname,'./package.json'));
let dynamodbPackage=require('./src/dynamodb');
let slsdynamodbPackage=require('./src/serverless-dynamodb');

program
  .version(packageInfo.version)
  .command('dynamodb')
  .option('-c,--config <conf>','use current config file')
  .option('-c,--inMemory <inMemory>','use current config file')
  .action(function(props) {
    dynamodbPackage(props);
  });


program
  .version(packageInfo.version)
  .command('serverless-dynamodb')
  .option('-c,--config <conf>','use current config file')
  .action(function(props) {
    slsdynamodbPackage(props);
  });


program.parse(process.argv);
