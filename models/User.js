const db = require('../db')
const _ = require('lodash')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

const secret = 'QWERTY'

const User = {
  get: async (id) => {
    const users = await db('users').where({ id })
    return  _.omit(users[0],'password')
  },
  
  // list: async  () => { 
  //     const posts = await db('posts').select()
  //     return posts
  // }

  auth: async (username, password) =>{
    const hashed = crypto.createHmac('sha256',secret).update(password).digest('hex')

    const users = await db('users').where({ 
      username ,
      password: hashed
    })
    const user = users[0]

    if(!user){
      return null
    }

    //chaeck if password match

    return jwt.sign({
      userId : user.id
    }, secret )
  },

  getByToken : async(token) => {
    try{
      const payload = jwt.verify(token,secret)
      const user = await User.get(payload.userId)
      return user
    }catch (err){
      if(err.name === 'JsonWebTokenError'){
        return null
      }
      throw err
    }
  }

}

module.exports = User

// User.auth('user1','password').then(console.log)

User.getByToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjksImlhdCI6MTUxODI0NTk2Mn0.mnRJUr0BO_Mmdu6-iaK2boUgSLvqq4xvIW_tuWulaio').then(console.log)

// User.get(9).then((user) => console.log(user) )

// async+await

// const f = async () => {
//     const p = await Post.get(18)
//     console.log(p)
// }

//promise