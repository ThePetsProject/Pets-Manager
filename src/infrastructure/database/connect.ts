import mongoose from 'mongoose'

export const mongoConnect = async (): Promise<string> => {
  const mongooseOptions: mongoose.ConnectOptions = {}
  const ddbb = 'tpp'
  const authSource = 'admin'
  const mongo = `mongodb://admin:adm@localhost:50112/${ddbb}?authSource=${authSource}`
  return new Promise((resolve, reject) => {
    mongoose.connect(mongo, mongooseOptions).then(
      () => {
        console.log('Connected to Mongo')
        return resolve('')
      },
      (err) => {
        console.error(`Error! --> ${err}`)
        return reject(err)
      }
    )
  })
}
