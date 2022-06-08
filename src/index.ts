import app from './app'
import displayRoutes from 'express-routemap'

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`server is listening on ${port}`)
  displayRoutes(app)
})
