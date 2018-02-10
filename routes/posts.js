const express = require('express')
const router = express.Router()

const Post = require('./../models/Post')
const User = require('./../models/User')

router.get('/', async (req,res) => {
  const posts = await  Post.list()
  for (const post of posts) {
    post.user = await User.get(post.userId)
  }
  res.json(posts)
})
  
router.get('/:id', async (req,res) => {
  const post = await Post.get(req.params.id)
  if(!post){
    return res.sendStatus(404)
  }

  post.user = await User.get(post.userId)

  res.json(post)
})

  const requireAuth = (req,res,next) => {
    if(!req.user){
      return res.sendStatus(401)
    }
    next()
  }
  
  //create Post
router.post('/', async (req,res) =>{
  const post = await Post.create(req.user.id, req.body.title, req.body.content )
  res.json(post)
})

module.exports = router