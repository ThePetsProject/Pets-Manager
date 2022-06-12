import app from './app'
import { mongoConnect } from './infrastructure/database/connect'

const port = process.env.PORT || 3100

mongoConnect().then(() => {
  app.listen(port, async () => {
    console.log(`server is listening on ${port}`)
  })
})
