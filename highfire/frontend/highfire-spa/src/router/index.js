import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Post from '@/components/Posts'
import NewPost from '@/components/NewPost'
import Login from '@/components/Login'
import Register from '@/components/Register'
import Logout from '@/components/Logout'

Vue.use(Router)

export default new Router({
  mode: "history",
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    }, {
      path: '/post/:id',
      name: 'Post',
      component: Post
    },  {
      path: '/post',
      name: 'NewPost',
      component: NewPost,
    }, {
      path: '/Login',
      name: 'Login',
      component: Login
    }, {
      path: '/register',
      name: 'Register',
      component: Register
    }, {
      path: '/logout',
      name: 'logout',
      component: Logout
    }, {
      path: '/:sok',
      name: 'Homesok',
      component: Home
    }
  ]
})
