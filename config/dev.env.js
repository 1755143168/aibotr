'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // API_BASE_URL: '"https://albert.8hhsj.com/api/web"'
  API_BASE_URL: '"http://192.168.31.140:8081/api/web"'
})


