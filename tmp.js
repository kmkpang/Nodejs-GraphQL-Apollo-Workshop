const db = require('./db')

db('posts').select().then((posts) =>{
    console.log(posts)
})