## botdblocal

This package is used in create local dynamodb for [https://www.npmjs.com/package/@zoomus/chatbot-cli](https://www.npmjs.com/package/@zoomus/chatbot-cli). Now it must bind botConfig.js to use.

## Installation

`npm i botdblocal -D`

## Setup & Features

* Auto create local dynamodb in your package.
* Auto create tables which defined in botConfig.js by useDatabase key.


## cli

in general web server

`cross-env NODE_ENV=development botdblocal dynamodb`


in serverless environment

`cross-env NODE_ENV=development botdblocal serverless-dynamodb`


