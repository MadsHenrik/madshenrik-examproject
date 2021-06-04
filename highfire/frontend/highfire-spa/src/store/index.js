import Vue from 'vue'
import Vuex from 'vuex'

//imports of AJAX functions
import { fetchPosts, fetchPost, postNewPost, authenticate, register, likePost, postNewComment,deletePost,deleteComment, getLikes} from '@/api'

Vue.use(Vuex)

let state = {
  // single source of data
  posts: [],
  currentPost: {},
  user: {},
  jwt: '',
  isLoggedIn: '',
  errorMsg: '',
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
  login (context, user) {
    context.commit('setUserData', { user })
    return authenticate(user)
      .then(() => context.dispatch('loginChecker'))
      .catch(error => {
        console.log('Error Authenticating: ', error)
        context.dispatch('errorMessage', error.message)
      })
  },
  register (context, user) {
    context.commit('setUserData', { user })
    return register(user)
      .catch(error => {
        console.log('Error registering: ', error.error)
        context.dispatch('errorMessage', error.error)
      })
  },
  submitNewPost(test){
    return postNewPost(test, localStorage.getItem('token'))
  },
  logout(context){
    if (localStorage.getItem('user')) {
      localStorage.removeItem('user');
      if (localStorage.getItem('token')){
        localStorage.removeItem('token');
      }
    }
    context.commit('logOut')
    context.dispatch('errorMessage', '')
  },
  loginChecker(context){
    if(localStorage.getItem('user')){
      context.commit('logIn')
    }
  },
  addLike(context, id){
    return likePost(id, localStorage.getItem('token'))
      .then(response => context.dispatch('loadPost', { id: response }))
  },
  addComment(context, comment) {
    return postNewComment(comment, localStorage.getItem('token'))
      .then(response => context.dispatch('loadPost', { id: response }))
  },
  removePost(context, id){
    return deletePost(id, localStorage.getItem('token'))
  },
  removeComment(context, id){
    return deleteComment(id, localStorage.getItem('token'))
      .then(response => context.dispatch('loadPost', { id: response }))
  },
  errorMessage(context, error){
    context.commit('setError', error )
  }
}

const mutations = {
  // isolated data mutations
  setPosts(state, payload ) {
    state.posts = payload.posts
  },
  setPost(state, payload) {
    state.currentPost = payload.post
  },
  setUserData (state, payload) {
    console.log('setUserData payload = ', payload)
    state.userData = payload.userData
  },
  logOut(state){
    state.isLoggedIn = false
  },
  logIn(state){
    state.isLoggedIn = true
  },
  setError(state, error){
    state.errorMsg = error
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