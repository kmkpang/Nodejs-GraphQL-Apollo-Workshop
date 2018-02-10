const express = require('express')
const bodyParser = require('body-parser')

const app = express()

const postsRoute = require('./routes/posts')
const usersRoute = require('./routes/users')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const User = require('./models/User')

const authMiddleware =  async (req,res,next) => {
  const token = req.query.token|| req.headers.authorization
  if(token){
    const user = await User.getByToken(token)
    if(!user){
      return res.sendStatus(401)
    }
    req.user = user
  }
  next()
}

app.use(authMiddleware)

app.use('/posts', postsRoute)
app.use('/users', usersRoute)

app.listen(3001)