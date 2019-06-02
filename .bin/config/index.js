#!/usr/bin/env node

/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 */

const shell = require('shelljs')
const exec = shell.exec
const build = async () => {
  await exec(
    `heroku config:set --app=fretefacil-dev FACEBOOK_CLIENT_SECRET=27545f26f6e4d15a6c0b09f8a2ef4917`
  )
  await exec(
    `heroku config:set --app=fretefacil-dev FIREBASE_CONFIG_API_KEY=AIzaSyBYFpayOEPmYnCxOHxdVdyVFQy6VnEuFZ8`
  )
  await exec(
    `heroku config:set --app=fretefacil-dev FIREBASE_CONFIG_AUTH_DOMAIN=fretefacil-dev.firebaseapp.com`
  )
  await exec(
    `heroku config:set --app=fretefacil-dev FIREBASE_CONFIG_STORAGE_BUCKET=fretefacil-dev.appspot.com`
  )
  await exec(`heroku config:set --app=fretefacil-dev FIREBASE_CONFIG_PROJECT_ID=fretefacil-dev`)
  await exec(
    `heroku config:set --app=fretefacil-dev GOOGLE_APPLICATION_CREDENTIALS_VALUE={"type":"service_account","project_id":"fretefacil-dev","private_key_id":"988f587f482d561b583f9e17c91f68e7c5464979","private_key":"-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCq9ZGBsUEauO4b\n43G/keBaqSYqmbAEqM7b+DR0FPIQVGWonyIDlRZJzxveL0vqz9/ejhHjltvy4qel\nvpTqD+wqEoj60Q09VhWSQk08A6NFCWK5dMo+YRai9OfoOxID4pKgQmeaR6ph4565\nzjlpq6BsM3i9bAf96afJ6SliDJ9iWZgIS8t+QLmaTdkTAlGC942XnSkcTGb9CmvY\nM9svTqzC8K1MW8z4exKc44pNAAYLdjRiOZxrDGvlxHFMgRFkju/KZamYyqjshQ3F\nWeoUoGp33srtADccpoq4Reofq2U/HYHTUQHAbZAz1KT8QD5r3dBKjymWM8pnESbA\nm1Ru9GxzAgMBAAECggEAPVdNdUZ/gLIYJYOPfdg+suj8W863PITBbGX7lCcrz7Yo\nn78xei2VSLh6XFeGGuOphPZe7tVjaBvxYWQnlHBQIaxy3+QApyBrLwaBJeZ8P7ol\nZTvFkWpOr/vF9iqzxRcX207YU6AhP2xnuG2JZiQBtLEnQngvyeh7ntP9WEQFMEk0\nmmrjsl3Ti10c4GPM+TJqBjUamYU55gXTF5saNsE0fPnFSGESjcs4f7rOTrG8S9I2\n9DT9XwxWHS+ois/u4oXmcqfnkobE7+TzTA1A+FWQtxnid9Xo6Imp8tIdeExDrLly\n2hxKX9a3nhJytw2/UKx+jbrGs04skeo7UXXHdcgrSQKBgQDl7kBNI4DzUcMIN745\nyW0qxjqogJDgKx/pE1mEXqqZUT804bBu+gnQvrlBCvi8C/ow6WTg1gDPid5DfXl3\nIHGPoHB+HBm7r2QnatF+vEbY3y0rr/am2W3Upa3s4PIEzPEPg5qveW2ezoyaTxe7\nw1WiM0EOPbmdWU2SJzkDwZYoFwKBgQC+V6tBEhX3G6Y8m3Z2GfATcoRXGf98z/sy\n5lD+sGEQ3Kx4eC/QqiY+thPAF2KKjMQbhuWtTzMd4gO0392/JSfImsLyetNmVbkE\nY9L4kks1bDRSN+JD8/tsxHWbIT702mmA6kpaYChqJFd7N6GyXrjwX0BiiyUp0cfV\nqUcLf0n8BQKBgQCDYDxxVuXpIUB0w5T3Y7XyiM0fVkZxL3LOM/YkAgssCxY4WvP6\nlPdixHcJSQGSQK21oMW5Cc3wx2+t1FXA0VLRo/Riuh+h87cgJpKI/X7lj685lRMz\nhmyQ4hGclXLzdz4NhT6vIIyX/qCr0qFW8WdOhEaZon8Z/tqptauID+aCBQKBgQC6\nxGdD2C05ZSX+vkTEqbrKOknk9Zudqq4/SYMcBZGY7A9Hvhac1vfj/ODwUYHdlTYw\nFHN1VQtBPS6J4khBcIHS8xhquV6JQX/j8NdoFJQ7fUrxieg46URBe5wydbLCqzVu\ny3XdrBC75aD5RKMi1JL/OVeB2irDGBbPbeRKQcIkyQKBgHEIKhbP1z67GpLgSRv0\nyIL+ZhDrIpkYBldSCf+xErqDMaMK55T+3cPXMJuIaDnR2V1GOk2wiX5/9Pn4XcqG\nQA8LKzgjAbcgGohgAook5MLK4MHQWDXFHOQgJWrIK+jZgD5VAINfryP9++9Ygp7v\nm3yTlT+LYnntrm2NfaroOros\n-----END PRIVATE KEY-----\n","client_email":"firebase-adminsdk-8q2g1@fretefacil-dev.iam.gserviceaccount.com","client_id":"105431116293143223374","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-8q2g1%40fretefacil-dev.iam.gserviceaccount.com"}`
  )
  await exec(
    `heroku config:set --app=fretefacil-dev MAIL_ASSETS_SERVER=http://fretefacil-mail.epizy.com`
  )
  await exec(`heroku config:set --app=fretefacil-dev MASTER_KEY=cdmqXCAr-M5X8jBsE`)
  await exec(`heroku config:set --app=fretefacil-dev MOIP_ACCOUNT_ID=pac.leo@hotmail.com`)
  await exec(
    `heroku config:set --app=fretefacil-dev MOIP_API_KEY=VXNATZPPHJC4IVX5RAZPLS3E28DCKK9UOTNZXJY0`
  )
  await exec(
    `heroku config:set --app=fretefacil-dev MOIP_API_TOKEN=HTBJUE2OBNABGQYLO3EGNGK6JEP3A66V`
  )
  await exec(`heroku config:set --app=fretefacil-dev MOIP_APP_ID=APP-9KX6N3TA2OUH`)
  await exec(
    `heroku config:set --app=fretefacil-dev MOIP_APP_SECRET=c4ce6a057cb74a32acccc39755eede3e`
  )
  await exec(
    `heroku config:set --app=fretefacil-dev MOIP_APP_TOKEN=13688446328747489459b0b928f41eb7_v2`
  )
  await exec(
    `heroku config:set --app=fretefacil-dev MOIP_BASE64=SFRCSlVFMk9CTkFCR1FZTE8zRUdOR0s2SkVQM0E2NlY6VlhOQVRaUFBISkM0SVZYNVJBWlBMUzNFMjhEQ0tLOVVPVE5aWEpZMA==`
  )
  await exec(`heroku config:set --app=fretefacil-dev MOIP_BASE_URL=https://api.moip.com.br`)
  await exec(
    `heroku config:set --app=fretefacil-dev MOIP_PUB_KEY=-----BEGIN PUBLIC KEY-----MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAz0TmvvB/kEV6JZldkQS27+kV2Cs/MELqyYyVm2MDOkNlzMo7JSxXLTaJbqnlvXfe1BXmculur6E6bKKY9XdEgmkU2joOo5NR6/efabv6IZR0bbNYg8wzQiyR56uczVF8tRtKkUTqYUFd8Fu3LYG+gdQ24I+1Vc0WZ83d7Hr1tSd9FloUzzdbaQ0J/IXlq8OHVccj0i72hb81+nHVKuFBoO3uWbJDbwLKkSY1dJ1N157V7UIe6zV2i0JJRGMmznoC8LXlHDR3goja72pzged5S06yxYPX2XsfIxhBKaZpyA0MNoWAWa6k17DXZCmJO2B2q/6wcMObOwrf/j5WhAJMYwIDAQAB-----END PUBLIC KEY-----`
  )
  await exec(
    `heroku config:set --app=fretefacil-dev MOIP_SUBSCRIPTION_KEY=XAIS5SAI8GJRJNYRDZI5PVGXJU9RPECX`
  )
  await exec(
    `heroku config:set --app=fretefacil-dev MONGODB_URI=mongodb://fretefacildevteam:cdmqXCAr-M5X8jBsE@fretefacildev-shard-00-00-uhxds.mongodb.net:27017,fretefacildev-shard-00-01-uhxds.mongodb.net:27017,fretefacildev-shard-00-02-uhxds.mongodb.net:27017/test?ssl=true&replicaSet=fretefacildev-shard-0&authSource=admin&retryWrites=true`
  )
  await exec(
    `heroku config:set --app=fretefacil-dev ONESIGNAL_API_KEY=MTg2ZDRlZTItNjgwNC00OGQ1LWJmOGQtZTdiOTYzYzg1MzFh`
  )
  await exec(
    `heroku config:set --app=fretefacil-dev PROJECT_ACCOUNTS_EMAIL=fretefacildevteam@gmail.com`
  )
  await exec(`heroku config:set --app=fretefacil-dev PROJECT_CODENAME=fretefacil`)
  await exec(`heroku config:set --app=fretefacil-dev PROJECT_CONTACT_EMAIL=ola@fretefacil.com.br`)
  await exec(`heroku config:set --app=fretefacil-dev PROJECT_DISPLAY_NAME=99Pets`)
  await exec(
    `heroku config:set --app=fretefacil-dev PROJECT_SERVER_ADDRESS=fretefacil-dev.herokuapp.com`
  )
  await exec(`heroku config:set --app=fretefacil-dev PROJECT_WEBSITE=www.fretefacil.com.br`)
  await exec(
    `heroku config:set --app=fretefacil-dev SENDGRID_API_KEY=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`
  )
  await exec(`heroku config:set --app=fretefacil-dev STAGE=dev`)
}

build()
