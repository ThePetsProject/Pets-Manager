import mongoose from 'mongoose'

export const mongoConnect = async (): Promise<string> => {
  const mongooseOptions: mongoose.ConnectOptions = {}
  const ddbb = 'tpp'
  const authSource = 'admin'
  const mongo = `mongodb://admin:adm@localhost:50112/${ddbb}?authSource=${authSource}`
  // const mongo =
  //   'mongodb+srv://tpp-login-manager:K4YF2qx3b5O07B16@private-thepetsproject-mongodb-e6963660.mongo.ondigitalocean.com/tpp?tls=true&authSource=admin&replicaSet=thepetsproject-mongodb&tlsCAFile=/etc/certs/mongo-ca-certificate.cer'
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
