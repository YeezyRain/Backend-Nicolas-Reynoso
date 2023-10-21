const mongoose = require('mongoose')
const {dbAdmin, dbHost, dbPassword, dbName} = require('../src/config/db.config')

const mongoConnect = async () => {
  try {
    console.log(`mongodb+srv://${dbAdmin}:${dbPassword}@${dbName}.${dbHost}/?retryWrites=true&w=majority`)
    await mongoose.connect('mongodb+srv://${dbAdmin}:${dbPassword}@${dbName}.${dbHost}/?retryWrites=true&w=majority')
    console.log('db is connected')
  } catch (error) {
    console.log(error)
  }
}

module.exports = mongoConnect