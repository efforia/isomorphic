#!/usr/bin/env node

/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 */

const shell = require('shelljs')
const exec = shell.exec
const path = require('path')
const params = require('yargs').argv
const config = require('dotenv').config()
require('dotenv-expand')(config)
require('colors')

const rootPath = path.resolve(__dirname, '../../')
const deployEnvironment = params.env || process.env.npm_config_env || 'dev'
const remote = `https://git.heroku.com/${process.env.PROJECT_CODENAME}-${deployEnvironment}.git`

const build = async () => {
  console.log(`☮   Server: Building server app for ${deployEnvironment} environment...`.yellow)
  // Use this for commit based deploys
  console.log(`☮   Server: Generating commit...`.yellow)
  const commitMsg = 'update(server): Atualização do servidor de aplicação.'
  await exec('git add .', { cwd: rootPath })
  await exec(`git commit -m '${commitMsg}'`, { cwd: rootPath })
  await exec(`git push ${remote} master -f`, { cwd: rootPath })
  console.log(`☮   Server: build deployed successfully!`.green)
  process.exit()
}

build()
