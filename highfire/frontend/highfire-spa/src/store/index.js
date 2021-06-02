import Vue from 'vue'
import Vuex from 'vuex'

//imports of AJAX functions
import { fetchPosts, fetchPost, postNewPost, authenticate, register, likePost, postNewComment,deletePost,deleteComment} from '@/api'
import { isValidJwt, EventBus } from '@/utils'

Vue.use(Vuex)

let state = {
  // single source of data
  posts: [],
  currentPost: {},
  user: {},
  jwt: ''
}

const actions = {
  // asynchronous operations
  async loadPosts(context) {
    const response = await fetchPosts();
    context.commit('setPosts', {posts: response})
  },
  async loadPost(context, { id }) {
    const response = await fetchPost(id);
    context.commit('setPost', {post: response})
  },
  login (context, user) { //userdata gjør ingenting plz fix nub
    context.commit('setUserData', { user })
    return authenticate(user)
      .then(response => context.commit('setJwtToken', { jwt: response }))
      .catch(error => {
        console.log('Error Authenticating: ', error)
        EventBus.$emit('failedAuthentication', error)
      }) 
  },
  register (context, user) {
    context.commit('setUserData', { user })
    return register(user)
      .then(context.dispatch('login', user))
      .catch(error => {
        console.log('Error registering: ', error)
        EventBus.$emit('failedRegistering: ', error)
      })
  },
  submitNewPost(test){
    console.log(test)
    return postNewPost(test, localStorage.getItem('token'))
  },
  logout(){
    if (localStorage.getItem('user')) {
      localStorage.removeItem('user');
      if (localStorage.getItem('token')){
        localStorage.removeItem('token');
      }
    }
  },    
  addLike(context, id){
    likePost(id, localStorage.getItem('token'))
  },
  addComment(context, comment) {
    console.log(comment)
    return postNewComment(comment, localStorage.getItem('token'))
  },
  removePost(context, id){
    return deletePost(id)
  },
  removeComment(context, id){
    return deleteComment(id)
  }
}

const mutations = {
  // isolated data mutations
  setPosts(state, payload ) {
    state.posts = payload.posts
  },
  setPost(state, payload) {
    console.log(payload.post)
    state.currentPost = payload.post
  },
  setUserData (state, payload) {
    console.log('setUserData payload = ', payload)
    state.userData = payload.userData
  },
  setJwtToken  (state, payload) {
    console.log('setJwtToken payload = ', payload)
    localStorage.token = payload.jwt.token
    state.jwt = payload.jwt
  }
}

const getters = {
  // reusable data accessors
  isAutenticated () {
    if (localStorage.getItem('user')) {
      return true
    }
    return false
  }
}

const store = new Vuex.Store({
  state,
  actions,
  mutations,
  getters
})

export default store